import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const psychologists = await prisma.psychologistProfile.findMany({
      where: {
        verified: true,
        available: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ psychologists })
  } catch (error) {
    console.error('Error fetching psychologists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

