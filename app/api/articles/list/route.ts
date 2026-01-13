import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() || ''
    const author = searchParams.get('author')?.trim() || ''
    const category = searchParams.get('category')?.trim() || ''
    const sort = searchParams.get('sort') || 'date'

    const publishedVisibilityFilter: Prisma.ArticleWhereInput = {
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
    }

    const filters: Prisma.ArticleWhereInput[] = [
      { published: true },
      publishedVisibilityFilter,
    ]

    if (q) {
      filters.push({
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
        ],
      })
    }

    if (author) {
      filters.push({
        displayAuthor: { contains: author, mode: 'insensitive' },
      })
    }

    if (category) {
      filters.push({ category })
    }

    const where: Prisma.ArticleWhereInput = {
      AND: filters,
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput[] =
      sort === 'popular'
        ? [
            { viewCount: 'desc' },
            { publishedAt: 'desc' },
            { createdAt: 'desc' },
          ]
        : [
            { publishedAt: 'desc' },
            { createdAt: 'desc' },
          ]

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        displayAuthor: true,
        tags: true,
        coverImage: true,
        viewCount: true,
        createdAt: true,
        verifiedAt: true,
        publishedAt: true,
        readingMinutes: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles list:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
