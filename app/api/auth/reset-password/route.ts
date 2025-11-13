import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Токен и пароль обязательны' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Находим токен
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Неверный токен' },
        { status: 400 }
      )
    }

    // Проверяем, не истек ли токен
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json(
        { error: 'Токен истек' },
        { status: 400 }
      )
    }

    // Хешируем новый пароль
    const hashedPassword = await hash(password, 12)

    // Обновляем пароль пользователя
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        password: hashedPassword,
      },
    })

    // Удаляем использованный токен
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменен',
    })
  } catch (error) {
    console.error('Ошибка сброса пароля:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

