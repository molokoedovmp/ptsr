#!/bin/bash

echo "=================================="
echo "  Push PTSR to GitHub"
echo "=================================="
echo ""

# Проверяем текущий статус
echo "📊 Git статус:"
git status

echo ""
read -p "Запушить изменения в GitHub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Отменено"
    exit 1
fi

echo ""
echo "🚀 Отправка в GitHub..."
echo ""

# Пуш с force (заменяет старый проект)
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Успешно отправлено в GitHub!"
    echo ""
    echo "🌐 Репозиторий: https://github.com/molokoedovmp/ptsr"
    echo ""
else
    echo ""
    echo "❌ Ошибка при отправке"
    echo ""
    echo "Возможные причины:"
    echo "1. Нет доступа к интернету"
    echo "2. Нужна авторизация в Git"
    echo "3. Неправильный URL репозитория"
    echo ""
    echo "Попробуйте вручную:"
    echo "  git push -u origin main --force"
    echo ""
fi

