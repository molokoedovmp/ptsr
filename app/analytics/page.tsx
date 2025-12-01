'use client'

import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import Link from 'next/link'
import {
  TrendingUp,
  BookOpen,
  Heart,
  Award,
  Calendar,
  Activity,
  BarChart3,
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

interface ActivityLog {
  id: string
  action: string
  metadata?: {
    path?: string
    title?: string
    [key: string]: any
  } | null
  createdAt: string
}

const ACTIVITY_PREVIEW_COUNT = 3

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({})

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/user/activity-log')
      if (response.ok) {
        const activityData = await response.json()
        setActivityLogs(activityData.logs || [])
      } else {
        console.error('Failed to fetch activity logs:', response.status)
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    fetchActivityLogs()
  }, [])

  const logsGroupedByDate = useMemo(() => {
    return activityLogs.reduce<Record<string, ActivityLog[]>>((acc, log) => {
      const dateKey = new Date(log.createdAt).toISOString().split('T')[0]
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(log)
      return acc
    }, {})
  }, [activityLogs])

  const sortedDates = useMemo(() => Object.keys(logsGroupedByDate).sort((a, b) => (a < b ? 1 : -1)), [logsGroupedByDate])
  const displayedDates = useMemo(
    () => (selectedDate ? sortedDates.filter((date) => date === selectedDate) : sortedDates),
    [selectedDate, sortedDates],
  )

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/user/analytics')
      if (response.ok) {
        const analyticsData = await response.json()
        console.log('Analytics data:', analyticsData)
        setData(analyticsData)
      } else {
        console.error('Failed to fetch analytics:', response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (level: number) => {
    if (level >= 4.5) return '😊'
    if (level >= 3.5) return '🙂'
    if (level >= 2.5) return '😐'
    if (level >= 1.5) return '😟'
    return '😢'
  }

  const formatLogTitle = (log: ActivityLog) => {
    const rawTitle = typeof log.metadata?.title === 'string' ? log.metadata.title.trim() : undefined
    const metaTitle = rawTitle && rawTitle.length > 0 ? rawTitle : undefined
    const metaPath = typeof log.metadata?.path === 'string' ? log.metadata.path : ''
    const withTitle = (base: string) => (metaTitle ? `${base} "${metaTitle}"` : base)

    if (metaPath.startsWith('/articles/')) return withTitle('Открыли статью')
    if (metaPath.startsWith('/resources')) return withTitle('Изучили материал')
    if (metaPath.startsWith('/programs/')) return withTitle('Просмотрели программу')
    if (metaPath.startsWith('/programs')) return 'Каталог программ'
    if (metaPath.startsWith('/diary')) return 'Дневник активности'
    if (metaPath.startsWith('/mood-diary')) return 'Дневник настроения'
    if (metaPath.startsWith('/my-courses')) return 'Мои курсы'
    if (metaTitle) return metaTitle
    if (metaPath) return `Страница ${metaPath}`
    return log.action || 'Действие'
  }

  const formatDateLabel = (value: string) =>
    new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  const handleDateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedDate(value || null)
  }

  useEffect(() => {
    if (selectedDate && !logsGroupedByDate[selectedDate]) {
      setSelectedDate(null)
    }
  }, [logsGroupedByDate, selectedDate])

  const toggleDateVisibility = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }))
  }

  const moodAverage = data?.moodStats?.average ?? 0
  const averageProgress = data?.courseStats?.averageProgress ?? 0

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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Боковая панель */}
            <UserSidebar />

            {/* Основной контент */}
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-brand-teal" />
                  Журнал активности
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
                    <span className="text-2xl">{getMoodEmoji(moodAverage)}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {moodAverage.toFixed(1)}/5
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
                    {Math.round(averageProgress)}%
                  </div>
                  <div className="text-sm text-gray-600">Средний прогресс</div>
                  <div className="text-xs text-gray-500 mt-2">
                    по всем курсам
                  </div>
                </div>
              </div>

              {/* Журнал активности */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Журнал активности</h3>
                    <p className="text-sm text-gray-500">Показывает страницы, которые вы посещали в аккаунте</p>
                  </div>
                  {sortedDates.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="activity-date" className="text-sm text-gray-500">
                        Выбор дня:
                      </label>
                      <select
                        id="activity-date"
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        value={selectedDate || ''}
                        onChange={handleDateChange}
                      >
                        <option value="">Все дни</option>
                        {sortedDates.map((date) => (
                          <option key={date} value={date}>
                            {formatDateLabel(date)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {displayedDates.length === 0 ? (
                  <p className="text-sm text-gray-500">Новых действий ещё не было.</p>
                ) : (
                  <div className="space-y-6">
                    {displayedDates.map((date) => {
                      const logs = logsGroupedByDate[date] || []
                      const isExpanded = !!expandedDates[date]
                      const visibleLogs = isExpanded ? logs : logs.slice(0, ACTIVITY_PREVIEW_COUNT)
                      const hasMore = logs.length > ACTIVITY_PREVIEW_COUNT

                      return (
                        <div key={date}>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            {formatDateLabel(date)}
                          </p>
                          <div className="mt-3 space-y-3">
                            {visibleLogs.map((log) => (
                              <div key={log.id} className="rounded-2xl border border-slate-200 p-4 flex flex-col">
                                <p className="text-sm text-slate-500">
                                  {new Date(log.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {log.metadata?.path ? (
                                  <Link href={log.metadata.path} className="mt-1 text-sm font-semibold text-brand-teal hover:underline">
                                    {formatLogTitle(log)}
                                  </Link>
                                ) : (
                                  <span className="mt-1 text-sm font-semibold text-slate-900">
                                    {formatLogTitle(log)}
                                  </span>
                                )}
                              </div>
                            ))}
                            {hasMore && (
                              <button
                                type="button"
                                onClick={() => toggleDateVisibility(date)}
                                className="text-sm font-medium text-brand-teal hover:text-brand-teal/80"
                              >
                                {isExpanded ? 'Свернуть' : `Показать еще ${logs.length - ACTIVITY_PREVIEW_COUNT}`}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
