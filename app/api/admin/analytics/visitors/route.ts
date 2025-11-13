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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Получаем период для анализа
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7' // дней
    const daysAgo = parseInt(period)
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    // Общая статистика посещений
    const totalVisits = await prisma.visitorAnalytics.count({
      where: {
        timestamp: { gte: startDate },
      },
    })

    const uniqueVisitors = await prisma.visitorAnalytics.groupBy({
      by: ['sessionId'],
      where: {
        timestamp: { gte: startDate },
      },
    })

    // Посещения по странам
    const visitsByCountry = await prisma.visitorAnalytics.groupBy({
      by: ['country'],
      where: {
        timestamp: { gte: startDate },
        country: { not: null },
      },
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    })

    const countriesData = visitsByCountry.map(item => ({
      country: item.country || 'Unknown',
      visits: item._count.country,
    }))

    // Посещения по устройствам
    const visitsByDevice = await prisma.visitorAnalytics.groupBy({
      by: ['device'],
      where: {
        timestamp: { gte: startDate },
        device: { not: null },
      },
      _count: {
        device: true,
      },
    })

    const devicesData = visitsByDevice.map(item => ({
      device: item.device || 'Unknown',
      visits: item._count.device,
    }))

    // Посещения по ОС
    const visitsByOS = await prisma.visitorAnalytics.groupBy({
      by: ['os'],
      where: {
        timestamp: { gte: startDate },
        os: { not: null },
      },
      _count: {
        os: true,
      },
      orderBy: {
        _count: {
          os: 'desc',
        },
      },
    })

    const osData = visitsByOS.map(item => ({
      os: item.os || 'Unknown',
      visits: item._count.os,
    }))

    // Посещения по браузерам
    const visitsByBrowser = await prisma.visitorAnalytics.groupBy({
      by: ['browser'],
      where: {
        timestamp: { gte: startDate },
        browser: { not: null },
      },
      _count: {
        browser: true,
      },
      orderBy: {
        _count: {
          browser: 'desc',
        },
      },
    })

    const browsersData = visitsByBrowser.map(item => ({
      browser: item.browser || 'Unknown',
      visits: item._count.browser,
    }))

    // Топ страниц
    const topPages = await prisma.visitorAnalytics.groupBy({
      by: ['pagePath'],
      where: {
        timestamp: { gte: startDate },
      },
      _count: {
        pagePath: true,
      },
      orderBy: {
        _count: {
          pagePath: 'desc',
        },
      },
      take: 10,
    })

    const pagesData = topPages.map(item => ({
      page: item.pagePath,
      visits: item._count.pagePath,
    }))

    // Посещения по дням
    const dailyVisitsRaw = await prisma.visitorAnalytics.findMany({
      where: {
        timestamp: { gte: startDate },
      },
      select: {
        timestamp: true,
      },
    })

    // Группируем по дням
    const visitsByDay: Record<string, number> = {}
    dailyVisitsRaw.forEach(visit => {
      const date = new Date(visit.timestamp).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
      visitsByDay[date] = (visitsByDay[date] || 0) + 1
    })

    const dailyVisits = Object.entries(visitsByDay).map(([date, count]) => ({
      date,
      visits: count,
    }))

    // Среднее время на сайте
    const avgDurationResult = await prisma.visitorAnalytics.aggregate({
      where: {
        timestamp: { gte: startDate },
        duration: { not: null },
      },
      _avg: {
        duration: true,
      },
    })

    const avgDuration = Math.round(avgDurationResult._avg.duration || 0)

    return NextResponse.json({
      totalVisits,
      uniqueVisitors: uniqueVisitors.length,
      avgDuration,
      countriesData,
      devicesData,
      osData,
      browsersData,
      pagesData,
      dailyVisits,
    })
  } catch (error) {
    console.error('Error fetching visitor analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

