'use client'

import Link from 'next/link'
import { UserCircle, Brain } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Регистрация</h2>
          <p className="text-lg text-gray-600">
            Выберите тип аккаунта для продолжения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Регистрация пользователя */}
          <Link href="/register/user" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <UserCircle className="w-12 h-12 text-primary-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Я ищу помощь
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Получите доступ к специалистам, программам восстановления, 
                образовательным ресурсам и инструментам для отслеживания прогресса
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  <span>Доступ к специалистам</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  <span>Образовательные программы</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  <span>Дневник настроения</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  <span>Библиотека ресурсов</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="btn-primary inline-block w-full">
                  Зарегистрироваться как пользователь
                </span>
              </div>
            </div>
          </Link>

          {/* Регистрация психолога */}
          <Link href="/register/psychologist" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Brain className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Я специалист
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Присоединяйтесь к нашей команде профессионалов для помощи людям 
                с ПТСР. Управляйте консультациями и делитесь опытом
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>Управление расписанием</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>Личный кабинет</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>Консультации с клиентами</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>Профессиональный профиль</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium inline-block w-full">
                  Зарегистрироваться как психолог
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Войти в систему
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

