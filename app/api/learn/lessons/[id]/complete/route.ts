import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import CertificateTemplate from '@/components/certificates/CertificateTemplate'
import { Readable } from 'stream'

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

    const updatedEnrollment = await prisma.courseEnrollment.update({
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
      include: {
        user: true,
        course: true,
      },
    })

    // Автоматическая генерация сертификата при завершении курса
    if (progressPercent === 100 && !updatedEnrollment.certificateUrl) {
      try {
        const certificateUrl = await generateCertificate(updatedEnrollment)
        
        await prisma.courseEnrollment.update({
          where: { id: updatedEnrollment.id },
          data: { certificateUrl },
        })
      } catch (error) {
        console.error('Error generating certificate:', error)
        // Не прерываем выполнение, если сертификат не сгенерировался
      }
    }

    return NextResponse.json({ 
      progress,
      courseProgress: progressPercent,
      certificateGenerated: progressPercent === 100,
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Функция генерации сертификата
async function generateCertificate(enrollment: any): Promise<string> {
  // Генерируем ID сертификата
  const certificateId = `PTSR-${enrollment.course.slug.toUpperCase()}-${Date.now()}`

  // Форматируем дату
  const completionDate = enrollment.completedAt
    ? new Date(enrollment.completedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

  // Форматируем продолжительность
  const duration = `${enrollment.course.durationWeeks} ${getDurationText(enrollment.course.durationWeeks)}`

  // Генерируем PDF
  const stream = await renderToStream(
    CertificateTemplate({
      userName: enrollment.user.fullName || enrollment.user.email,
      courseName: enrollment.course.title,
      completionDate,
      certificateId,
      duration,
    })
  )

  // Конвертируем stream в buffer
  const chunks: Buffer[] = []
  for await (const chunk of stream as unknown as Readable) {
    chunks.push(Buffer.from(chunk))
  }
  const buffer = Buffer.concat(chunks)

  // Конвертируем в base64 для хранения в виде data URL
  const base64 = buffer.toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64}`

  return dataUrl
}

function getDurationText(weeks: number): string {
  if (weeks === 1) return 'неделя'
  if (weeks >= 2 && weeks <= 4) return 'недели'
  return 'недель'
}
