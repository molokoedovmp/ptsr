import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Проверяем, что пользователь - админ
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Получаем последние действия из разных таблиц
    const [recentArticles, recentCourses, recentPsychologists, recentUsers] = await Promise.all([
      prisma.article.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          createdAt: true,
          authorId: true,
        },
      }),
      prisma.course.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          createdAt: true,
        },
      }),
      prisma.psychologistProfile.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          userId: true,
          createdAt: true,
          user: {
            select: { fullName: true },
          },
        },
      }),
      prisma.user.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          fullName: true,
          createdAt: true,
        },
      }),
    ])

    // Формируем общий список активностей
    const activities: Array<{
      action: string
      user: string
      time: string
      createdAt: Date
    }> = []

    // Добавляем статьи
    recentArticles.forEach(article => {
      activities.push({
        action: `Создана статья "${article.title}"`,
        user: 'Администратор',
        time: formatTimeAgo(article.createdAt),
        createdAt: article.createdAt,
      })
    })

    // Добавляем курсы
    recentCourses.forEach(course => {
      activities.push({
        action: `Создан курс "${course.title}"`,
        user: 'Администратор',
        time: formatTimeAgo(course.createdAt),
        createdAt: course.createdAt,
      })
    })

    // Добавляем психологов
    recentPsychologists.forEach(psychologist => {
      activities.push({
        action: `Добавлен психолог "${psychologist.user?.fullName || 'Новый специалист'}"`,
        user: 'Администратор',
        time: formatTimeAgo(psychologist.createdAt),
        createdAt: psychologist.createdAt,
      })
    })

    // Добавляем пользователей
    recentUsers.forEach(user => {
      activities.push({
        action: `Зарегистрирован пользователь "${user.fullName || 'Новый пользователь'}"`,
        user: 'Система',
        time: formatTimeAgo(user.createdAt),
        createdAt: user.createdAt,
      })
    })

    // Сортируем по дате и берем последние 10
    const sortedActivities = activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map(({ action, user, time }) => ({ action, user, time }))

    return NextResponse.json({ activities: sortedActivities })
  } catch (error) {
    console.error('Error fetching admin activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'только что'
  if (diffMins < 60) return `${diffMins} мин. назад`
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`
  
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

