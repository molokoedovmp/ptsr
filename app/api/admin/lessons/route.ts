import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
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

    const data = await request.json()

    // Получаем максимальный orderIndex для модуля
    const maxOrder = await prisma.lesson.findFirst({
      where: { moduleId: data.moduleId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    })

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: data.moduleId,
        title: data.title,
        description: data.description || null,
        content: data.content,
        videoUrl: data.videoUrl || null,
        duration: data.duration ? parseInt(data.duration) : null,
        isFree: data.isFree || false,
        orderIndex: maxOrder ? maxOrder.orderIndex + 1 : 0,
      },
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

