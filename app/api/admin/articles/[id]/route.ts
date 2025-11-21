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
    if (data.published !== undefined) dataUpdate.published = data.published
    if (data.moderationComment !== undefined) dataUpdate.moderationComment = data.moderationComment
    if (data.status && Object.values(ArticleStatus).includes(data.status)) {
      dataUpdate.status = data.status
      if (data.status === ArticleStatus.APPROVED) {
        dataUpdate.published = true
      } else if (data.status === ArticleStatus.REJECTED || data.status === ArticleStatus.PENDING || data.status === ArticleStatus.DRAFT) {
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
