'use client'

import PsychologistProtectedRoute from '@/components/psychologist/PsychologistProtectedRoute'
import { Calendar, Users, Clock, TrendingUp, Settings, DollarSign, Star } from 'lucide-react'

export default function PsychologistDashboardPage() {
  const stats = [
    { label: 'Консультаций сегодня', value: '3', icon: <Users className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Активных клиентов', value: '12', icon: <Users className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
    { label: 'Доход за месяц', value: '45,000₽', icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Рейтинг', value: '4.9', icon: <Star className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
  ]

  const upcomingSessions = [
    {
      id: 1,
      client: 'Анна П.',
      time: '14:00 - 15:00',
      type: 'Первичная консультация',
      status: 'confirmed',
    },
    {
      id: 2,
      client: 'Михаил И.',
      time: '16:00 - 17:00',
      type: 'Регулярная сессия',
      status: 'confirmed',
    },
    {
      id: 3,
      client: 'Елена С.',
      time: '18:00 - 19:00',
      type: 'Регулярная сессия',
      status: 'pending',
    },
  ]

  return (
    <PsychologistProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-green-600" />
              Кабинет психолога
            </h1>
            <p className="text-gray-600 mt-2">
              Управление консультациями и расписанием
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
                Настроить доступность
              </button>
              <button className="btn-secondary text-sm py-3">
                Просмотреть клиентов
              </button>
              <button className="btn-secondary text-sm py-3">
                Редактировать профиль
              </button>
              <button className="btn-secondary text-sm py-3">
                Статистика
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Предстоящие сессии */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Предстоящие консультации
                  </h2>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Календарь →
                  </button>
                </div>

                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {session.client}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.time}
                            </span>
                            <span>{session.type}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          session.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {session.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                          Начать сессию
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                          Детали
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {upcomingSessions.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Нет предстоящих консультаций
                    </h3>
                    <p className="text-gray-600">
                      Настройте свою доступность, чтобы клиенты могли записаться
                    </p>
                  </div>
                )}
              </div>

              {/* Управление расписанием */}
              <div className="card mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Управление расписанием
                </h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Рабочие часы
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Понедельник - Пятница</span>
                        <span className="font-medium">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Суббота</span>
                        <span className="font-medium">10:00 - 15:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Воскресенье</span>
                        <span className="font-medium text-gray-500">Выходной</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full btn-secondary text-sm">
                      Изменить расписание
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Профиль */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ваш профиль</h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
                <button className="w-full btn-secondary text-sm">
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Редактировать профиль
                </button>
              </div>

              {/* Статистика за месяц */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Статистика за месяц
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Проведено сессий</span>
                      <span className="font-semibold">28</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Новых клиентов: <span className="font-semibold">5</span></p>
                    <p className="mt-1">Повторных сессий: <span className="font-semibold">23</span></p>
                  </div>
                </div>
              </div>

              {/* Доход */}
              <div className="card bg-purple-50 border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Доход
                </h3>
                <p className="text-3xl font-bold text-purple-900 mb-2">
                  45,000₽
                </p>
                <p className="text-sm text-purple-800">
                  За текущий месяц
                </p>
                <button className="mt-4 text-purple-700 font-medium text-sm hover:text-purple-800">
                  Посмотреть детали →
                </button>
              </div>

              {/* Совет */}
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Совет
                </h3>
                <p className="text-sm text-blue-800">
                  Заполните информацию о своих специализациях и подходах, 
                  чтобы клиенты могли лучше понять, подходите ли вы им.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PsychologistProtectedRoute>
  )
}

