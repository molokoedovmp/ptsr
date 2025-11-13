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

    // Получаем статистику
    const [
      totalUsers,
      totalCourses,
      totalArticles,
      totalPsychologists,
      recentUsers,
    ] = await Promise.all([
      // Всего пользователей
      prisma.user.count(),
      
      // Всего курсов
      prisma.course.count({
        where: { published: true },
      }),
      
      // Всего статей
      prisma.article.count({
        where: { published: true },
      }),
      
      // Всего психологов
      prisma.psychologistProfile.count(),
      
      // Последние пользователи
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
          roles: true,
        },
      }),
    ])

    // Считаем видео как 0, так как у Article нет поля type
    // В будущем можно добавить отдельную таблицу для видео
    const totalVideos = 0

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCourses,
        totalPosts: totalArticles,
        totalVideos,
        totalPsychologists,
      },
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.fullName || 'Без имени',
        email: user.email,
        date: new Date(user.createdAt).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        roles: user.roles,
        status: 'active',
      })),
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

