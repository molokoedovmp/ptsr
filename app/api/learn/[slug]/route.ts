import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Находим курс
    const course = await prisma.course.findFirst({
      where: { slug: params.slug, published: true },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Проверяем запись пользователя
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json({
        course: { ...course, enrolled: false },
        modules: [],
      })
    }

    // Получаем модули с уроками
    const modules = await prisma.courseModule.findMany({
      where: { courseId: course.id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { orderIndex: 'asc' },
    })

    // Получаем прогресс по урокам
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lessonId: {
          in: modules.flatMap(m => m.lessons.map(l => l.id)),
        },
      },
    })

    const progressMap = new Map(lessonProgress.map(p => [p.lessonId, p.completed]))

    // Добавляем информацию о прогрессе к урокам
    const modulesWithProgress = modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        completed: progressMap.get(lesson.id) || false,
      })),
    }))

    return NextResponse.json({
      course: { ...course, enrolled: true },
      modules: modulesWithProgress,
    })
  } catch (error) {
    console.error('Error fetching course for learning:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

