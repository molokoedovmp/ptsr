'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { TrendingUp, ArrowLeft, Users, BookOpen, FileText, Calendar, Eye, Award, Monitor, Globe, Smartphone } from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  totalCourses: number
  totalArticles: number
  totalPsychologists: number
  usersGrowth: { date: string; count: number }[]
  topArticles: { title: string; views: number }[]
  courseEnrollments: { title: string; enrolled: number }[]
}

interface VisitorAnalytics {
  totalVisits: number
  uniqueVisitors: number
  avgDuration: number
  countriesData: { country: string; visits: number }[]
  devicesData: { device: string; visits: number }[]
  osData: { os: string; visits: number }[]
  browsersData: { browser: string; visits: number }[]
  pagesData: { page: string; visits: number }[]
  dailyVisits: { date: string; visits: number }[]
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7')

  useEffect(() => {
    fetchAnalytics()
    fetchVisitorAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchVisitorAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/visitors?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setVisitorAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching visitor analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
        </div>
      </AdminProtectedRoute>
    )
  }

  if (!analytics) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container-custom">
            <div className="text-center py-20">
              <TrendingUp className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Ошибка загрузки аналитики
              </h1>
              <Link
                href="/admin/dashboard"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Вернуться в панель управления</span>
              </Link>
            </div>
          </div>
        </div>
      </AdminProtectedRoute>
    )
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex gap-6">
            <AdminSidebar />
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                      <TrendingUp className="w-8 h-8 mr-3 text-indigo-600" />
                      Аналитика платформы
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Статистика использования и активности пользователей
                    </p>
                  </div>
              <div className="flex items-center space-x-4">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="input-field"
                >
                  <option value="7">7 дней</option>
                  <option value="14">14 дней</option>
                  <option value="30">30 дней</option>
                  <option value="90">90 дней</option>
                </select>
                <Link
                  href="/admin/dashboard"
                  className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Назад
                </Link>
              </div>
            </div>
          </div>

          {/* Ключевые метрики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Всего пользователей</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Курсов</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalCourses}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Статей</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalArticles}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Психологов</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalPsychologists}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* График роста пользователей */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
                Рост пользователей
              </h2>
              {analytics.usersGrowth.length > 0 ? (
                <div className="space-y-3">
                  {analytics.usersGrowth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.date}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-brand-teal rounded-full h-2"
                            style={{ width: `${(item.count / Math.max(...analytics.usersGrowth.map(u => u.count))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Нет данных о регистрациях</p>
              )}
            </div>

            {/* Топ статей */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-purple-600" />
                Популярные статьи
              </h2>
              {analytics.topArticles.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topArticles.map((article, index) => (
                    <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">{article.title}</p>
                          <p className="text-sm text-gray-500">{article.views} просмотров</p>
                        </div>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Нет данных о просмотрах</p>
              )}
            </div>
          </div>

          {/* Записи на курсы */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-green-600" />
              Популярность курсов
            </h2>
            {analytics.courseEnrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.courseEnrollments.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {course.enrolled} записалось
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет данных о записях на курсы</p>
            )}
          </div>

          {/* Аналитика посещений */}
          {visitorAnalytics && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Globe className="w-7 h-7 mr-2 text-indigo-600" />
                  Аналитика посещений
                </h2>
              </div>

              {/* Метрики посещений */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Всего посещений</p>
                      <p className="text-3xl font-bold text-gray-900">{visitorAnalytics.totalVisits}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-indigo-100">
                      <Eye className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Уникальных посетителей</p>
                      <p className="text-3xl font-bold text-gray-900">{visitorAnalytics.uniqueVisitors}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-teal-100">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Среднее время (сек)</p>
                      <p className="text-3xl font-bold text-gray-900">{visitorAnalytics.avgDuration}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-100">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Посещения по дням */}
              <div className="card mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Посещения по дням</h3>
                <div className="space-y-3">
                  {visitorAnalytics.dailyVisits.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.date}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-64 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 rounded-full h-2"
                            style={{ width: `${(item.visits / Math.max(...visitorAnalytics.dailyVisits.map(v => v.visits))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {item.visits}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Топ стран */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Globe className="w-6 h-6 mr-2 text-blue-600" />
                    Посещения по странам
                  </h3>
                  <div className="space-y-3">
                    {visitorAnalytics.countriesData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 w-6">#{index + 1}</span>
                          <span className="text-sm text-gray-900">{item.country}</span>
                        </div>
                        <span className="text-sm font-medium text-brand-teal">{item.visits}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Топ страниц */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-purple-600" />
                    Популярные страницы
                  </h3>
                  <div className="space-y-3">
                    {visitorAnalytics.pagesData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-xs font-medium text-gray-500 w-6">#{index + 1}</span>
                          <span className="text-sm text-gray-900 truncate">{item.page}</span>
                        </div>
                        <span className="text-sm font-medium text-brand-teal ml-2">{item.visits}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Устройства */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Smartphone className="w-6 h-6 mr-2 text-green-600" />
                    Устройства
                  </h3>
                  <div className="space-y-4">
                    {visitorAnalytics.devicesData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 capitalize">{item.device}</span>
                          <span className="text-sm font-medium text-gray-900">{item.visits}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 rounded-full h-2"
                            style={{ width: `${(item.visits / visitorAnalytics.totalVisits) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Операционные системы */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Monitor className="w-6 h-6 mr-2 text-orange-600" />
                    ОС
                  </h3>
                  <div className="space-y-4">
                    {visitorAnalytics.osData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.os}</span>
                          <span className="text-sm font-medium text-gray-900">{item.visits}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 rounded-full h-2"
                            style={{ width: `${(item.visits / visitorAnalytics.totalVisits) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Браузеры */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Monitor className="w-6 h-6 mr-2 text-purple-600" />
                    Браузеры
                  </h3>
                  <div className="space-y-4">
                    {visitorAnalytics.browsersData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.browser}</span>
                          <span className="text-sm font-medium text-gray-900">{item.visits}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 rounded-full h-2"
                            style={{ width: `${(item.visits / visitorAnalytics.totalVisits) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
