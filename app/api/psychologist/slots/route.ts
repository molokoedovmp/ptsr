import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { roles: true } })
    if (!user?.roles.includes(UserRole.PSYCHOLOGIST)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await prisma.psychologistProfile.findUnique({ where: { userId: session.user.id } })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const slots = await prisma.consultationSlot.findMany({
      where: { psychologistId: profile.id },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error loading slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { roles: true } })
    if (!user?.roles.includes(UserRole.PSYCHOLOGIST)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await prisma.psychologistProfile.findUnique({ where: { userId: session.user.id } })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { startTime, endTime, notes } = await request.json()

    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'Укажите время начала и окончания' }, { status: 400 })
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ error: 'Неверный интервал времени' }, { status: 400 })
    }

    const slot = await prisma.consultationSlot.create({
      data: {
        psychologistId: profile.id,
        startTime: start,
        endTime: end,
        notes: notes || null,
      },
    })

    return NextResponse.json({ slot })
  } catch (error) {
    console.error('Error creating slot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
