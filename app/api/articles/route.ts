import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

export async function GET() {
  try {
    const now = new Date()
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        displayAuthor: true,
        readingMinutes: true,
        tags: true,
        coverImage: true,
        viewCount: true,
        createdAt: true,
        verifiedAt: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
