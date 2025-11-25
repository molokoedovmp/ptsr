import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { slug } = resolvedParams

    console.log('[API] Fetching article with slug:', slug)

    const now = new Date()
    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        published: true,
        status: 'APPROVED',
        OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
      },
      include: {
        author: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
        feedback: {
          select: {
            rating: true,
          },
        },
      },
    })

    console.log('[API] Article found:', article ? 'YES' : 'NO')

    if (!article) {
      console.log('[API] Article not found for slug:', slug)
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Увеличиваем счетчик просмотров
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })

    console.log('[API] Returning article:', article.title)
    return NextResponse.json({ article })
  } catch (error: any) {
    console.error('[API] Error fetching article:', error)
    console.error('[API] Error details:', error.message)
    console.error('[API] Error stack:', error.stack)
    return NextResponse.json({ 
      error: 'Failed to fetch article',
      details: error.message 
    }, { status: 500 })
  }
}
