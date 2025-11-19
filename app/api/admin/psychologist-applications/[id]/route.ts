import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApplicationStatus, UserRole } from '@prisma/client'
import { sendPsychologistApplicationStatusEmail, sendPsychologistActivationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    })

    if (!currentUser?.roles.includes(UserRole.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = { status }
    if (status !== ApplicationStatus.APPROVED) {
      updateData.activationToken = null
      updateData.activationTokenExpires = null
    }

    let application = await prisma.psychologistApplication.update({
      where: { id: params.id },
      data: updateData,
    })

    if (status === ApplicationStatus.APPROVED && !application.activated) {
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 7 * 24 * 3600000)
      application = await prisma.psychologistApplication.update({
        where: { id: params.id },
        data: {
          activationToken: token,
          activationTokenExpires: expires,
        },
      })

      try {
        const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL
        await sendPsychologistActivationEmail(application.email, token, origin || undefined)
      } catch (emailError) {
        console.error('Failed to send activation email:', emailError)
      }
    }

    try {
      await sendPsychologistApplicationStatusEmail(application.email, status)
    } catch (emailError) {
      console.error('Failed to send status email:', emailError)
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
