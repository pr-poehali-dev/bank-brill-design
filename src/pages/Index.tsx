import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('hero');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', full_name: '' });

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/019819e4-bdb4-41a5-a033-2e502200b77f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...loginForm })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('brill_token', data.token);
        localStorage.setItem('brill_user', JSON.stringify(data.user));
        toast({ title: 'Успешно!', description: 'Вы вошли в систему' });
        setIsAuthOpen(false);
        navigate('/dashboard');
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось войти', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с подключением', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/019819e4-bdb4-41a5-a033-2e502200b77f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...registerForm })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('brill_token', data.token);
        localStorage.setItem('brill_user', JSON.stringify(data.user));
        toast({ title: 'Добро пожаловать!', description: 'Регистрация прошла успешно' });
        setIsAuthOpen(false);
        navigate('/dashboard');
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось зарегистрироваться', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с подключением', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      icon: 'CreditCard',
      title: 'Дебетовые карты',
      description: 'Карты с кэшбэком до 10% и бесплатным обслуживанием',
      features: ['Кэшбэк до 10%', 'Без комиссий', 'Apple Pay / Google Pay']
    },
    {
      icon: 'Wallet',
      title: 'Кредитные карты',
      description: 'Льготный период до 120 дней без процентов',
      features: ['120 дней без %', 'Лимит до 1 млн ₽', 'Онлайн-одобрение']
    },
    {
      icon: 'TrendingUp',
      title: 'Вклады',
      description: 'Ставки до 18% годовых с возможностью пополнения',
      features: ['До 18% годовых', 'Пополняемые', 'Застрахованы']
    },
    {
      icon: 'Home',
      title: 'Ипотека',
      description: 'Ставка от 5.9% на новостройки и вторичное жилье',
      features: ['От 5.9% годовых', 'Одобрение за 1 день', 'До 30 лет']
    },
    {
      icon: 'Smartphone',
      title: 'Мобильный банк',
      description: 'Все операции в одном приложении',
      features: ['Переводы 24/7', 'Оплата услуг', 'Контроль расходов']
    },
    {
      icon: 'Shield',
      title: 'Страхование',
      description: 'Защита здоровья, имущества и путешествий',
      features: ['Онлайн-оформление', 'Быстрые выплаты', 'Круглосуточная поддержка']
    }
  ];

  const faqs = [
    {
      question: 'Как открыть счёт в BRILL?',
      answer: 'Откройте счёт онлайн за 5 минут через наше мобильное приложение или сайт. Понадобится только паспорт и СНИЛС. Курьер доставит карту бесплатно в удобное время.'
    },
    {
      question: 'Какие комиссии за обслуживание?',
      answer: 'Базовое обслуживание бесплатно. Переводы внутри банка — 0₽, на карты других банков до 100 000₽ в месяц — без комиссии. Снятие наличных в банкоматах BRILL — бесплатно.'
    },
    {
      question: 'Как получить кредитную карту?',
      answer: 'Заполните заявку онлайн, решение за 1 минуту. Одобренную карту доставим курьером или заберите в отделении. Льготный период — до 120 дней.'
    },
    {
      question: 'Защищены ли мои деньги?',
      answer: 'Да, все вклады застрахованы АСВ до 1.4 млн рублей. Используем двухфакторную аутентификацию и 3D Secure для безопасности платежей.'
    },
    {
      question: 'Как связаться со службой поддержки?',
      answer: 'Мы на связи 24/7: телефон 8-800-100-BRILL, чат в приложении, онлайн-консультант на сайте или пишите в соцсети. Среднее время ответа — 30 секунд.'
    }
  ];

  const stats = [
    { value: '2.5М+', label: 'Клиентов' },
    { value: '150+', label: 'Отделений' },
    { value: '24/7', label: 'Поддержка' },
    { value: '98%', label: 'Довольных клиентов' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Icon name="Sparkles" className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BRILL
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-primary transition-colors">
                Услуги
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-primary transition-colors">
                О банке
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">Войти</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Добро пожаловать в BRILL</DialogTitle>
                    <DialogDescription>Войдите или создайте новый аккаунт</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Вход</TabsTrigger>
                      <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Пароль</Label>
                        <Input 
                          id="login-password" 
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary" 
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Вход...' : 'Войти'}
                      </Button>
                    </TabsContent>
                    <TabsContent value="register" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">ФИО</Label>
                        <Input 
                          id="register-name" 
                          placeholder="Иван Иванов"
                          value={registerForm.full_name}
                          onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Пароль</Label>
                        <Input 
                          id="register-password" 
                          type="password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary" 
                        onClick={handleRegister}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" onClick={() => setIsAuthOpen(true)}>
                Открыть счёт
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Банк нового поколения
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Управляйте финансами легко и безопасно. Открывайте счета онлайн, получайте кэшбэк и пользуйтесь современными финансовыми инструментами.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8 py-6">
                <Icon name="Sparkles" className="mr-2" />
                Стать клиентом
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Icon name="Play" className="mr-2" />
                Смотреть демо
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-slide-up">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Наши услуги</h2>
            <p className="text-xl text-muted-foreground">Всё для комфортного управления финансами</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <Icon name={service.icon} className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Icon name="Check" className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full mt-4 group">
                    Подробнее
                    <Icon name="ArrowRight" className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Вопросы и ответы</h2>
            <p className="text-xl text-muted-foreground">Ответы на частые вопросы наших клиентов</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 rounded-lg px-6 hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">О банке BRILL</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Мы создаём финансовые продукты, которые делают вашу жизнь проще
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Target" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Наша миссия</h3>
                  <p className="text-muted-foreground">
                    Сделать банковские услуги доступными, понятными и удобными для каждого. 
                    Мы верим в прозрачность, инновации и заботу о клиентах.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Award" className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Наши ценности</h3>
                  <p className="text-muted-foreground">
                    Честность, надёжность и инновации — основа нашей работы. 
                    Мы постоянно развиваемся, чтобы предложить вам лучший сервис.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Наша команда</h3>
                  <p className="text-muted-foreground">
                    Более 5000 профессионалов работают над тем, чтобы ваш опыт с BRILL был безупречным. 
                    Мы всегда рядом, когда вам нужна помощь.
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
              <CardHeader>
                <CardTitle className="text-3xl">Почему BRILL?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Zap" className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Мгновенные переводы 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Lock" className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Максимальная безопасность данных</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Percent" className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Выгодные условия и кэшбэк</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Headphones" className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Поддержка без выходных</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Smartphone" className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Удобное мобильное приложение</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6">
                  Присоединиться к BRILL
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Sparkles" className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">BRILL</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Банк нового поколения для ваших финансовых целей
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Карты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Вклады</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Кредиты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ипотека</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Карьера</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Пресс-центр</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">8-800-100-BRILL</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Чат поддержки</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2024 BRILL. Все права защищены.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;