import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArticleStatus, UserRole } from '@prisma/client'

// Создание новой статьи
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Проверяем, что пользователь - админ
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // Проверяем обязательные поля
    if (!data.title || !data.slug || !data.content || !data.excerpt || !data.category) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Проверяем уникальность slug
    const existingArticle = await prisma.article.findUnique({
      where: { slug: data.slug },
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Статья с таким URL уже существует' },
        { status: 400 }
      )
    }

    // Создаем статью
    const status: ArticleStatus = data.status ?? (data.published ? ArticleStatus.APPROVED : ArticleStatus.DRAFT)
    const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
    const now = new Date()
    const readingMinutes = data.readingMinutes ? Number(data.readingMinutes) : null
    const faq = Array.isArray(data.faq) ? data.faq.filter((item: any) => item.question && item.answer) : null

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        displayAuthor: data.displayAuthor?.trim() || null,
        readingMinutes,
        sourceTitle: data.sourceTitle?.trim() || null,
        sourceUrl: data.sourceUrl?.trim() || null,
        publishedAt,
        verifiedAt: status === ArticleStatus.APPROVED ? new Date() : null,
        faq,
        tags: data.tags || [],
        coverImage: data.coverImage || null,
        status,
        published: status === ArticleStatus.APPROVED && (!publishedAt || publishedAt <= now),
        authorId: session.user.id,
      },
    })

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Получение списка статей
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Проверяем, что пользователь - админ
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        displayAuthor: true,
        status: true,
        published: true,
        viewCount: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
