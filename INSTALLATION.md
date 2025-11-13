# 🚀 Инструкция по установке и запуску

## Предварительные требования

Убедитесь, что у вас установлены:
- **Node.js** версии 18.0 или выше
- **npm** или **yarn**
- **Git** (для клонирования репозитория)
- Аккаунт **Supabase** (для базы данных и аутентификации)

## Шаг 1: Клонирование репозитория

```bash
cd /Users/mikhailmolokoedov/Documents/ptsr
# Проект уже создан локально
```

## Шаг 2: Установка зависимостей

```bash
npm install
```

Это установит все необходимые пакеты:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase Client
- Lucide Icons
- И другие зависимости

## Шаг 3: Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
touch .env.local
```

Добавьте следующие переменные окружения:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Как получить Supabase credentials:

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект или используйте существующий
3. Перейдите в Settings → API
4. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Шаг 4: Настройка базы данных Supabase

### 4.1. Создание таблиц

Выполните следующие SQL запросы в SQL Editor вашего Supabase проекта:

```sql
-- Создание enum для ролей
CREATE TYPE app_role AS ENUM ('admin', 'support', 'psychologist', 'volunteer', 'user');

-- Таблица профилей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица ролей пользователей
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Таблица записей настроения
CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_level INTEGER NOT NULL CHECK (mood_level >= 1 AND mood_level <= 5),
  mood_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица дневника
CREATE TABLE diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  activity_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2. Создание RPC функций

```sql
-- Функция проверки роли администратора
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция проверки роли поддержки
CREATE OR REPLACE FUNCTION is_support()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'support'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция проверки роли психолога
CREATE OR REPLACE FUNCTION is_psychologist()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'psychologist'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3. Включение Row Level Security (RLS)

```sql
-- Включить RLS на всех таблицах
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Политики для mood_entries
CREATE POLICY "Users can view own mood entries"
  ON mood_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Политики для diary_entries
CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary entries"
  ON diary_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Политики для user_roles (только админы)
CREATE POLICY "Only admins can manage roles"
  ON user_roles FOR ALL
  USING (is_admin() = true);
```

## Шаг 5: Запуск проекта

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

### Сборка для продакшена

```bash
npm run build
npm start
```

### Проверка линтера

```bash
npm run lint
```

## Шаг 6: Создание первого администратора

После запуска приложения:

1. Зарегистрируйтесь через интерфейс: [http://localhost:3000/register/user](http://localhost:3000/register/user)
2. Подтвердите email (проверьте Supabase Auth для тестового режима)
3. В Supabase SQL Editor выполните:

```sql
-- Замените 'user-id-здесь' на ваш реальный user ID
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-здесь', 'admin');
```

4. Перезагрузите страницу - теперь у вас есть доступ к админ-панели

## Структура проекта

```
ptsr/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Главная страница
│   ├── layout.tsx               # Корневой layout
│   ├── globals.css              # Глобальные стили
│   ├── login/                   # Страница входа
│   ├── register/                # Регистрация
│   ├── profile/                 # Личный кабинет
│   ├── mood-diary/              # Дневник настроения
│   ├── diary/                   # Дневник пользователя
│   ├── specialists/             # Список специалистов
│   ├── programs/                # Программы
│   ├── resources/               # Ресурсы
│   ├── admin/dashboard/         # Админ-панель
│   ├── support/dashboard/       # Панель поддержки
│   └── psychologist/dashboard/  # Кабинет психолога
├── components/                   # React компоненты
│   ├── Navigation.tsx           # Навигация
│   ├── Footer.tsx               # Футер
│   ├── ProtectedRoute.tsx       # Защита маршрутов
│   ├── admin/                   # Админ компоненты
│   ├── support/                 # Компоненты поддержки
│   └── psychologist/            # Компоненты психолога
├── contexts/                     # React контексты
│   └── AuthContext.tsx          # Контекст аутентификации
├── lib/                         # Утилиты
│   └── supabase.ts             # Клиент Supabase
├── package.json                 # Зависимости
├── tsconfig.json               # Конфигурация TypeScript
├── tailwind.config.ts          # Конфигурация Tailwind
└── README.md                   # Документация
```

## Доступные скрипты

```bash
npm run dev      # Запуск в режиме разработки
npm run build    # Сборка для продакшена
npm start        # Запуск продакшен сборки
npm run lint     # Проверка кода линтером
```

## Проблемы и решения

### Ошибка: "Module not found"

Убедитесь, что все зависимости установлены:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: "Supabase client error"

Проверьте правильность переменных окружения в `.env.local`

### Ошибка: "RLS policy violation"

Убедитесь, что все RLS политики созданы правильно в Supabase

## Полезные ссылки

- [Документация Next.js](https://nextjs.org/docs)
- [Документация Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md) - Документация по безопасности

## Контакты

Если у вас возникли вопросы:
- Email: support@ptsr-expert.ru
- Telegram: @ptsr_support

---

**Успешной разработки! 🚀**

