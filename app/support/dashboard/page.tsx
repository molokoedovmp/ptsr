'use client'

import SupportProtectedRoute from '@/components/support/SupportProtectedRoute'
import { MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp, FileText, Video } from 'lucide-react'

export default function SupportDashboardPage() {
  const stats = [
    { label: 'Открытых тикетов', value: '12', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { label: 'В обработке', value: '8', icon: <Clock className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Решенных сегодня', value: '15', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
    { label: 'Высокий приоритет', value: '3', icon: <AlertCircle className="w-6 h-6" />, color: 'bg-red-100 text-red-600' },
  ]

  const tickets = [
    {
      id: 1,
      subject: 'Не могу войти в аккаунт',
      user: 'Анна Петрова',
      priority: 'high',
      status: 'open',
      time: '30 минут назад',
    },
    {
      id: 2,
      subject: 'Вопрос об оплате курса',
      user: 'Михаил Иванов',
      priority: 'medium',
      status: 'in_progress',
      time: '2 часа назад',
    },
    {
      id: 3,
      subject: 'Проблема с видео',
      user: 'Елена Сидорова',
      priority: 'low',
      status: 'open',
      time: '5 часов назад',
    },
  ]

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-700',
    }
    const labels = {
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
    }
    const labels = {
      open: 'Открыт',
      in_progress: 'В работе',
      resolved: 'Решен',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <SupportProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
              Панель техподдержки
            </h1>
            <p className="text-gray-600 mt-2">
              Обработка заявок и управление контентом
            </p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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
              <button className="btn-primary text-sm py-3">
                Просмотреть тикеты
              </button>
              <button className="btn-secondary text-sm py-3">
                Создать статью
              </button>
              <button className="btn-secondary text-sm py-3">
                Добавить видео
              </button>
              <button className="btn-secondary text-sm py-3">
                Статистика
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Тикеты */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Тикеты поддержки</h2>
                  <select className="input-field w-auto">
                    <option>Все тикеты</option>
                    <option>Открытые</option>
                    <option>В работе</option>
                    <option>Решенные</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {ticket.subject}
                          </h3>
                          <p className="text-sm text-gray-600">{ticket.user}</p>
                        </div>
                        <div className="text-right space-x-2">
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Тикет #{ticket.id}</span>
                        <span>{ticket.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2">
                  Показать все тикеты →
                </button>
              </div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Производительность */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Ваша производительность
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Решенных сегодня</span>
                      <span className="font-semibold">15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Среднее время ответа: <span className="font-semibold">2.5 ч</span></p>
                    <p className="mt-1">Рейтинг удовлетворенности: <span className="font-semibold">4.8 / 5</span></p>
                  </div>
                </div>
              </div>

              {/* Управление контентом */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Управление контентом
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Статьи</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">156</span>
                  </button>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Видео</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">89</span>
                  </button>
                </div>
              </div>

              {/* Подсказка */}
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Совет
                </h3>
                <p className="text-sm text-blue-800">
                  При ответе на тикеты используйте шаблоны ответов для ускорения работы. 
                  Они доступны в редакторе сообщений.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SupportProtectedRoute>
  )
}

