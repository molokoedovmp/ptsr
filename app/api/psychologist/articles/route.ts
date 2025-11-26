import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArticleStatus, UserRole } from '@prisma/client'

export async function GET() {
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

    const articles = await prisma.article.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        moderationComment: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching psychologist articles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true, fullName: true },
    })

    if (!user?.roles.includes(UserRole.PSYCHOLOGIST)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, category, tags, coverImage, displayAuthor, readingMinutes, sourceTitle, sourceUrl, publishedAt, faq } = body

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }

    const existingSlug = await prisma.article.findUnique({ where: { slug } })
    if (existingSlug) {
      return NextResponse.json({ error: 'Статья с таким URL уже существует' }, { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags || [],
        coverImage: coverImage || null,
        displayAuthor: (displayAuthor || user.fullName || '').trim() || null,
        readingMinutes: typeof readingMinutes === 'number' ? readingMinutes : null,
        sourceTitle: sourceTitle || null,
        sourceUrl: sourceUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        faq: Array.isArray(faq) ? faq : undefined,
        authorId: session.user.id,
        status: ArticleStatus.DRAFT,
        published: false,
      },
    })

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error('Error creating psychologist article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
