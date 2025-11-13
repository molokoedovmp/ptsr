import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name, phone } = body

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

    // Хешируем пароль
    const hashedPassword = await hash(password, 12)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: full_name || null,
        phone: phone || null,
        roles: ['USER'],
      },
    })

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

