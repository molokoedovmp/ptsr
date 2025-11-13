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

    // Получаем общую статистику
    const [totalUsers, totalCourses, totalArticles, totalPsychologists] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.article.count({ where: { published: true } }),
      prisma.psychologistProfile.count(),
    ])

    // Получаем рост пользователей по дням за последние 7 дней
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const usersRaw = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Группируем по дням
    const usersByDay: Record<string, number> = {}
    usersRaw.forEach(user => {
      const date = new Date(user.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
      usersByDay[date] = (usersByDay[date] || 0) + 1
    })

    const usersGrowth = Object.entries(usersByDay).map(([date, count]) => ({
      date,
      count,
    }))

    // Получаем топ статей по просмотрам
    const topArticles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        title: true,
        viewCount: true,
      },
    })

    const topArticlesFormatted = topArticles.map(article => ({
      title: article.title,
      views: article.viewCount,
    }))

    // Получаем статистику по записям на курсы
    const courseEnrollmentsRaw = await prisma.courseEnrollment.groupBy({
      by: ['courseId'],
      _count: {
        courseId: true,
      },
      orderBy: {
        _count: {
          courseId: 'desc',
        },
      },
      take: 6,
    })

    // Получаем названия курсов
    const courseIds = courseEnrollmentsRaw.map(e => e.courseId)
    const courses = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
      },
    })

    const coursesMap = new Map(courses.map(c => [c.id, c.title]))

    const courseEnrollments = courseEnrollmentsRaw.map(enrollment => ({
      title: coursesMap.get(enrollment.courseId) || 'Неизвестный курс',
      enrolled: enrollment._count.courseId,
    }))

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalArticles,
      totalPsychologists,
      usersGrowth,
      topArticles: topArticlesFormatted,
      courseEnrollments,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

