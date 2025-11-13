'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserRole } from '@prisma/client'

interface AuthContextType {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    roles: UserRole[]
  } | null
  isAdmin: boolean
  isSupport: boolean
  isPsychologist: boolean
  isVolunteer: boolean
  isLoading: boolean
  signUp: (email: string, password: string, additionalData?: any) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSupport, setIsSupport] = useState(false)
  const [isPsychologist, setIsPsychologist] = useState(false)
  const [isVolunteer, setIsVolunteer] = useState(false)

  useEffect(() => {
    if (session?.user?.roles) {
      const roles = session.user.roles
      setIsAdmin(roles.includes(UserRole.ADMIN))
      setIsSupport(roles.includes(UserRole.SUPPORT))
      setIsPsychologist(roles.includes(UserRole.PSYCHOLOGIST))
      setIsVolunteer(roles.includes(UserRole.VOLUNTEER))
    } else {
      setIsAdmin(false)
      setIsSupport(false)
      setIsPsychologist(false)
      setIsVolunteer(false)
    }
  }, [session])

  const signUp = async (email: string, password: string, additionalData?: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...additionalData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: { message: data.error || 'Ошибка регистрации' } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'Произошла ошибка. Попробуйте снова.' } }
    }
  }

  const value = {
    user: session?.user || null,
    isAdmin,
    isSupport,
    isPsychologist,
    isVolunteer,
    isLoading: status === 'loading',
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return context
}
