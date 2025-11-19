import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, SlotStatus } from '@prisma/client'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const slot = await prisma.consultationSlot.findUnique({ where: { id: params.id } })
    if (!slot || slot.psychologistId !== profile.id) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      return NextResponse.json({ error: 'Нельзя удалить занятую запись' }, { status: 400 })
    }

    await prisma.consultationSlot.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
