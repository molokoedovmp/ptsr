'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { Award, Download, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CertificatesPage() {
  // Пока заглушка, позже добавим реальные данные
  const certificates = []

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
                <h1 className="text-3xl font-heading font-bold text-slate-900">Мои сертификаты</h1>
                <p className="text-slate-600 mt-2">
                  Ваши достижения и завершённые программы
                </p>
              </div>

              {/* Содержимое */}
              {certificates.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    У вас пока нет сертификатов
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Завершите курс, чтобы получить сертификат о прохождении обучения. Сертификаты подтверждают ваши достижения и прогресс.
                  </p>
                  <Link
                    href="/my-courses"
                    className="inline-flex items-center bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
                  >
                    Перейти к моим курсам
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Здесь будут карточки сертификатов */}
                  {certificates.map((cert: any) => (
                    <div key={cert.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{cert.title}</h3>
                            <div className="flex items-center text-sm text-slate-600 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(cert.date).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        </div>
                        <button className="text-brand-teal hover:text-brand-teal/80">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">
                        {cert.description}
                      </p>
                      <button className="w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                        Просмотреть сертификат
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

