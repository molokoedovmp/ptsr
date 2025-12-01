'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { Bell, Lock, Eye, EyeOff, Save } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [newsletter, setNewsletter] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSaveSettings = () => {
    alert('Настройки сохранены!')
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
                <h1 className="text-3xl font-heading font-bold text-slate-900">Настройки</h1>
                <p className="text-slate-600 mt-2">
                  Управляйте настройками аккаунта и уведомлениями
                </p>
              </div>

              {/* Уведомления */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Уведомления</h2>
                    <p className="text-sm text-slate-600">Управление уведомлениями</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-slate-900">Уведомления по email</div>
                      <div className="text-sm text-slate-600">Получать важные обновления на почту</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-slate-900">Напоминания</div>
                      <div className="text-sm text-slate-600">Напоминания о записях в дневнике</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={reminderNotifications}
                        onChange={(e) => setReminderNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-slate-900">Новостная рассылка</div>
                      <div className="text-sm text-slate-600">Новости и полезные материалы</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Безопасность */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Безопасность</h2>
                    <p className="text-sm text-slate-600">Защита вашего аккаунта</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email нельзя изменить</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Новый пароль
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Введите новый пароль"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Подтвердите пароль
                    </label>
                    <input
                      type="password"
                      placeholder="Повторите новый пароль"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    />
                  </div>

                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Изменить пароль
                  </button>
                </div>
              </div>

              {/* Кнопка сохранения */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center space-x-2 bg-brand-teal text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>Сохранить настройки</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
