import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    const psychologist = await prisma.psychologistProfile.update({
      where: { id: params.id },
      data: {
        ...(data.verified !== undefined && { verified: data.verified }),
        ...(data.available !== undefined && { available: data.available }),
      },
    })

    return NextResponse.json({ psychologist })
  } catch (error) {
    console.error('Error updating psychologist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

