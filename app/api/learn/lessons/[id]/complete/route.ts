import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessonId = params.id

    // Проверяем существование урока
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Проверяем запись на курс
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.module.courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled in course' }, { status: 403 })
    }

    // Создаем или обновляем прогресс по уроку
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed: true,
        completedAt: new Date(),
      },
    })

    // Обновляем общий прогресс по курсу
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId: lesson.module.courseId,
        },
      },
    })

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: {
          module: {
            courseId: lesson.module.courseId,
          },
        },
      },
    })

    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    await prisma.courseEnrollment.update({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.module.courseId,
        },
      },
      data: {
        progress: progressPercent,
        completed: progressPercent === 100,
        completedAt: progressPercent === 100 ? new Date() : null,
      },
    })

    return NextResponse.json({ 
      progress,
      courseProgress: progressPercent,
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

