import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Нужно войти, чтобы оставить отзыв' }, { status: 401 })
    }

    const { rating, comment } = await request.json()
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Оценка от 1 до 5' }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 })
    }

    const feedback = await prisma.articleFeedback.upsert({
      where: {
        articleId_userId: { articleId: article.id, userId: session.user.id },
      },
      update: {
        rating,
        comment: comment?.trim() || null,
      },
      create: {
        articleId: article.id,
        userId: session.user.id,
        rating,
        comment: comment?.trim() || null,
      },
    })

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

