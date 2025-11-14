import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[API] Fetching lessons for course ID:', params.id)
    
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log('[API] Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      console.log('[API] Forbidden - user is not admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    })

    if (!course) {
      console.log('[API] Course not found')
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    console.log('[API] Found course:', course.title)

    const modules = await prisma.courseModule.findMany({
      where: { courseId: params.id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { orderIndex: 'asc' },
    })

    console.log('[API] Found modules:', modules.length)
    modules.forEach(m => {
      console.log(`  - ${m.title}: ${m.lessons.length} lessons`)
    })

    return NextResponse.json({ course, modules })
  } catch (error) {
    console.error('Error fetching course lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

