import { NextResponse } from 'next/server'
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

    if (!user?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const articles = await prisma.article.findMany({
      where: { status: ArticleStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
        displayAuthor: true,
        excerpt: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching moderation queue:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
