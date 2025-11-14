'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Phone, Calendar, BookOpen, Award, CreditCard, Settings, ArrowRight, Clock } from 'lucide-react'

interface Enrollment {
  id: string
  progress: number
  completed: boolean
  course: {
    id: string
    title: string
    slug: string
    description: string
    durationWeeks: number
    level: string
    coverImage: string | null
    _count: {
      modules: number
    }
  }
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)

  useEffect(() => {
    if (activeTab === 'courses') {
      fetchEnrollments()
    }
  }, [activeTab])

  const fetchEnrollments = async () => {
    setLoadingCourses(true)
    try {
      const response = await fetch('/api/user/enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoadingCourses(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Информация о профиле', icon: <User className="w-5 h-5" /> },
    { id: 'courses', label: 'Мои курсы', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'certificates', label: 'Сертификаты', icon: <Award className="w-5 h-5" /> },
    { id: 'transactions', label: 'Транзакции', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'settings', label: 'Настройки', icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-slate-900">Личный кабинет</h1>
            <p className="text-slate-600 mt-2">
              Управляйте своим профилем и отслеживайте прогресс
            </p>
          </div>

          {/* Карточка профиля */}
          <div className="card mb-8">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0">
                {user?.image ? (
                  <img src={user.image} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="flex-1">
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
              <button className="bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors">
                Редактировать профиль
              </button>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button 
              onClick={() => router.push('/mood-diary')}
              className="card hover:shadow-xl transition-shadow text-left hover:border-brand-teal"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-brand-teal/10 rounded-lg p-3">
                  <BookOpen className="w-6 h-6 text-brand-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Дневник настроения</h3>
                  <p className="text-sm text-slate-600">Отслеживайте своё состояние</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/diary')}
              className="card hover:shadow-xl transition-shadow text-left hover:border-brand-blue"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-brand-blue/10 rounded-lg p-3">
                  <Calendar className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Дневник активности</h3>
                  <p className="text-sm text-slate-600">Записывайте события</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/my-courses')}
              className="card hover:shadow-xl transition-shadow text-left hover:border-purple-600"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Мои курсы</h3>
                  <p className="text-sm text-slate-600">Продолжить обучение</p>
                </div>
              </div>
            </button>
          </div>

          {/* Табы */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Навигация по табам */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-brand-teal border-b-2 border-brand-teal'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Содержимое табов */}
            <div className="p-6">
              {activeTab === 'profile' && (
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
                      className="input-field"
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
                  <button className="bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors">
                    Сохранить изменения
                  </button>
                </div>
              )}

              {activeTab === 'courses' && (
                <>
                  {loadingCourses ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
                    </div>
                  ) : enrollments.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        У вас пока нет активных курсов
                      </h3>
                      <p className="text-slate-600 mb-6">
                        Начните свой путь восстановления с одной из наших программ
                      </p>
                      <Link
                        href="/programs"
                        className="inline-block bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
                      >
                        Посмотреть программы
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {enrollment.course.title}
                              </h3>
                              <p className="text-slate-600 text-sm mb-4">
                                {enrollment.course.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-3 mb-4">
                                <div className="flex items-center text-sm text-slate-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {enrollment.course.durationWeeks} недель
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  {enrollment.course._count.modules} модулей
                                </div>
                                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                                  {enrollment.course.level}
                                </span>
                              </div>

                              {/* Прогресс */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="text-slate-600">Прогресс</span>
                                  <span className="font-semibold text-slate-900">{enrollment.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-brand-teal transition-all"
                                    style={{ width: `${enrollment.progress}%` }}
                                  />
                                </div>
                              </div>

                              <Link
                                href={`/learn/${enrollment.course.slug}`}
                                className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 font-medium"
                              >
                                Продолжить обучение
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </div>

                            {enrollment.course.coverImage && (
                              <img
                                src={enrollment.course.coverImage}
                                alt={enrollment.course.title}
                                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4">
                        <Link
                          href="/my-courses"
                          className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 font-medium"
                        >
                          Посмотреть все курсы
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'certificates' && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    У вас пока нет сертификатов
                  </h3>
                  <p className="text-slate-600">
                    Завершите курс, чтобы получить сертификат о прохождении
                  </p>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    История транзакций пуста
                  </h3>
                  <p className="text-slate-600">
                    Здесь будет отображаться история ваших платежей
                  </p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Настройки уведомлений
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-brand-teal rounded" defaultChecked />
                        <span className="text-slate-700">Уведомления по email</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-brand-teal rounded" defaultChecked />
                        <span className="text-slate-700">Напоминания о консультациях</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-brand-teal rounded" />
                        <span className="text-slate-700">Новостная рассылка</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Безопасность
                    </h3>
                    <button className="bg-slate-200 text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors">
                      Изменить пароль
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

