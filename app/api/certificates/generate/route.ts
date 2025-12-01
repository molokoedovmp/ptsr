import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import CertificateTemplate from '@/components/certificates/CertificateTemplate'
import { Readable } from 'stream'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { enrollmentId, force } = await request.json()

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 })
    }

    // Получаем данные о зачислении
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        id: enrollmentId,
        userId: session.user.id,
        completed: true, // Только для завершенных курсов
      },
      include: {
        course: true,
        user: true,
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found or course not completed' },
        { status: 404 }
      )
    }

    // Если сертификат уже создан и не просили пересоздать, возвращаем его
    if (enrollment.certificateUrl && !force) {
      return NextResponse.json({ certificateUrl: enrollment.certificateUrl })
    }

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

    // Кол-во модулей в курсе
    const moduleCount = await prisma.courseModule.count({ where: { courseId: enrollment.course.id } })

    // Генерируем PDF
    const stream = await renderToStream(
      CertificateTemplate({
        userName: enrollment.user.fullName || enrollment.user.email,
        courseName: enrollment.course.title,
        completionDate,
        certificateId,
        duration,
        moduleCount,
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

    // Сохраняем URL сертификата в базу данных
    await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { certificateUrl: dataUrl },
    })

    return NextResponse.json({ certificateUrl: dataUrl })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}

function getDurationText(weeks: number): string {
  if (weeks === 1) return 'неделя'
  if (weeks >= 2 && weeks <= 4) return 'недели'
  return 'недель'
}
