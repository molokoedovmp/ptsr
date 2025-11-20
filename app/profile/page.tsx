'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Calendar, BookOpen, Award, Heart, FileText, Edit2 } from 'lucide-react'

type AnxietyResult = {
  id: string
  testTitle: string
  score: number
  maxScore: number
  severity: string
  completedAt: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [anxietyResults, setAnxietyResults] = useState<AnxietyResult[]>([])
  const [resultsLoading, setResultsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/anxiety-tests/results')
        if (!response.ok) return
        const json = await response.json()
        setAnxietyResults(json.results || [])
      } catch (error) {
        console.error('Failed to load anxiety results', error)
      } finally {
        setResultsLoading(false)
      }
    }

    fetchResults()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex gap-6">
            {/* Боковая панель */}
            <UserSidebar />

            {/* Основной контент */}
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">Мой профиль</h1>
                <p className="text-slate-600 mt-2">
                  Управляйте информацией о вашем профиле
                </p>
              </div>

              {/* Карточка профиля */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0">
                      {user?.image ? (
                        <img src={user.image} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {user?.name || 'Пользователь'}
                      </h2>
                      <div className="flex items-center text-slate-600 mt-2">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{user?.email || 'Не указан'}</span>
                      </div>
                      {user?.roles && user.roles.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {user.roles.map((role) => (
                            <span key={role} className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-1 rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Редактировать
                  </button>
                </div>

                {/* Информация профиля */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Полное имя
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="input-field"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="input-field bg-slate-50"
                      disabled
                    />
                    <p className="text-xs text-slate-500 mt-1">Email нельзя изменить</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ID пользователя
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.id || ''}
                      className="input-field bg-slate-50"
                      disabled
                    />
                    <p className="text-xs text-slate-500 mt-1">Уникальный идентификатор пользователя</p>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/mood-diary')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-brand-teal"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-brand-teal/10 rounded-lg p-3">
                        <Heart className="w-6 h-6 text-brand-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Дневник настроения</h3>
                        <p className="text-sm text-slate-600">Отслеживайте своё состояние</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/diary')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-brand-blue"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-brand-blue/10 rounded-lg p-3">
                        <FileText className="w-6 h-6 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Дневник активности</h3>
                        <p className="text-sm text-slate-600">Записывайте события</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/my-courses')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-purple-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Мои курсы</h3>
                        <p className="text-sm text-slate-600">Продолжить обучение</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/certificates')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-yellow-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 rounded-lg p-3">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Сертификаты</h3>
                        <p className="text-sm text-slate-600">Просмотр достижений</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => router.push('/anxiety-tests')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-emerald-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-100 rounded-lg p-3">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Оценка тревожности</h3>
                        <p className="text-sm text-slate-600">Пройдите стандартизированный тест</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Результаты тестов</h2>
                    <p className="text-sm text-slate-600">Сохраняются после прохождения в разделе «Оценка тревожности»</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => router.push('/anxiety-tests')} className="text-sm font-semibold text-emerald-600">
                      Пройти тест →
                    </button>
                    <button onClick={() => router.push('/profile/tests')} className="text-sm font-semibold text-slate-500">
                      Смотреть историю
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
