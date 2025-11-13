# Развертывание проекта PTSR на сервере

## Шаг 1: Подготовка сервера

```bash
# Подключитесь к серверу по SSH
ssh user@your-server-ip

# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker (если еще не установлен)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перелогиньтесь для применения изменений
exit
# Подключитесь снова
ssh user@your-server-ip

# Проверьте установку
docker --version
docker-compose --version
```

## Шаг 2: Очистка старого проекта

```bash
# Остановите и удалите ВСЕ контейнеры
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Удалите все образы
docker rmi $(docker images -q)

# Удалите все volumes (ВНИМАНИЕ: удалятся все данные БД!)
docker volume rm $(docker volume ls -q)

# Очистите систему Docker
docker system prune -a --volumes -f

# Удалите старую папку проекта (если есть)
rm -rf ~/ptsr
rm -rf ~/old-project-name  # замените на имя старой папки
```

## Шаг 3: Клонирование нового проекта

```bash
# Клонируйте проект из Git
cd ~
git clone https://github.com/molokoedovmp/ptsr.git
cd ptsr

# Создайте .env файл
nano .env
```

Вставьте в `.env` (замените значения на свои):

```env
# Database URL
DATABASE_URL="postgresql://ptsr_user:ptsr_password_2025@postgres:5432/ptsr_db"

# NextAuth Configuration
# Сгенерируйте: openssl rand -base64 32
NEXTAUTH_SECRET="ваш-секретный-ключ-минимум-32-символа"
NEXTAUTH_URL="http://ваш-ip-сервера:3000"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="ваш-email@gmail.com"
EMAIL_PASSWORD="ваш-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

Сохраните (Ctrl+O, Enter, Ctrl+X)

## Шаг 4: Генерация секретного ключа

```bash
# Сгенерируйте NEXTAUTH_SECRET
openssl rand -base64 32

# Скопируйте результат и вставьте в .env
```

## Шаг 5: Узнайте IP сервера

```bash
# Linux
hostname -I | awk '{print $1}'

# Или
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Обновите `NEXTAUTH_URL` в `.env` на этот IP

## Шаг 6: Запуск проекта

```bash
# Используйте автоматический скрипт
chmod +x setup-docker.sh
./setup-docker.sh

# ИЛИ запустите вручную:
docker-compose build --no-cache
docker-compose up -d

# Дождитесь запуска (15-30 секунд)
sleep 20

# Проверьте статус
docker-compose ps
```

## Шаг 7: Проверка логов

```bash
# Логи приложения
docker-compose logs -f app

# Логи базы данных
docker-compose logs -f postgres

# Все логи
docker-compose logs -f
```

## Шаг 8: Открытие портов

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp
sudo ufw status

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

## Шаг 9: Проверка работы

Откройте в браузере:
```
http://ваш-ip-сервера:3000
```

## Шаг 10: Создание первого администратора (опционально)

```bash
# Войдите в контейнер приложения
docker-compose exec app sh

# Создайте администратора (если есть скрипт)
# node scripts/create-admin.js

# Или через Prisma Studio
npx prisma studio
# Откроется на порту 5555
```

## Полезные команды

### Управление контейнерами

```bash
# Перезапуск всех сервисов
docker-compose restart

# Перезапуск только приложения
docker-compose restart app

# Остановка
docker-compose down

# Остановка с удалением volumes
docker-compose down -v

# Просмотр статуса
docker-compose ps

# Просмотр использования ресурсов
docker stats
```

### Обновление проекта

```bash
cd ~/ptsr

# Остановите контейнеры
docker-compose down

# Получите последние изменения
git pull origin main

# Пересоберите и запустите
docker-compose build --no-cache
docker-compose up -d

# Проверьте логи
docker-compose logs -f app
```

### Применение миграций БД

```bash
# Применить миграции
docker-compose exec app npx prisma migrate deploy

# Генерация Prisma Client
docker-compose exec app npx prisma generate

# Просмотр БД
docker-compose exec postgres psql -U ptsr_user -d ptsr_db
```

### Бэкап базы данных

```bash
# Создать бэкап
docker-compose exec postgres pg_dump -U ptsr_user ptsr_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из бэкапа
docker-compose exec -T postgres psql -U ptsr_user -d ptsr_db < backup_20250113_123456.sql
```

### Очистка Docker (экономия места)

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Полная очистка
docker system prune -a --volumes
```

## Решение проблем

### Порт 3000 занят

```bash
# Найти процесс на порту 3000
sudo lsof -i :3000
# или
sudo netstat -tulpn | grep 3000

# Убить процесс
sudo kill -9 <PID>

# Или измените порт в docker-compose.yml:
# ports:
#   - "8080:3000"
```

### Контейнер не запускается

```bash
# Проверьте логи
docker-compose logs app

# Проверьте, что БД запустилась
docker-compose logs postgres

# Пересоберите без кэша
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### База данных не подключается

```bash
# Проверьте, что postgres контейнер работает
docker-compose ps

# Проверьте логи postgres
docker-compose logs postgres

# Убедитесь, что DATABASE_URL в .env правильный
# Должно быть: @postgres:5432 (не @localhost)
```

### Нет места на диске

```bash
# Проверьте место
df -h

# Очистите Docker
docker system prune -a --volumes -f

# Очистите логи
sudo journalctl --vacuum-time=3d
```

## Мониторинг

```bash
# Непрерывный просмотр логов
docker-compose logs -f --tail=100

# Только ошибки
docker-compose logs | grep -i error

# Использование ресурсов
docker stats

# Проверка здоровья контейнеров
docker-compose ps
```

## Автозапуск при перезагрузке сервера

Docker Compose автоматически перезапустит контейнеры при перезагрузке сервера благодаря `restart: unless-stopped` в docker-compose.yml

Проверить:
```bash
# Перезагрузите сервер
sudo reboot

# После перезагрузки проверьте статус
docker-compose ps
```

