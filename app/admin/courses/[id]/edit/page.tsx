'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { BookOpen, ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react'

interface Module {
  id?: string
  title: string
  description: string
  orderIndex: number
  content: string
}

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    fullDescription: '',
    price: '',
    durationWeeks: '',
    level: '',
    coverImage: '',
    published: false,
  })
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          fullDescription: data.fullDescription,
          price: data.price.toString(),
          durationWeeks: data.durationWeeks.toString(),
          level: data.level,
          coverImage: data.coverImage || '',
          published: data.published,
        })
        setModules(data.modules || [])
      } else {
        setError('Курс не найден')
      }
    } catch (err) {
      setError('Ошибка загрузки курса')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          durationWeeks: parseInt(formData.durationWeeks),
          modules: modules,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сохранения')
      }

      alert('Курс сохранен!')
      router.push('/admin/courses')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const addModule = () => {
    setModules([...modules, {
      title: '',
      description: '',
      orderIndex: modules.length,
      content: '',
    }])
  }

  const removeModule = (index: number) => {
    if (confirm('Удалить этот модуль?')) {
      setModules(modules.filter((_, i) => i !== index).map((m, i) => ({ ...m, orderIndex: i })))
    }
  }

  const updateModule = (index: number, field: keyof Module, value: string | number) => {
    const updated = [...modules]
    updated[index] = { ...updated[index], [field]: value }
    setModules(updated)
  }

  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === modules.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...modules]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    
    updated[index].orderIndex = index
    updated[newIndex].orderIndex = newIndex
    
    setModules(updated)
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
        <div className="container-custom max-w-6xl">
          <div className="mb-8">
            <Link href="/admin/courses" className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад к курсам
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-green-600" />
              Редактировать курс
            </h1>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Основная информация */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Основная информация</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название курса *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL (slug) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Краткое описание *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Полное описание *</label>
                  <textarea
                    required
                    value={formData.fullDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                    className="input-field"
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Цена (₽) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Длительность (недель) *</label>
                    <input
                      type="number"
                      required
                      value={formData.durationWeeks}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Уровень *</label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Выберите</option>
                      <option value="Начальный">Начальный</option>
                      <option value="Средний">Средний</option>
                      <option value="Продвинутый">Продвинутый</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL обложки</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                    Опубликован
                  </label>
                </div>
              </div>

              {/* Модули */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-900">Модули курса</h2>
                  <button
                    type="button"
                    onClick={addModule}
                    className="btn-primary inline-flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить модуль</span>
                  </button>
                </div>

                {modules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Модулей пока нет. Нажмите "Добавить модуль" чтобы создать первый.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-col space-y-1">
                              <button
                                type="button"
                                onClick={() => moveModule(index, 'up')}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <GripVertical className="w-5 h-5" />
                              </button>
                            </div>
                            <span className="text-lg font-bold text-gray-700">Модуль {index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeModule(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Название модуля *</label>
                            <input
                              type="text"
                              required
                              value={module.title}
                              onChange={(e) => updateModule(index, 'title', e.target.value)}
                              className="input-field"
                              placeholder="Введение в основы"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Описание *</label>
                            <textarea
                              required
                              value={module.description}
                              onChange={(e) => updateModule(index, 'description', e.target.value)}
                              className="input-field"
                              rows={2}
                              placeholder="Краткое описание модуля"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Содержание *</label>
                            <textarea
                              required
                              value={module.content}
                              onChange={(e) => updateModule(index, 'content', e.target.value)}
                              className="input-field"
                              rows={6}
                              placeholder="Подробное содержание модуля"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link href="/admin/courses" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Сохранение...' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

