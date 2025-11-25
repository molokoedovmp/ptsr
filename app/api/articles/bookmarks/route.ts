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

    const bookmarks = await prisma.articleBookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            displayAuthor: true,
            readingMinutes: true,
            coverImage: true,
            publishedAt: true,
          },
        },
      },
    })

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { articleId } = await request.json()
    if (!articleId) {
      return NextResponse.json({ error: 'Укажите статью' }, { status: 400 })
    }

    const bookmark = await prisma.articleBookmark.upsert({
      where: {
        articleId_userId: {
          articleId,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        articleId,
        userId: session.user.id,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            displayAuthor: true,
            readingMinutes: true,
            coverImage: true,
          },
        },
      },
    })

    return NextResponse.json({ bookmark })
  } catch (error) {
    console.error('Error saving bookmark:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')

    if (!articleId) {
      return NextResponse.json({ error: 'Укажите статью' }, { status: 400 })
    }

    await prisma.articleBookmark.delete({
      where: {
        articleId_userId: {
          articleId,
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

