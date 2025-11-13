#!/bin/bash

echo "=================================="
echo "  PTSR Docker Setup"
echo "=================================="
echo ""

# Генерация NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Получение IP адреса
if command -v ipconfig &> /dev/null; then
    # macOS
    SERVER_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")
else
    # Linux
    SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
fi

echo "📋 Ваши настройки:"
echo "   IP адрес: $SERVER_IP"
echo "   Порт: 3000"
echo ""

# Создание .env файла
if [ -f .env ]; then
    echo "⚠️  Файл .env уже существует"
    read -p "Перезаписать? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Используется существующий .env файл"
    else
        rm .env
    fi
fi

if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cat > .env << EOF
# Database URL
DATABASE_URL="postgresql://ptsr_user:ptsr_password@postgres:5432/ptsr_db"

# NextAuth Configuration
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://$SERVER_IP:3000"

# Email Configuration (настройте под свой email)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
EMAIL_FROM="noreply@yourdomain.com"
EOF
    echo "✅ Файл .env создан"
    echo ""
    echo "⚠️  ВАЖНО: Отредактируйте .env и настройте:"
    echo "   - EMAIL_USER (ваш Gmail)"
    echo "   - EMAIL_PASSWORD (App Password из Gmail)"
    echo "   - EMAIL_FROM (адрес отправителя)"
    echo ""
    read -p "Нажмите Enter после настройки email..."
fi

echo ""
echo "🐳 Запуск Docker контейнеров..."
echo ""

# Остановка существующих контейнеров
docker-compose down 2>/dev/null

# Сборка и запуск
echo "🔨 Сборка образов (может занять несколько минут)..."
docker-compose build

echo ""
echo "🚀 Запуск контейнеров..."
docker-compose up -d

echo ""
echo "⏳ Ожидание запуска сервисов..."
sleep 15

echo ""
echo "✅ Docker контейнеры запущены!"
echo ""
echo "=================================="
echo "  Приложение готово!"
echo "=================================="
echo ""
echo "🌐 Откройте в браузере:"
echo "   http://$SERVER_IP:3000"
echo ""
echo "📊 Просмотр логов:"
echo "   docker-compose logs -f app"
echo ""
echo "🛑 Остановка:"
echo "   docker-compose down"
echo ""
echo "♻️  Перезапуск:"
echo "   docker-compose restart"
echo ""

