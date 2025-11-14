'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, FileText, Video, BookOpen, Award, TrendingUp, Settings, AlertCircle } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalCourses: number
  totalPosts: number
  totalVideos: number
  totalPsychologists: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  date: string
  roles: string[]
  status: string
}

interface Activity {
  action: string
  user: string
  time: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем статистику и пользователей
        const statsResponse = await fetch('/api/admin/stats')
        const statsData = await statsResponse.json()

        // Получаем активности
        const activitiesResponse = await fetch('/api/admin/activities')
        const activitiesData = await activitiesResponse.json()

        if (statsResponse.ok) {
          setStats(statsData.stats)
          setRecentUsers(statsData.recentUsers)
        }

        if (activitiesResponse.ok) {
          setRecentActivities(activitiesData.activities)
        }
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
        </div>
      </AdminProtectedRoute>
    )
  }

  const statsCards = stats ? [
    { label: 'Всего пользователей', value: stats.totalUsers.toString(), icon: <Users className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Активных программ', value: stats.totalCourses.toString(), icon: <BookOpen className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
    { label: 'Статей', value: stats.totalPosts.toString(), icon: <FileText className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Видео', value: stats.totalVideos.toString(), icon: <Video className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
  ] : []

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex gap-6">
            <AdminSidebar />
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Settings className="w-8 h-8 mr-3 text-purple-600" />
                  Админ-панель
                </h1>
                <p className="text-gray-600 mt-2">
                  Управление платформой ПТСР Эксперт
                </p>
              </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Быстрые действия */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => router.push('/admin/users/new')}
                className="btn-primary text-sm py-3"
              >
                Добавить пользователя
              </button>
              <button 
                onClick={() => router.push('/admin/articles/new')}
                className="btn-secondary text-sm py-3"
              >
                Создать статью
              </button>
              <button 
                onClick={() => router.push('/admin/videos/new')}
                className="btn-secondary text-sm py-3"
              >
                Добавить видео
              </button>
              <button 
                onClick={() => router.push('/admin/courses/new')}
                className="btn-secondary text-sm py-3"
              >
                Создать программу
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Недавние пользователи */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Недавние пользователи</h2>
              <div className="space-y-4">
                {recentUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Нет зарегистрированных пользователей</p>
                ) : (
                  recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{user.date}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </div>
                  ))
                )}
              </div>
              {recentUsers.length > 0 && (
                <Link href="/admin/users" className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm inline-block">
                  Посмотреть всех пользователей →
                </Link>
              )}
            </div>

            {/* Недавняя активность */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Недавняя активность</h2>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Нет недавней активности</p>
                ) : (
                  recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                    <div className="bg-primary-100 rounded-full p-2 mt-1">
                      <AlertCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Разделы управления */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Разделы управления</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/admin/users" className="card hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Управление пользователями
                </h3>
                <p className="text-sm text-gray-600">
                  Просмотр, редактирование и модерация пользователей
                </p>
              </Link>

              <Link href="/admin/articles" className="card hover:shadow-xl transition-shadow">
                <FileText className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Управление статьями
                </h3>
                <p className="text-sm text-gray-600">
                  Создание и редактирование образовательных статей
                </p>
              </Link>

              <Link href="/admin/videos" className="card hover:shadow-xl transition-shadow">
                <Video className="w-8 h-8 text-yellow-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Управление видео
                </h3>
                <p className="text-sm text-gray-600">
                  Добавление и управление видеоматериалами
                </p>
              </Link>

              <Link href="/admin/courses" className="card hover:shadow-xl transition-shadow">
                <BookOpen className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Управление курсами
                </h3>
                <p className="text-sm text-gray-600">
                  Создание и управление образовательными программами
                </p>
              </Link>

              <Link href="/admin/psychologists" className="card hover:shadow-xl transition-shadow">
                <Award className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Управление психологами
                </h3>
                <p className="text-sm text-gray-600">
                  Модерация и управление специалистами
                </p>
              </Link>

              <Link href="/admin/analytics" className="card hover:shadow-xl transition-shadow">
                <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Аналитика
                </h3>
                <p className="text-sm text-gray-600">
                  Статистика посещений и использования платформы
                </p>
              </Link>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

