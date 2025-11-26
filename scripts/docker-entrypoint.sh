#!/bin/sh
set -e

# Если нужно — применяем миграции перед стартом
if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "Running prisma migrate deploy..."
  npx prisma migrate deploy
fi

echo "Starting app..."
npm run start
