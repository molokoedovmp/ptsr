#!/bin/bash

echo "🐳 Запуск PTSR в Docker..."

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден"
    echo "📝 Создайте .env файл со следующими переменными:"
    echo ""
    echo "DATABASE_URL=\"postgresql://ptsr_user:ptsr_password@postgres:5432/ptsr_db\""
    echo "NEXTAUTH_SECRET=\"your-secret-key-at-least-32-characters\""
    echo "NEXTAUTH_URL=\"http://your-ip:3000\""
    echo "EMAIL_HOST=\"smtp.gmail.com\""
    echo "EMAIL_PORT=\"587\""
    echo "EMAIL_USER=\"your-email@gmail.com\""
    echo "EMAIL_PASSWORD=\"your-app-password\""
    echo "EMAIL_FROM=\"noreply@yourdomain.com\""
    echo ""
    read -p "Продолжить без .env файла? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Пересборка образов
echo "🔨 Сборка Docker образов..."
docker-compose build --no-cache

# Запуск контейнеров
echo "🚀 Запуск контейнеров..."
docker-compose up -d

# Ожидание запуска БД
echo "⏳ Ожидание запуска базы данных..."
sleep 10

# Показ логов
echo "📋 Логи приложения:"
docker-compose logs -f app

