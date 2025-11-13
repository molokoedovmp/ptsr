# 🚀 Инструкция по настройке проекта с PostgreSQL

## Шаг 1: Установка зависимостей

```bash
cd /Users/mikhailmolokoedov/Documents/ptsr
npm install
```

## Шаг 2: Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
touch .env
```

Добавьте следующие переменные:

```env
# URL подключения к вашей PostgreSQL базе данных
# Формат: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://username:password@your-server-host:5432/ptsr_expert?schema=public"

# NextAuth.js настройки
NEXTAUTH_URL="http://localhost:3000"

# Сгенерируйте секретный ключ (в терминале выполните: openssl rand -base64 32)
NEXTAUTH_SECRET="ваш-секретный-ключ-здесь"
```

### Пример для вашего удаленного сервера:

```env
чNEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Wf3K9xR8mN4pL2qY7tV5hB6jC1zD0sA3eG4wT8uP9vX="
```

## Шаг 3: Создание базы данных

Подключитесь к вашему PostgreSQL серверу и создайте базу данных:

```sql
CREATE DATABASE ptsr_expert;
```

Или используйте существующую базу данных, указав её название в `DATABASE_URL`.

## Шаг 4: Применение схемы базы данных

Prisma автоматически создаст все необходимые таблицы:

```bash
# Применить схему к базе данных
npx prisma db push

# Или создать миграцию (рекомендуется для продакшена)
npx prisma migrate dev --name init
```

Это создаст следующие таблицы:
- `users` - пользователи
- `accounts` - аккаунты NextAuth
- `sessions` - сессии NextAuth
- `verification_tokens` - токены верификации
- `mood_entries` - записи дневника настроения
- `diary_entries` - записи дневника активности
- `support_tickets` - тикеты поддержки
- `psychologist_profiles` - профили психологов
- `articles` - статьи
- `videos` - видео
- `courses` - курсы/программы
- `course_modules` - модули курсов
- `course_enrollments` - записи на курсы
- `transactions` - транзакции

## Шаг 5: Генерация Prisma Client

```bash
npx prisma generate
```

## Шаг 6: Создание первого администратора

### Вариант 1: Через скрипт (создайте файл)

Создайте файл `scripts/create-admin.ts`:

```typescript
import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = 'admin@ptsr-expert.ru'
  const password = 'admin123' // Смените на свой пароль
  const hashedPassword = await hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName: 'Администратор',
      roles: [UserRole.ADMIN],
    },
  })

  console.log('✅ Администратор создан:', user.email)
  console.log('Email:', email)
  console.log('Password:', password)
}

createAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Запустите:
```bash
npx ts-node scripts/create-admin.ts
```

### Вариант 2: Напрямую через SQL

```sql
-- Сгенерируйте хеш пароля через bcryptjs (12 раундов)
-- Хеш для пароля 'admin123': $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lXnvZJm.Qa0S

INSERT INTO users (id, email, password, full_name, roles, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@ptsr-expert.ru',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lXnvZJm.Qa0S',
  'Администратор',
  ARRAY['ADMIN']::user_role[],
  NOW(),
  NOW()
);
```

## Шаг 7: Запуск проекта

```bash
npm run dev
```

Откройте браузер: http://localhost:3000

## Шаг 8: Вход в систему

1. Перейдите на: http://localhost:3000/login
2. Введите:
   - Email: `admin@ptsr-expert.ru`
   - Пароль: `admin123` (или тот, что вы указали)
3. После входа вы увидите доступ к админ-панели

## 📊 Просмотр базы данных

Prisma Studio - визуальный редактор базы данных:

```bash
npx prisma studio
```

Откроется на http://localhost:5555

## 🔧 Полезные команды Prisma

```bash
# Просмотр текущей схемы БД
npx prisma db pull

# Применить изменения схемы
npx prisma db push

# Создать миграцию
npx prisma migrate dev --name название_миграции

# Применить миграции в продакшене
npx prisma migrate deploy

# Сбросить базу данных (ОСТОРОЖНО!)
npx prisma migrate reset

# Форматировать schema.prisma
npx prisma format

# Валидация схемы
npx prisma validate
```

## 🗄️ Структура базы данных

### Основные таблицы:

**users** - Пользователи
- id (cuid)
- email (unique)
- password (hashed)
- fullName
- phone
- avatarUrl
- roles (массив: ADMIN, SUPPORT, PSYCHOLOGIST, VOLUNTEER, USER)
- dateOfBirth, gender, country, city
- timestamps

**mood_entries** - Дневник настроения
- id, userId, moodLevel (1-5), moodType, notes, createdAt

**diary_entries** - Дневник активности
- id, userId, title, content, activityType, createdAt

**support_tickets** - Тикеты поддержки
- id, userId, subject, message, status, priority, assignedTo, timestamps

**psychologist_profiles** - Профили психологов
- id, userId, specialization[], experienceYears, education, bio, price, languages[], verified, available, rating

**courses** - Курсы/Программы
- id, title, slug, description, price, durationWeeks, level, published

**articles** - Статьи
- id, title, slug, content, category, tags[], published, viewCount

## 🔐 Безопасность

### Пароли
- Все пароли хешируются с помощью bcryptjs (12 раундов)
- Никогда не храните пароли в открытом виде

### Роли
- Роли хранятся напрямую в таблице users (массив)
- Проверка ролей через NextAuth callbacks

### Сессии
- JWT сессии через NextAuth
- Автоматическое обновление токенов

## 🚨 Частые проблемы

### Ошибка подключения к БД

```
Error: P1001: Can't reach database server
```

**Решение:**
- Проверьте, что PostgreSQL запущен
- Проверьте правильность DATABASE_URL
- Убедитесь, что порт 5432 открыт
- Проверьте логин/пароль

### Ошибка миграции

```
Error: P3009: migrate found failed migrations
```

**Решение:**
```bash
npx prisma migrate resolve --rolled-back "20240101000000_migration_name"
npx prisma migrate deploy
```

### Prisma Client не найден

```
Error: Cannot find module '@prisma/client'
```

**Решение:**
```bash
npx prisma generate
npm install
```

## 📝 Примеры запросов

### Создать пользователя

```typescript
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

const hashedPassword = await hash('password123', 12)

const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    fullName: 'Иван Иванов',
    roles: ['USER'],
  },
})
```

### Получить пользователя с ролями

```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  select: {
    id: true,
    email: true,
    fullName: true,
    roles: true,
  },
})
```

### Создать запись в дневнике

```typescript
const moodEntry = await prisma.moodEntry.create({
  data: {
    userId: user.id,
    moodLevel: 4,
    moodType: 'Хорошо',
    notes: 'Хороший день',
  },
})
```

## 🎉 Готово!

Теперь у вас есть полностью работающий проект с подключением к вашей PostgreSQL базе данных!

**Следующие шаги:**
1. Создайте администратора
2. Войдите в систему
3. Начните разработку функционала
4. Проверьте все страницы

**Документация:**
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

Удачи! 🚀

