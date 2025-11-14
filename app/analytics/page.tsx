'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Award,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react'

interface AnalyticsData {
  diaryStats: {
    total: number
    thisWeek: number
    thisMonth: number
    byType: Record<string, number>
  }
  moodStats: {
    total: number
    average: number
    thisWeek: any[]
    thisMonth: any[]
  }
  courseStats: {
    total: number
    inProgress: number
    completed: number
    averageProgress: number
    courses: any[]
  }
  charts: {
    diaryByDay: { date: string; count: number }[]
    moodByDay: { date: string; average: number | null }[]
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/user/analytics')
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodColor = (level: number) => {
    if (level >= 4.5) return 'bg-green-500'
    if (level >= 3.5) return 'bg-lime-500'
    if (level >= 2.5) return 'bg-yellow-500'
    if (level >= 1.5) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getMoodEmoji = (level: number) => {
    if (level >= 4.5) return '😊'
    if (level >= 3.5) return '🙂'
    if (level >= 2.5) return '😐'
    if (level >= 1.5) return '😟'
    return '😢'
  }

  const activityTypeLabels: Record<string, string> = {
    activity: 'Активность',
    practice: 'Практика',
    social: 'Социальное',
    reflection: 'Рефлексия',
    therapy: 'Терапия',
    other: 'Другое',
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
          <div className="container-custom">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

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
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-brand-teal" />
                  Моя аналитика
                </h1>
                <p className="text-gray-600 mt-2">
                  Отслеживайте свой прогресс и динамику изменений
                </p>
              </div>

              {/* Основные метрики */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{data?.diaryStats.total || 0}</div>
                  <div className="text-sm text-gray-600">Записей в дневнике</div>
                  <div className="text-xs text-gray-500 mt-2">
                    +{data?.diaryStats.thisWeek || 0} за неделю
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <span className="text-2xl">{getMoodEmoji(data?.moodStats.average || 0)}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {data?.moodStats.average.toFixed(1) || 0}/5
                  </div>
                  <div className="text-sm text-gray-600">Среднее настроение</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {data?.moodStats.total || 0} записей
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{data?.courseStats.inProgress || 0}</div>
                  <div className="text-sm text-gray-600">Активных курсов</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {data?.courseStats.completed || 0} завершено
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {data?.courseStats.averageProgress.toFixed(0) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Средний прогресс</div>
                  <div className="text-xs text-gray-500 mt-2">
                    по всем курсам
                  </div>
                </div>
              </div>

              {/* Графики */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* График активности дневника */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Активность ведения дневника (30 дней)
                  </h3>
                  <div className="flex items-end justify-between h-48 gap-1">
                    {data?.charts.diaryByDay.map((day, index) => {
                      const maxCount = Math.max(...(data?.charts.diaryByDay.map(d => d.count) || [1]))
                      const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-brand-teal rounded-t transition-all hover:bg-brand-teal/80 cursor-pointer"
                            style={{ height: `${height}%` }}
                            title={`${new Date(day.date).toLocaleDateString('ru-RU')}: ${day.count} записей`}
                          />
                          {index % 5 === 0 && (
                            <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
                              {new Date(day.date).getDate()}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* График настроения */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Динамика настроения (30 дней)
                  </h3>
                  <div className="flex items-end justify-between h-48 gap-1">
                    {data?.charts.moodByDay.map((day, index) => {
                      const height = day.average ? (day.average / 5) * 100 : 0
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t transition-all hover:opacity-80 cursor-pointer ${
                              day.average ? getMoodColor(day.average) : 'bg-gray-200'
                            }`}
                            style={{ height: `${height}%` }}
                            title={`${new Date(day.date).toLocaleDateString('ru-RU')}: ${day.average?.toFixed(1) || 'нет данных'}`}
                          />
                          {index % 5 === 0 && (
                            <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
                              {new Date(day.date).getDate()}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Плохо</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Нормально</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Отлично</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Типы активностей */}
              {data && data.diaryStats.byType && Object.keys(data.diaryStats.byType).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Распределение по типам активностей
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(data.diaryStats.byType)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([type, count]) => {
                        const percentage = ((count as number) / data.diaryStats.total) * 100
                        return (
                          <div key={type}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                {activityTypeLabels[type] || type}
                              </span>
                              <span className="text-sm text-gray-600">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-teal transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Прогресс по курсам */}
              {data && data.courseStats.courses && data.courseStats.courses.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Прогресс по курсам
                  </h3>
                  <div className="space-y-4">
                    {data.courseStats.courses.map((course, index) => (
                      <div key={index} className="border-l-4 border-brand-teal pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{course.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            course.completed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {course.completed ? 'Завершён' : 'В процессе'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-teal transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
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

