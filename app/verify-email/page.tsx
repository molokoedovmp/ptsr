'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function VerifyEmailForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Токен не найден')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || 'Email успешно подтвержден')
          // Перенаправляем на страницу входа через 3 секунды
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Ошибка подтверждения email')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Произошла ошибка при подтверждении email')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-brand-teal mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                Подтверждение email...
              </h2>
              <p className="text-slate-600">
                Пожалуйста, подождите
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                Email подтвержден!
              </h2>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Вы будете перенаправлены на страницу входа...
              </p>
              <Link
                href="/login"
                className="inline-block bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
              >
                Войти сейчас
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                Ошибка подтверждения
              </h2>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="block bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
                >
                  Зарегистрироваться заново
                </Link>
                <Link
                  href="/login"
                  className="block text-brand-teal px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/10 transition-colors"
                >
                  Вернуться на страницу входа
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}

