import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
      include: {
        course: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    const certificates = enrollments.map((enrollment) => ({
      id: enrollment.id,
      courseTitle: enrollment.course.title,
      courseSlug: enrollment.course.slug,
      completionDate: enrollment.completedAt?.toISOString() ?? null,
      certificateUrl: enrollment.certificateUrl,
      durationWeeks: enrollment.course.durationWeeks,
    }))

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json({ error: 'Не удалось получить сертификаты' }, { status: 500 })
  }
}
