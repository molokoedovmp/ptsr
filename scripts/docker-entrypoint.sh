#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "Applying database schema..."
  npx prisma db push --skip-generate
fi

echo "Starting app..."
npm run start
