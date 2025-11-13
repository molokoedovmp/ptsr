import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Функция для определения типа устройства
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile'
  if (/tablet/i.test(userAgent)) return 'tablet'
  return 'desktop'
}

// Функция для извлечения информации о браузере
function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Other'
}

// Функция для извлечения информации об ОС
function getOSInfo(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'MacOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Other'
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const data = await request.json()
    
    // Получаем информацию о пользователе
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Создаем запись аналитики
    await prisma.visitorAnalytics.create({
      data: {
        sessionId: data.sessionId,
        userId: session?.user?.id || null,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle,
        referrer: data.referrer || null,
        
        // Геолокация (в реальном приложении использовать GeoIP сервис)
        country: data.country || null,
        countryCode: data.countryCode || null,
        city: data.city || null,
        region: data.region || null,
        
        // Устройство
        device: getDeviceType(userAgent),
        os: getOSInfo(userAgent),
        browser: getBrowserInfo(userAgent),
        screenWidth: data.screenWidth || null,
        screenHeight: data.screenHeight || null,
        
        // Язык и временная зона
        language: data.language || null,
        timezone: data.timezone || null,
        
        // IP и User Agent
        ipAddress: ip,
        userAgent: userAgent,
        
        duration: data.duration || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

