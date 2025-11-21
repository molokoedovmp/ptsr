'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CheckCircle, FileText, Loader2, XCircle } from 'lucide-react'

type PendingArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  displayAuthor: string | null
  author: {
    fullName: string | null
    email: string | null
  } | null
}

export default function ArticleModerationPage() {
  const [articles, setArticles] = useState<PendingArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles/moderation')
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось загрузить статьи')
      setArticles(json.articles || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleModeration = async (id: string, action: 'approve' | 'reject') => {
    let moderationComment = ''
    if (action === 'reject') {
      moderationComment = prompt('Укажите причину отклонения (необязательно)', '') || ''
    }
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          moderationComment: moderationComment || null,
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось выполнить действие')
      fetchArticles()
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
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-purple-600" />
                  Модерация статей
                </h1>
                <p className="text-gray-600 mt-2">Проверяйте материалы от психологов и публикуйте их в разделе «Ресурсы».</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Загрузка...
                </div>
              ) : error ? (
                <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 rounded-xl">{error}</div>
              ) : articles.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">Нет материалов, ожидающих модерации.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-2xl p-6 bg-white">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">{article.title}</h2>
                          <p className="text-sm text-gray-500">/{article.slug}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          отправлена {new Date(article.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-4">{article.excerpt}</p>
                      <div className="text-sm text-gray-500 mt-3">
                        Автор: {article.displayAuthor || article.author?.fullName || 'Не указан'} ({article.author?.email || '—'})
                      </div>
                      <div className="flex flex-wrap gap-3 mt-6">
                        <Link
                          href={`/admin/articles/moderation/${article.id}`}
                          className="inline-flex items-center px-5 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Просмотреть
                        </Link>
                        <button
                          onClick={() => handleModeration(article.id, 'approve')}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Одобрить и опубликовать
                        </button>
                        <button
                          onClick={() => handleModeration(article.id, 'reject')}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100"
                        >
                          <XCircle className="w-4 h-4" />
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
