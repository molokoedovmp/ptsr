'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { User, ArrowLeft, Save, Loader } from 'lucide-react'

export default function AdminUserEditPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const isNew = userId === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    roles: [] as string[],
  })

  useEffect(() => {
    if (!isNew) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          email: data.email,
          fullName: data.fullName || '',
          password: '',
          roles: data.roles,
        })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNew ? '/api/admin/users' : `/api/admin/users/${userId}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(isNew ? 'Пользователь создан!' : 'Пользователь обновлен!')
        router.push('/admin/users')
      } else {
        const error = await response.json()
        alert(error.error || 'Произошла ошибка')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Произошла ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }))
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
        <div className="container-custom max-w-3xl">
          {/* Заголовок */}
          <div className="mb-8">
            <Link
              href="/admin/users"
              className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к списку
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <User className="w-8 h-8 mr-3 text-blue-600" />
              {isNew ? 'Создать пользователя' : 'Редактировать пользователя'}
            </h1>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="card">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="user@example.com"
                />
              </div>

              {/* Полное имя */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Полное имя
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                  placeholder="Иван Иванов"
                />
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль {isNew && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  required={isNew}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder={isNew ? 'Введите пароль' : 'Оставьте пустым, чтобы не менять'}
                />
                {!isNew && (
                  <p className="text-xs text-gray-500 mt-1">
                    Оставьте пустым, если не хотите менять пароль
                  </p>
                )}
              </div>

              {/* Роли */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Роли
                </label>
                <div className="space-y-2">
                  {['USER', 'ADMIN', 'SUPPORT', 'PSYCHOLOGIST'].map((role) => (
                    <label key={role} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="mr-3 h-4 w-4 text-brand-teal rounded"
                      />
                      <span className="text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Link
                  href="/admin/users"
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Сохранение...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{isNew ? 'Создать' : 'Сохранить'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

