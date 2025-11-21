import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArticleStatus, UserRole } from '@prisma/client'

async function ensurePsychologist(sessionUserId: string | undefined) {
  if (!sessionUserId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: { roles: true },
  })

  if (!user?.roles.includes(UserRole.PSYCHOLOGIST)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { ok: true }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const check = await ensurePsychologist(session?.user?.id)
  if ('error' in check) return check.error

  const article = await prisma.article.findUnique({
    where: { id: params.id, authorId: session!.user!.id },
  })

  if (!article) {
    return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 })
  }

  return NextResponse.json({ article })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const check = await ensurePsychologist(session?.user?.id)
    if ('error' in check) return check.error

    const article = await prisma.article.findUnique({
      where: { id: params.id, authorId: session!.user!.id },
    })

    if (!article) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 })
    }

    if (![ArticleStatus.DRAFT, ArticleStatus.REJECTED].includes(article.status) && request.method === 'PATCH') {
      return NextResponse.json({ error: 'Нельзя редактировать после отправки на модерацию' }, { status: 400 })
    }

    const body = await request.json()

    if (body.action === 'submit') {
      const updated = await prisma.article.update({
        where: { id: params.id },
        data: {
          status: ArticleStatus.PENDING,
          moderationComment: null,
        },
      })
      return NextResponse.json({ article: updated })
    }

    const { title, slug, excerpt, content, category, tags, coverImage, displayAuthor } = body

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(category && { category }),
        ...(displayAuthor !== undefined && { displayAuthor: displayAuthor?.trim() || null }),
        ...(tags && { tags }),
        ...(coverImage !== undefined && { coverImage }),
        status: ArticleStatus.DRAFT,
        published: false,
        moderationComment: null,
      },
    })

    return NextResponse.json({ article: updated })
  } catch (error) {
    console.error('Error updating psychologist article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
