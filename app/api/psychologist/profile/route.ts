import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { price, education, specialization, available } = body

    const profile = await prisma.psychologistProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const specializationArray = typeof specialization === 'string'
      ? specialization.split(',').map((item: string) => item.trim()).filter(Boolean)
      : Array.isArray(specialization)
      ? specialization
      : undefined

    const updated = await prisma.psychologistProfile.update({
      where: { userId: session.user.id },
      data: {
        ...(typeof price === 'number' && price > 0 ? { price } : {}),
        ...(typeof education === 'string' ? { education } : {}),
        ...(typeof available === 'boolean' ? { available } : {}),
        ...(specializationArray ? { specialization: specializationArray } : {}),
      },
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

    return NextResponse.json({ profile: updated })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
