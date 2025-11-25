import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SlotStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { psychologistId, slotId, name, email, phone, message } = body

    if (!psychologistId || !slotId) {
      return NextResponse.json({ error: 'Не указан психолог или слот' }, { status: 400 })
    }

    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Укажите имя и email' }, { status: 400 })
    }

    const slot = await prisma.consultationSlot.findUnique({
      where: { id: slotId },
      select: { id: true, psychologistId: true, status: true, startTime: true },
    })

    if (!slot || slot.psychologistId !== psychologistId) {
      return NextResponse.json({ error: 'Слот не найден' }, { status: 404 })
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      return NextResponse.json({ error: 'Слот уже занят' }, { status: 409 })
    }

    if (slot.startTime < new Date()) {
      return NextResponse.json({ error: 'Нельзя записаться на прошедший слот' }, { status: 400 })
    }

    const updatedSlot = await prisma.consultationSlot.update({
      where: { id: slotId },
      data: {
        status: SlotStatus.BOOKED,
        clientName: name.trim(),
        clientEmail: email.trim(),
        clientPhone: typeof phone === 'string' && phone.trim() ? phone.trim() : null,
        clientMessage: typeof message === 'string' && message.trim() ? message.trim() : null,
        bookedByUserId: session?.user?.id ?? null,
      },
    })

    return NextResponse.json({ slot: updatedSlot })
  } catch (error) {
    console.error('Error booking consultation slot:', error)
    return NextResponse.json({ error: 'Не удалось записаться на консультацию' }, { status: 500 })
  }
}
