import json
import os
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Money transfer system with external card support
    Args: event with httpMethod (POST), body with from_user_id, to_card, amount
    Returns: HTTP response with transfer status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    from_user_id = body_data.get('from_user_id')
    to_card = body_data.get('to_card', '').strip().replace(' ', '')
    amount = body_data.get('amount', 0)
    
    if not all([from_user_id, to_card, amount]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Все поля обязательны'})
        }
    
    try:
        amount_decimal = Decimal(str(amount))
        if amount_decimal <= 0:
            raise ValueError()
    except (ValueError, TypeError):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Некорректная сумма'})
        }
    
    if len(to_card) != 16 or not to_card.isdigit():
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Номер карты должен содержать 16 цифр'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT balance FROM users WHERE id = %s", (from_user_id,))
        user_row = cursor.fetchone()
        
        if not user_row:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пользователь не найден'})
            }
        
        current_balance = Decimal(str(user_row[0]))
        
        if current_balance < amount_decimal:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Недостаточно средств'})
            }
        
        new_balance = current_balance - amount_decimal
        cursor.execute("UPDATE users SET balance = %s WHERE id = %s", (float(new_balance), from_user_id))
        
        cursor.execute(
            """INSERT INTO transactions (user_id, type, amount, description, card_number, status) 
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (from_user_id, 'transfer', float(amount_decimal), f'Перевод на карту {to_card[-4:]}', to_card, 'completed')
        )
        
        conn.commit()
        
        card_type = 'Сбербанк' if to_card.startswith('2') else 'Внешний банк'
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'Перевод {amount_decimal}₽ на карту {card_type} успешно выполнен',
                'new_balance': float(new_balance),
                'transfer_details': {
                    'card_mask': f'**** {to_card[-4:]}',
                    'amount': float(amount_decimal),
                    'bank': card_type
                }
            })
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка перевода: {str(e)}'})
        }
    
    finally:
        cursor.close()
        conn.close()
