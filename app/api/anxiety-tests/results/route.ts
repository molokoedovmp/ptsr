import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = await prisma.anxietyTestResult.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: 'desc' },
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error fetching anxiety results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необходимо авторизоваться' }, { status: 401 })
    }

    const { testSlug, testTitle, score, maxScore, severity, answers } = await request.json()

    if (!testSlug || typeof score !== 'number') {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
    }

    const created = await prisma.anxietyTestResult.create({
      data: {
        userId: session.user.id,
        testSlug,
        testTitle,
        score,
        maxScore,
        severity,
        answers,
      },
    })

    return NextResponse.json({ result: created })
  } catch (error) {
    console.error('Error saving anxiety test result:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

