import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { ApplicationStatus, UserRole } from '@prisma/client'
import { sendPsychologistApplicationStatusEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Токен и пароль обязательны' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Пароль должен содержать минимум 8 символов' }, { status: 400 })
    }

    const application = await prisma.psychologistApplication.findFirst({
      where: {
        activationToken: token,
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Неверный токен' }, { status: 400 })
    }

    if (application.activationTokenExpires && application.activationTokenExpires < new Date()) {
      return NextResponse.json({ error: 'Ссылка истекла. Обратитесь к администратору.' }, { status: 400 })
    }

    if (application.activated) {
      return NextResponse.json({ error: 'Аккаунт уже активирован' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    const existingUser = await prisma.user.findUnique({ where: { email: application.email } })

    let userId: string

    if (existingUser) {
      const roles = existingUser.roles.includes(UserRole.PSYCHOLOGIST)
        ? existingUser.roles
        : [...existingUser.roles, UserRole.PSYCHOLOGIST]

      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          roles,
          fullName: existingUser.fullName ?? application.fullName,
          phone: existingUser.phone ?? application.phone,
          emailVerified: existingUser.emailVerified ?? new Date(),
        },
      })
      userId = updatedUser.id
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: application.email,
          password: hashedPassword,
          fullName: application.fullName,
          phone: application.phone,
          roles: [UserRole.USER, UserRole.PSYCHOLOGIST],
          emailVerified: new Date(),
        },
      })
      userId = newUser.id
    }

    const specializationArray = application.specialization
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    await prisma.psychologistProfile.upsert({
      where: { userId },
      create: {
        userId,
        specialization: specializationArray.length ? specializationArray : ['Психология'],
        experienceYears: application.experienceYears,
        education: application.education,
        bio: application.message || null,
        price: 3000,
        verified: true,
      },
      update: {
        specialization: specializationArray.length ? specializationArray : ['Психология'],
        experienceYears: application.experienceYears,
        education: application.education,
        bio: application.message || null,
        verified: true,
      },
    })

    const updatedApplication = await prisma.psychologistApplication.update({
      where: { id: application.id },
      data: {
        activated: true,
        activatedAt: new Date(),
        activationToken: null,
        activationTokenExpires: null,
        status: ApplicationStatus.ACTIVATED,
      },
    })

    try {
      await sendPsychologistApplicationStatusEmail(application.email, 'ACTIVATED')
    } catch (emailError) {
      console.error('Failed to send activation status email:', emailError)
    }

    return NextResponse.json({ success: true, application: updatedApplication })
  } catch (error) {
    console.error('Psychologist activation error:', error)
    return NextResponse.json({ error: 'Не удалось активировать аккаунт' }, { status: 500 })
  }
}
