# Запуск PTSR в Docker

## Быстрый старт

### 1. Создайте `.env` файл в корне проекта:

```env
DATABASE_URL="postgresql://ptsr_user:ptsr_password@postgres:5432/ptsr_db"
NEXTAUTH_SECRET="your-random-secret-at-least-32-characters-long"
NEXTAUTH_URL="http://your-server-ip:3000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

**Важно:** Замените:
- `your-server-ip` на IP вашего сервера (или localhost для локального запуска)
- `your-random-secret...` на случайную строку минимум 32 символа
- Email настройки на ваши реальные данные

### 2. Запустите Docker Compose:

```bash
# Сборка и запуск
docker-compose up -d --build

# Проверка логов
docker-compose logs -f app

# Или используйте скрипт
chmod +x docker-start.sh
./docker-start.sh
```

### 3. Откройте приложение:

```
http://your-server-ip:3000
```

## Команды управления

```bash
# Остановить контейнеры
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Перезапустить
docker-compose restart

# Просмотр логов
docker-compose logs -f

# Только логи приложения
docker-compose logs -f app

# Только логи БД
docker-compose logs -f postgres

# Выполнить команду внутри контейнера
docker-compose exec app sh
docker-compose exec postgres psql -U ptsr_user -d ptsr_db
```

## Применение миграций БД

Миграции применяются автоматически при запуске. Если нужно применить вручную:

```bash
docker-compose exec app npx prisma migrate deploy
```

## Создание первого администратора

```bash
docker-compose exec app npx ts-node scripts/create-admin.js
```

## Доступ к базе данных

База данных PostgreSQL доступна на порту 5432:

```bash
# Подключение через psql
docker-compose exec postgres psql -U ptsr_user -d ptsr_db

# Или извне контейнера
psql -h localhost -p 5432 -U ptsr_user -d ptsr_db
```

Пароль: `ptsr_password` (измените в docker-compose.yml для продакшена)

## Настройка для продакшена

1. Измените пароли в `docker-compose.yml`
2. Настройте HTTPS через nginx/traefik
3. Используйте Docker Secrets для чувствительных данных
4. Настройте регулярные бэкапы БД
5. Ограничьте доступ к порту PostgreSQL

## Доступ извне

Если нужен доступ с других устройств в сети:

1. Узнайте IP вашего сервера: `ip addr show` или `ifconfig`
2. Обновите `NEXTAUTH_URL` в `.env` на этот IP
3. Убедитесь, что порт 3000 открыт в firewall

```bash
# Ubuntu/Debian
sudo ufw allow 3000

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## Проблемы и решения

### Порт 3000 занят

Измените порт в `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # внешний:внутренний
```

### База данных не запускается

```bash
# Удалите том и пересоздайте
docker-compose down -v
docker-compose up -d
```

### Приложение не подключается к БД

Проверьте:
1. `DATABASE_URL` в `.env` содержит `@postgres:5432` (не localhost)
2. БД запущена: `docker-compose ps`
3. Логи БД: `docker-compose logs postgres`

