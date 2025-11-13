'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import BlockNoteEditor from '@/components/editor/BlockNoteEditor'
import { FileText, ArrowLeft, Save } from 'lucide-react'

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания статьи')
      }

      alert('Статья успешно создана!')
      router.push('/admin/articles')
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
          {/* Заголовок */}
          <div className="mb-8">
            <Link
              href="/admin/articles"
              className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад к статьям
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-purple-600" />
              Создать новую статью
            </h1>
          </div>

          {/* Форма */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Заголовок */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок статьи *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  onBlur={generateSlug}
                  className="input-field"
                  placeholder="Введите заголовок статьи"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (slug) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-field"
                  placeholder="url-stati"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Генерируется автоматически, но можно изменить
                </p>
              </div>

              {/* Краткое описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Краткое описание *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Краткое описание статьи для превью"
                />
              </div>

              {/* Контент */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Содержание статьи *
                </label>
                <BlockNoteEditor
                  initialContent={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Напишите содержание статьи..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Категория */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="SYMPTOMS">Симптомы</option>
                    <option value="METHODS">Методы лечения</option>
                    <option value="SELF_HELP">Самопомощь</option>
                    <option value="STORIES">Истории</option>
                    <option value="NEWS">Новости</option>
                  </select>
                </div>

                {/* Теги */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Теги
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="input-field"
                    placeholder="тег1, тег2, тег3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Через запятую
                  </p>
                </div>
              </div>

              {/* Обложка */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL обложки
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Опубликовать */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Опубликовать статью сразу
                </label>
              </div>

              {/* Кнопки */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/articles"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Сохранение...' : 'Создать статью'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

