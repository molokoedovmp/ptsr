'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { Video, ArrowLeft, Save } from 'lucide-react'

export default function NewVideoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    category: '',
    tags: '',
    published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания видео')
      }

      alert('Видео добавлено!')
      router.push('/admin/videos')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <Link href="/admin/videos" className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад к видео
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Video className="w-8 h-8 mr-3 text-yellow-600" />
              Добавить видео
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Название видео *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Дыхательные упражнения для снятия тревоги"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows={4}
                  placeholder="Описание видео"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL видео *</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="input-field"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo или прямая ссылка</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL превью</label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    className="input-field"
                    placeholder="https://example.com/thumb.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Длительность (сек)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="input-field"
                    placeholder="600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Выберите</option>
                    <option value="BREATHING">Дыхательные техники</option>
                    <option value="MEDITATION">Медитация</option>
                    <option value="EXERCISES">Упражнения</option>
                    <option value="EDUCATION">Обучающие</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Теги</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="input-field"
                    placeholder="тревога, дыхание, релаксация"
                  />
                </div>
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
                  Опубликовать видео сразу
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link href="/admin/videos" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Сохранение...' : 'Добавить видео'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

