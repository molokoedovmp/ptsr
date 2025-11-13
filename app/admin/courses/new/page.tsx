'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { BookOpen, ArrowLeft, Save } from 'lucide-react'

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          durationWeeks: parseInt(formData.durationWeeks),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания курса')
      }

      alert('Курс создан!')
      router.push('/admin/courses')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[а-яё]/gi, (char) => {
        const map: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        }
        return map[char.toLowerCase()] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <Link href="/admin/courses" className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад к курсам
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-green-600" />
              Создать курс
            </h1>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название курса *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  onBlur={generateSlug}
                  className="input-field"
                  placeholder="Основы восстановления после травмы"
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
                  placeholder="osnovy-vosstanovleniya"
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
                  placeholder="Краткое описание для карточки курса"
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
                  placeholder="Детальное описание курса"
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
                    placeholder="15000"
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
                    placeholder="8"
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
                  placeholder="https://example.com/image.jpg"
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
                  Опубликовать курс сразу
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link href="/admin/courses" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Сохранение...' : 'Создать курс'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

