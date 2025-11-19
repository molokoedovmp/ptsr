import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, specialization, experienceYears, education, inviteCode, message } = body

    await prisma.psychologistApplication.create({
      data: {
        fullName,
        email,
        phone,
        specialization,
        experienceYears: Number(experienceYears) || 0,
        education,
        inviteCode: inviteCode || null,
        message: message || '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Psychologist application error:', error)
    return NextResponse.json({ error: 'Не удалось отправить заявку' }, { status: 500 })
  }
}
