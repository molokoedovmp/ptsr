'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import { BookOpen, ArrowLeft, Save } from 'lucide-react'

export const dynamic = 'force-dynamic'

const BlockNoteEditor = dynamic(() => import('@/components/editor/BlockNoteEditor'), {
  ssr: false,
})

function NewLessonForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = params.id as string
  const moduleId = searchParams.get('moduleId')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: '',
    isFree: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          moduleId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания урока')
      }

      alert('Урок создан!')
      router.push(`/admin/courses/${courseId}/lessons`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!moduleId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom max-w-4xl">
          <div className="card text-center py-12">
            <p className="text-red-600">Модуль не выбран</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <Link href={`/admin/courses/${courseId}/lessons`} className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад к урокам
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-green-600" />
            Создать урок
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Название урока *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Введение в тему"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Краткое описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                rows={2}
                placeholder="Краткое описание урока"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Содержание урока *</label>
              <BlockNoteEditor
                initialContent={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Введите содержание урока..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL видео (YouTube, Vimeo)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="input-field"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Длительность (минут)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="input-field"
                  placeholder="15"
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFree"
                checked={formData.isFree}
                onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked }))}
                className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                Бесплатный урок (доступен для предпросмотра)
              </label>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link href={`/admin/courses/${courseId}/lessons`} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Отмена
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Сохранение...' : 'Создать урок'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewLessonPage() {
  return (
    <AdminProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
        </div>
      }>
        <NewLessonForm />
      </Suspense>
    </AdminProtectedRoute>
  )
}
