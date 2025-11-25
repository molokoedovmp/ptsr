import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Укажите корректный email' }, { status: 400 })
    }

    await prisma.articleSubscription.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { email: email.toLowerCase() },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error subscribing to articles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

