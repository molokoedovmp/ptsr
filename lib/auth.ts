import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Неверные учетные данные')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            fullName: true,
            avatarUrl: true,
            roles: true,
          },
        })

        if (!user || !user.password) {
          throw new Error('Пользователь не найден')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Неверный пароль')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
          roles: user.roles,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.roles = (user as any).roles || []
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.roles = token.roles as UserRole[]
      }
      return session
    },
  },
}

// Хелпер функции для проверки ролей
export function hasRole(roles: UserRole[], role: UserRole): boolean {
  return roles.includes(role)
}

export function isAdmin(roles: UserRole[]): boolean {
  return hasRole(roles, UserRole.ADMIN)
}

export function isSupport(roles: UserRole[]): boolean {
  return hasRole(roles, UserRole.SUPPORT)
}

export function isPsychologist(roles: UserRole[]): boolean {
  return hasRole(roles, UserRole.PSYCHOLOGIST)
}





