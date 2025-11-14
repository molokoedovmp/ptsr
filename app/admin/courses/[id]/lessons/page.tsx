'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { BookOpen, ArrowLeft, Plus, Edit, Trash2, GripVertical, Video, Clock } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  duration: number | null
  videoUrl: string | null
  isFree: boolean
  orderIndex: number
}

interface Module {
  id: string
  title: string
  orderIndex: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
}

export default function CourseLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      console.log('Fetching course lessons for ID:', courseId)
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Received data:', data)
        console.log('Modules count:', data.modules?.length)
        
        setCourse(data.course)
        setModules(data.modules)
        if (data.modules.length > 0) {
          setSelectedModule(data.modules[0].id)
        }
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Удалить этот урок?')) return

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Урок удален')
        fetchCourse()
      } else {
        alert('Ошибка удаления')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка удаления')
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

  const selectedModuleData = modules.find(m => m.id === selectedModule)

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom max-w-7xl">
          <div className="mb-8">
            <Link href={`/admin/courses/${courseId}/edit`} className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад к курсу
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-green-600" />
              Уроки курса: {course?.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Список модулей */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Модули</h2>
                {modules.length === 0 ? (
                  <p className="text-gray-600 text-sm">Нет модулей</p>
                ) : (
                  <div className="space-y-2">
                    {modules.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => setSelectedModule(module.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedModule === module.id
                            ? 'bg-brand-teal text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{module.title}</div>
                        <div className={`text-sm ${selectedModule === module.id ? 'text-teal-100' : 'text-gray-500'}`}>
                          {module.lessons.length} уроков
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Список уроков */}
            <div className="lg:col-span-3">
              {selectedModuleData ? (
                <div className="bg-white rounded-xl shadow-md">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedModuleData.title}</h2>
                      <p className="text-gray-600 mt-1">Уроков: {selectedModuleData.lessons.length}</p>
                    </div>
                    <Link
                      href={`/admin/courses/${courseId}/lessons/new?moduleId=${selectedModuleData.id}`}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Добавить урок</span>
                    </Link>
                  </div>

                  {selectedModuleData.lessons.length === 0 ? (
                    <div className="p-12 text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет уроков</h3>
                      <p className="text-gray-600 mb-6">Добавьте первый урок в этот модуль</p>
                      <Link
                        href={`/admin/courses/${courseId}/lessons/new?moduleId=${selectedModuleData.id}`}
                        className="btn-primary inline-flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Добавить урок</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {selectedModuleData.lessons
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((lesson, index) => (
                          <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="flex items-center justify-center w-8 h-8 bg-brand-teal text-white rounded-lg font-bold text-sm">
                                    {index + 1}
                                  </span>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {lesson.title}
                                  </h3>
                                  {lesson.isFree && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                      Бесплатный
                                    </span>
                                  )}
                                </div>
                                
                                {lesson.description && (
                                  <p className="text-gray-600 mb-3 ml-11">
                                    {lesson.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-3 ml-11">
                                  {lesson.duration && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {lesson.duration} мин
                                    </div>
                                  )}
                                  {lesson.videoUrl && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Video className="w-4 h-4 mr-1" />
                                      Видео
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Link
                                  href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`}
                                  className="text-brand-teal hover:text-brand-teal/80 p-2"
                                >
                                  <Edit className="w-5 h-5" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="text-red-600 hover:text-red-800 p-2"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Выберите модуль</h3>
                  <p className="text-gray-600">Выберите модуль слева для просмотра уроков</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

