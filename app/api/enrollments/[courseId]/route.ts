import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
    }

    const courseId = params.courseId

    // Проверяем существование курса
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 })
    }

    if (!course.published) {
      return NextResponse.json({ error: 'Курс недоступен' }, { status: 400 })
    }

    // Проверяем, не записан ли уже пользователь
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Вы уже записаны на этот курс' }, { status: 400 })
    }

    // Создаем запись
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
      },
      include: {
        course: true,
      },
    })

    return NextResponse.json({ 
      message: 'Вы успешно записались на курс',
      enrollment 
    })
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json({ error: 'Ошибка записи на курс' }, { status: 500 })
  }
}

