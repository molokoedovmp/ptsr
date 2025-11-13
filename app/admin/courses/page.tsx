'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { BookOpen, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  price: number
  durationWeeks: number
  level: string
  published: boolean
  createdAt: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить курс?')) return

    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Курс удален')
        fetchCourses()
      } else {
        alert('Ошибка удаления')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка удаления')
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (response.ok) {
        fetchCourses()
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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-green-600" />
                  Управление курсами
                </h1>
                <p className="text-gray-600 mt-2">Всего курсов: {courses.length}</p>
              </div>
              <Link href="/admin/courses/new" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Создать курс</span>
              </Link>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Курсы отсутствуют</h3>
              <p className="text-gray-600 mb-6">Создайте первый курс</p>
              <Link href="/admin/courses/new" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Создать курс</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Курс</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Уровень</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Длительность</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">/{course.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.durationWeeks} недель
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.price.toLocaleString()}₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(course.id, course.published)}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {course.published ? 'Опубликован' : 'Черновик'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/courses/${course.id}/edit`} className="text-brand-teal hover:text-brand-teal/80">
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(course.id, course.published)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {course.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-5 h-5" />
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
    </AdminProtectedRoute>
  )
}
