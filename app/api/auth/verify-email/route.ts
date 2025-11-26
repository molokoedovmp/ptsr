import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Токен не предоставлен' },
        { status: 400 }
      )
    }

    // Находим токен верификации
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
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

    // Находим пользователя по email и обновляем статус верификации
    const user = await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Токен оставляем, чтобы повторные запросы (например, двойной рендер в dev) не давали "Неверный токен"
    // Удалять можно периодически джобой по expires

    return NextResponse.json({
      success: true,
      message: 'Email успешно подтвержден',
    })
  } catch (error) {
    console.error('Ошибка верификации email:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
