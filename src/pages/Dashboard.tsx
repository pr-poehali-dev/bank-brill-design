import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { AIChat } from '@/components/AIChat';

interface User {
  id: number;
  email: string;
  full_name: string;
  balance: number;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({ card: '', amount: '' });
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('brill_user');
    const token = localStorage.getItem('brill_token');
    
    if (!userData || !token) {
      navigate('/');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('brill_user');
    localStorage.removeItem('brill_token');
    navigate('/');
  };

  const handleTransfer = async () => {
    if (!user) return;
    
    const cardNumber = transferForm.card.replace(/\s/g, '');
    const amount = parseFloat(transferForm.amount);
    
    if (cardNumber.length !== 16 || !cardNumber.match(/^\d+$/)) {
      toast({ title: 'Ошибка', description: 'Номер карты должен содержать 16 цифр', variant: 'destructive' });
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Укажите корректную сумму', variant: 'destructive' });
      return;
    }
    
    setIsTransferring(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/324fd91b-43aa-4742-b718-3fb2844844c8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_user_id: user.id,
          to_card: cardNumber,
          amount: amount
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({ title: 'Успешно!', description: data.message });
        setUser({ ...user, balance: data.new_balance });
        localStorage.setItem('brill_user', JSON.stringify({ ...user, balance: data.new_balance }));
        setIsTransferOpen(false);
        setTransferForm({ card: '', amount: '' });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось выполнить перевод', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с подключением', variant: 'destructive' });
    } finally {
      setIsTransferring(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Icon name="Loader2" size={48} className="text-primary" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const recentTransactions = [
    { id: 1, type: 'income', description: 'Зачисление зарплаты', amount: 85000, date: '2024-11-18' },
    { id: 2, type: 'expense', description: 'Покупка в магазине', amount: -2500, date: '2024-11-17' },
    { id: 3, type: 'expense', description: 'Оплата интернета', amount: -800, date: '2024-11-16' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="https://cdn.poehali.dev/projects/4c12594c-86e0-45fc-b360-4939939a0f58/files/8d77fbea-dc20-4b72-94be-da8a6981b39a.jpg" alt="BRILL Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BRILL
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Добро пожаловать, {user.full_name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Управляйте своими финансами в одном месте</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-2 bg-gradient-to-br from-primary to-secondary text-white border-0 animate-scale-in">
              <CardHeader>
                <CardDescription className="text-white/80">Общий баланс</CardDescription>
                <CardTitle className="text-5xl font-bold">
                  {user.balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mt-4">
                  <Button variant="secondary" className="flex-1">
                    <Icon name="ArrowUpRight" className="mr-2" />
                    Пополнить
                  </Button>
                  <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="flex-1">
                        <Icon name="ArrowDownRight" className="mr-2" />
                        Перевести
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Перевод на карту</DialogTitle>
                        <DialogDescription>Переведите деньги на любую карту Сбербанка или другого банка</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Номер карты получателя</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={transferForm.card}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                              const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                              setTransferForm({ ...transferForm, card: formatted });
                            }}
                            maxLength={19}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Сумма перевода (₽)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="1000"
                            value={transferForm.amount}
                            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                          />
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <p className="font-medium mb-1">Доступно: {user?.balance.toLocaleString('ru-RU')} ₽</p>
                          <p className="text-muted-foreground text-xs">Переводы на карты других банков — без комиссии до 100 000₽/мес</p>
                        </div>
                        <Button
                          onClick={handleTransfer}
                          disabled={isTransferring}
                          className="w-full bg-gradient-to-r from-primary to-secondary"
                        >
                          {isTransferring ? 'Отправка...' : 'Перевести'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Моя карта</CardTitle>
                  <Icon name="CreditCard" className="text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">•••• 4242</p>
                <Button variant="outline" className="w-full">
                  <Icon name="Plus" className="mr-2 w-4 h-4" />
                  Заказать карту
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Icon name="Wallet" className="text-primary" />
                </div>
                <CardTitle className="text-lg">Вклады</CardTitle>
                <CardDescription>До 18% годовых</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                  <Icon name="TrendingUp" className="text-secondary" />
                </div>
                <CardTitle className="text-lg">Инвестиции</CardTitle>
                <CardDescription>Начните инвестировать</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Icon name="Shield" className="text-primary" />
                </div>
                <CardTitle className="text-lg">Страхование</CardTitle>
                <CardDescription>Защитите своё имущество</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Последние операции</CardTitle>
              <CardDescription>История ваших транзакций</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Icon 
                          name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                          className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                          size={20}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <span className={`font-semibold text-lg ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Показать все операции
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <AIChat />
    </div>
  );
};

export default Dashboard;