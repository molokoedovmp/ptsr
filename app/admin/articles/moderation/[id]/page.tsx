'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import BlockNoteViewer from '@/components/editor/BlockNoteViewer'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

interface ArticleDetail {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  displayAuthor: string | null
  coverImage: string | null
  tags: string[]
  createdAt: string
  status: string
  author: {
    fullName: string | null
    email: string | null
  } | null
}

const categoryLabels: Record<string, string> = {
  SYMPTOMS: 'Симптомы',
  METHODS: 'Методы лечения',
  SELF_HELP: 'Самопомощь',
  STORIES: 'Истории',
  NEWS: 'Новости',
}

export default function ModerationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/admin/articles/${params.id}`)
        const json = await response.json()
        if (!response.ok) throw new Error(json.error || 'Не удалось загрузить статью')
        setArticle(json.article)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleModeration = async (action: 'approve' | 'reject') => {
    let moderationComment = ''
    if (action === 'reject') {
      moderationComment = prompt('Укажите причину отклонения (необязательно)', '') || ''
    }
    try {
      const response = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          moderationComment: moderationComment || null,
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось выполнить действие')
      alert(action === 'approve' ? 'Статья опубликована' : 'Статья отклонена')
      router.push('/admin/articles/moderation')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка модерации')
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom">
          <div className="flex gap-6">
            <AdminSidebar />
            <div className="flex-1 bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-8">
                <Link href="/admin/articles/moderation" className="text-brand-teal hover:text-brand-teal/80 font-medium inline-flex items-center mb-4">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Назад к модерации
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Просмотр статьи</h1>
                <p className="text-gray-600 mt-2">Ознакомьтесь с материалом перед принятием решения</p>
              </div>

              {loading ? (
                <p className="text-gray-500">Загрузка...</p>
              ) : error ? (
                <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 rounded-xl">{error}</div>
              ) : !article ? (
                <p>Статья не найдена</p>
              ) : (
                <div className="space-y-8">
                  {article.coverImage && (
                    <div className="w-full h-80 rounded-2xl overflow-hidden">
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                      {categoryLabels[article.category] || article.category}
                    </span>
                    <span>Автор: {article.displayAuthor || article.author?.fullName || 'Не указан'}</span>
                    {article.author?.email && <span>Email: {article.author.email}</span>}
                    <span>Отправлена: {new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h2>
                    <p className="text-lg text-gray-700 mb-8">{article.excerpt}</p>
                    <BlockNoteViewer content={article.content} />
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleModeration('approve')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Одобрить и опубликовать
                    </button>
                    <button
                      onClick={() => handleModeration('reject')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-50 text-red-600 font-semibold"
                    >
                      <XCircle className="w-5 h-5" />
                      Отклонить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

