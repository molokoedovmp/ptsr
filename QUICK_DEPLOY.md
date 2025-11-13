# Быстрое развертывание PTSR на сервере

## 1️⃣ Очистка старого проекта (на сервере)

```bash
# Подключитесь к серверу
ssh user@your-server-ip

# Остановите и удалите ВСЕ Docker контейнеры
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Удалите все образы
docker rmi $(docker images -q)

# Удалите volumes (ВНИМАНИЕ: удалятся данные БД!)
docker volume prune -f

# Полная очистка Docker
docker system prune -a --volumes -f

# Удалите старую папку проекта
cd ~
rm -rf ptsr
```

## 2️⃣ Клонирование нового проекта

```bash
# Клонируйте из Git
git clone https://github.com/molokoedovmp/ptsr.git
cd ptsr
```

## 3️⃣ Настройка переменных окружения

```bash
# Создайте .env файл
nano .env
```

Вставьте (замените на свои значения):

```env
DATABASE_URL="postgresql://ptsr_user:strong_password_2025@postgres:5432/ptsr_db"
NEXTAUTH_SECRET="сгенерируйте-через-openssl-rand-base64-32"
NEXTAUTH_URL="http://ваш-ip-сервера:3000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="ваш-email@gmail.com"
EMAIL_PASSWORD="ваш-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

### Генерация NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Узнать IP сервера:
```bash
hostname -I | awk '{print $1}'
```

## 4️⃣ Запуск проекта

```bash
# Автоматический запуск
chmod +x setup-docker.sh
./setup-docker.sh

# ИЛИ вручную:
docker-compose build --no-cache
docker-compose up -d
```

## 5️⃣ Проверка

```bash
# Статус контейнеров
docker-compose ps

# Логи
docker-compose logs -f

# Откройте в браузере
# http://ваш-ip:3000
```

## 6️⃣ Открытие порта (если нужно)

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## 🔄 Обновление проекта (в будущем)

```bash
cd ~/ptsr
docker-compose down
git pull origin main
docker-compose build --no-cache
docker-compose up -d
docker-compose logs -f
```

## 🛑 Остановка проекта

```bash
docker-compose down
```

## 📊 Полезные команды

```bash
# Логи приложения
docker-compose logs -f app

# Логи базы данных
docker-compose logs -f postgres

# Перезапуск
docker-compose restart

# Использование ресурсов
docker stats

# Подключение к БД
docker-compose exec postgres psql -U ptsr_user -d ptsr_db
```

---

**📖 Подробная инструкция:** `DEPLOY_SERVER.md`

