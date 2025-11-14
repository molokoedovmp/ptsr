'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Award, Plus, Edit, Trash2, Check, X } from 'lucide-react'

interface Psychologist {
  id: string
  userId: string
  specialization: string[]
  experienceYears: number
  price: number
  verified: boolean
  available: boolean
  user: {
    fullName: string | null
    email: string
  }
}

export default function AdminPsychologistsPage() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPsychologists()
  }, [])

  const fetchPsychologists = async () => {
    try {
      const response = await fetch('/api/admin/psychologists')
      if (response.ok) {
        const data = await response.json()
        setPsychologists(data.psychologists)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/psychologists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus }),
      })

      if (response.ok) {
        fetchPsychologists()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/psychologists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentStatus }),
      })

      if (response.ok) {
        fetchPsychologists()
      }
    } catch (error) {
      console.error('Error:', error)
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

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex gap-6">
            <AdminSidebar />
            <div className="flex-1">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                      <Award className="w-8 h-8 mr-3 text-red-600" />
                      Управление психологами
                    </h1>
                    <p className="text-gray-600 mt-2">Всего психологов: {psychologists.length}</p>
                  </div>
                </div>
              </div>

          {psychologists.length === 0 ? (
            <div className="card text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Психологи отсутствуют</h3>
              <p className="text-gray-600">Пока нет зарегистрированных психологов</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Психолог</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Специализация</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Опыт</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {psychologists.map((psychologist) => (
                    <tr key={psychologist.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {psychologist.user.fullName || 'Имя не указано'}
                        </div>
                        <div className="text-sm text-gray-500">{psychologist.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {psychologist.specialization.slice(0, 2).map((spec, i) => (
                            <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {psychologist.experienceYears} лет
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {psychologist.price.toLocaleString()}₽/час
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleToggleVerified(psychologist.id, psychologist.verified)}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              psychologist.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {psychologist.verified ? '✓ Верифицирован' : 'Не верифицирован'}
                          </button>
                          <button
                            onClick={() => handleToggleAvailable(psychologist.id, psychologist.available)}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              psychologist.available ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {psychologist.available ? 'Доступен' : 'Недоступен'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleVerified(psychologist.id, psychologist.verified)}
                            className={psychologist.verified ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                            title={psychologist.verified ? 'Снять верификацию' : 'Верифицировать'}
                          >
                            {psychologist.verified ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
