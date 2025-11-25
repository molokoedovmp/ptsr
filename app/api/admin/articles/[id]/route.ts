import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArticleStatus, UserRole } from '@prisma/client'

// Получение статьи по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { fullName: true, email: true },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Обновление статьи
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    const dataUpdate: any = {}
    if (data.title) dataUpdate.title = data.title
    if (data.slug) dataUpdate.slug = data.slug
    if (data.content) dataUpdate.content = data.content
    if (data.excerpt) dataUpdate.excerpt = data.excerpt
    if (data.category) dataUpdate.category = data.category
    if (data.displayAuthor !== undefined) dataUpdate.displayAuthor = data.displayAuthor?.trim() || null
    if (data.tags) dataUpdate.tags = data.tags
    if (data.coverImage !== undefined) dataUpdate.coverImage = data.coverImage
    if (data.readingMinutes !== undefined) dataUpdate.readingMinutes = data.readingMinutes ? Number(data.readingMinutes) : null
    if (data.sourceTitle !== undefined) dataUpdate.sourceTitle = data.sourceTitle?.trim() || null
    if (data.sourceUrl !== undefined) dataUpdate.sourceUrl = data.sourceUrl?.trim() || null
    if (data.publishedAt !== undefined) dataUpdate.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
    if (data.verifiedAt !== undefined) dataUpdate.verifiedAt = data.verifiedAt ? new Date(data.verifiedAt) : null
    if (data.faq) dataUpdate.faq = data.faq.filter((item: any) => item.question && item.answer)
    if (data.published !== undefined) dataUpdate.published = data.published
    if (data.moderationComment !== undefined) dataUpdate.moderationComment = data.moderationComment
    if (data.status && Object.values(ArticleStatus).includes(data.status)) {
      dataUpdate.status = data.status
      if (data.status === ArticleStatus.APPROVED) {
        dataUpdate.published = dataUpdate.publishedAt ? dataUpdate.publishedAt <= new Date() : true
        dataUpdate.verifiedAt = dataUpdate.verifiedAt ?? new Date()
      } else if ([ArticleStatus.REJECTED, ArticleStatus.PENDING, ArticleStatus.DRAFT].includes(data.status)) {
        dataUpdate.published = false
      }
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: dataUpdate,
    })

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Удаление статьи
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.article.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Article deleted' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
