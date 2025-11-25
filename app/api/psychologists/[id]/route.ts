import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const psychologist = await prisma.psychologistProfile.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
            email: true,
            phone: true,
          },
        },
        slots: {
          where: { status: 'AVAILABLE', startTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
          take: 6,
        },
      },
    })

    if (!psychologist) {
      return NextResponse.json({ error: 'Психолог не найден' }, { status: 404 })
    }

    return NextResponse.json({ psychologist })
  } catch (error) {
    console.error('Error fetching psychologist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
