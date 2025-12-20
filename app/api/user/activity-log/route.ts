import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getClientIp } from '@/lib/request'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const logs = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { path, title, metadata, action } = await req.json()

    const normalizedMetadata =
      metadata && typeof metadata === 'object' ? metadata : {}
    const logMetadata = {
      ...normalizedMetadata,
      ...(path ? { path } : {}),
      ...(title ? { title } : {}),
    }

    const ip = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || null

    const log = await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: action ?? 'PAGE_VIEW',
        metadata: Object.keys(logMetadata).length > 0 ? logMetadata : undefined,
        ip,
        userAgent,
      },
    })

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    console.error('Error saving activity log:', error)
    return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 })
  }
}
