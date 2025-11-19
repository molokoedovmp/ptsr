import { NextResponse } from 'next/server'
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.PSYCHOLOGIST)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await prisma.psychologistProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const slots = await prisma.consultationSlot.findMany({
      where: { psychologistId: profile.id, startTime: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } },
      orderBy: { startTime: 'asc' },
      take: 10,
    })

    const data = {
      profile: {
        fullName: profile.user.fullName,
        email: profile.user.email,
        phone: profile.user.phone,
        specialization: profile.specialization,
        experienceYears: profile.experienceYears,
        education: profile.education,
        price: profile.price,
        rating: profile.rating,
        verified: profile.verified,
        available: profile.available,
      },
      stats: [
        {
          label: 'Ставка за сессию',
          value: `${profile.price.toLocaleString()}₽`,
          type: 'price',
        },
        {
          label: 'Опыт работы',
          value: `${profile.experienceYears} лет`,
          type: 'experience',
        },
        {
          label: 'Доступность',
          value: profile.available ? 'Принимаете клиентов' : 'Недоступен',
          type: 'availability',
        },
        {
          label: 'Верификация',
          value: profile.verified ? 'Подтверждено' : 'На модерации',
          type: 'verification',
        },
      ],
      sessions: slots.map((slot) => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
        clientName: slot.clientName,
        notes: slot.notes,
      })),
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error loading psychologist dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
