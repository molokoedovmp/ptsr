import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'
import { UserRole } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      full_name,
      phone,
      role,
      invite_code,
      specialization,
      experience_years,
      education,
      price,
    } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    const isPsychologistRegistration = role === 'psychologist'

    if (isPsychologistRegistration) {
      const codes = (process.env.PSYCHOLOGIST_INVITE_CODES || process.env.PSYCHOLOGIST_INVITE_CODE || '')
        .split(',')
        .map((code) => code.trim())
        .filter(Boolean)

      if (!invite_code || !codes.length || !codes.includes(invite_code)) {
        return NextResponse.json(
          { error: 'Неверный или отсутствующий код приглашения' },
          { status: 400 },
        )
      }
    }

    // Хешируем пароль
    const hashedPassword = await hash(password, 12)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: full_name || null,
        phone: phone || null,
        roles: isPsychologistRegistration ? [UserRole.USER, UserRole.PSYCHOLOGIST] : [UserRole.USER],
      },
    })

    if (isPsychologistRegistration) {
      const specializationList: string[] =
        typeof specialization === 'string'
          ? specialization
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : ['Психолог']

      await prisma.psychologistProfile.create({
        data: {
          userId: user.id,
          specialization: specializationList.length ? specializationList : ['Психолог'],
          experienceYears: Number(experience_years) || 0,
          education: education || 'Высшее психологическое',
          bio: null,
          price: Number(price) || 3000,
        },
      })
    }

    // Генерируем токен верификации
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 3600000) // 24 часа

    // Сохраняем токен
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
      },
    })

    // Отправляем email с подтверждением
    try {
      await sendVerificationEmail(email, verificationToken)
    } catch (emailError) {
      console.error('Ошибка отправки email:', emailError)
      // Продолжаем, даже если email не отправился
    }

    return NextResponse.json({
      success: true,
      message: 'Регистрация успешна. Проверьте ваш email для подтверждения.',
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
