import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email не предоставлен' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Из соображений безопасности возвращаем success даже если пользователь не найден
      return NextResponse.json({
        success: true,
        message: 'Если пользователь с таким email существует, письмо было отправлено',
      })
    }

    // Генерируем токен
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 час

    // Удаляем старые токены восстановления для этого email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    })

    // Создаем новый токен
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Отправляем email
    const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL
    await sendPasswordResetEmail(email, token, origin || undefined)

    return NextResponse.json({
      success: true,
      message: 'Письмо с инструкциями отправлено на ваш email',
    })
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
