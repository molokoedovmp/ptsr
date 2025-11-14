import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Получаем записи дневника
    const diaryEntries = await prisma.diaryEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    // Получаем записи настроения
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    // Получаем прогресс по курсам
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            _count: {
              select: {
                modules: true
              }
            }
          }
        }
      }
    })

    // Статистика по дневнику
    const diaryStats = {
      total: diaryEntries.length,
      thisWeek: diaryEntries.filter(e => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(e.createdAt) > weekAgo
      }).length,
      thisMonth: diaryEntries.filter(e => {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return new Date(e.createdAt) > monthAgo
      }).length,
      byType: diaryEntries.reduce((acc: any, entry) => {
        const type = entry.activityType || 'other'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})
    }

    // Статистика по настроению
    const moodStats = {
      total: moodEntries.length,
      average: moodEntries.length > 0 
        ? moodEntries.reduce((sum, e) => sum + e.moodLevel, 0) / moodEntries.length
        : 0,
      thisWeek: moodEntries.filter(e => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(e.createdAt) > weekAgo
      }),
      thisMonth: moodEntries.filter(e => {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return new Date(e.createdAt) > monthAgo
      })
    }

    // Данные для графиков
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    const diaryByDay = last30Days.map(date => ({
      date,
      count: diaryEntries.filter(e => e.createdAt.toISOString().split('T')[0] === date).length
    }))

    const moodByDay = last30Days.map(date => {
      const dayEntries = moodEntries.filter(e => e.createdAt.toISOString().split('T')[0] === date)
      return {
        date,
        average: dayEntries.length > 0 
          ? dayEntries.reduce((sum, e) => sum + e.moodLevel, 0) / dayEntries.length
          : null
      }
    })

    // Статистика по курсам
    const courseStats = {
      total: enrollments.length,
      inProgress: enrollments.filter(e => !e.completed).length,
      completed: enrollments.filter(e => e.completed).length,
      averageProgress: enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
        : 0,
      courses: enrollments.map(e => ({
        title: e.course.title,
        progress: e.progress,
        completed: e.completed,
        enrolledAt: e.enrolledAt
      }))
    }

    return NextResponse.json({
      diaryStats,
      moodStats,
      courseStats,
      charts: {
        diaryByDay,
        moodByDay
      }
    })
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

