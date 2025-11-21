'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PsychologistProtectedRoute from '@/components/psychologist/PsychologistProtectedRoute'
import BlockNoteEditor from '@/components/editor/BlockNoteEditor'
import { ArrowLeft, FileText, Save } from 'lucide-react'

const categoryOptions = [
  { value: 'SYMPTOMS', label: 'Симптомы' },
  { value: 'METHODS', label: 'Методы лечения' },
  { value: 'SELF_HELP', label: 'Самопомощь' },
  { value: 'STORIES', label: 'Истории' },
  { value: 'NEWS', label: 'Новости' },
]

export default function PsychologistEditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    displayAuthor: '',
  })

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/psychologist/articles/${params.id}`)
        const json = await response.json()
        if (!response.ok) throw new Error(json.error || 'Не удалось загрузить статью')
        setFormData({
          title: json.article.title,
          slug: json.article.slug,
          excerpt: json.article.excerpt,
          content: json.article.content,
          category: json.article.category,
          tags: json.article.tags.join(', '),
          coverImage: json.article.coverImage || '',
          displayAuthor: json.article.displayAuthor || '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/psychologist/articles/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Ошибка сохранения')
      alert('Изменения сохранены. Не забудьте отправить на модерацию.')
      router.push('/psychologist/articles')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PsychologistProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <Link href="/psychologist/articles" className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад к статьям
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-emerald-600" />
              Редактирование статьи
            </h1>
            <p className="text-slate-600 mt-2">Доступно для черновиков и отклонённых материалов</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {loading ? (
              <p className="text-slate-500">Загрузка...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Заголовок *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL (slug) *</label>
                  <input type="text" required value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Краткое описание *</label>
                  <textarea required value={formData.excerpt} onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))} rows={3} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">Содержание статьи *</label>
                  <BlockNoteEditor initialContent={formData.content} onChange={(content) => setFormData((prev) => ({ ...prev, content }))} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Категория *</label>
                    <select required value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} className="input-field">
                      <option value="">Выберите категорию</option>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Автор (для отображения)</label>
                    <input type="text" value={formData.displayAuthor} onChange={(e) => setFormData((prev) => ({ ...prev, displayAuthor: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Теги</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">URL обложки</label>
                    <input type="url" value={formData.coverImage} onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))} className="input-field" />
                  </div>
                </div>

                <button type="submit" disabled={saving} className="btn-primary inline-flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Сохранение...' : 'Сохранить изменения'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PsychologistProtectedRoute>
  )
}

