import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Gender } from '@prisma/client'

const worldviewOptions = [
  '',
  'Православие',
  'Католицизм',
  'Ислам',
  'Иудаизм',
  'Буддизм',
  'Индуизм',
  'Агностицизм',
  'Атеизм',
  'Другое',
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        dateOfBirth: true,
        gender: true,
        country: true,
        city: true,
        worldview: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error loading profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, avatarUrl, dateOfBirth, gender, city, country, worldview } = body

    const data: any = {}

    if (typeof fullName === 'string') data.fullName = fullName.trim()
    if (typeof avatarUrl === 'string') data.avatarUrl = avatarUrl.trim() || null
    if (typeof city === 'string') data.city = city.trim() || null
    if (typeof country === 'string' && country.trim()) data.country = country.trim()
    if (typeof worldview === 'string' && worldviewOptions.includes(worldview)) data.worldview = worldview || null

    if (typeof dateOfBirth === 'string' && dateOfBirth) {
      const parsed = new Date(dateOfBirth)
      if (!Number.isNaN(parsed.getTime())) {
        data.dateOfBirth = parsed
      }
    }

    if (typeof gender === 'string' && Object.keys(Gender).includes(gender)) {
      data.gender = gender
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        dateOfBirth: true,
        gender: true,
        country: true,
        city: true,
        worldview: true,
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

