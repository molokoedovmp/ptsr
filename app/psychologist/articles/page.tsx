'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PsychologistProtectedRoute from '@/components/psychologist/PsychologistProtectedRoute'
import { FileText, Plus, Loader2, ArrowLeft } from 'lucide-react'

type ArticleSummary = {
  id: string
  title: string
  slug: string
  status: string
  published: boolean
  createdAt: string
  updatedAt: string
  moderationComment?: string | null
}

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Черновик', color: 'bg-slate-100 text-slate-700' },
  PENDING: { label: 'На модерации', color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Опубликовано', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Отклонено', color: 'bg-red-100 text-red-700' },
}

export default function PsychologistArticlesPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/psychologist/articles')
        if (!response.ok) throw new Error('Не удалось загрузить статьи')
        const json = await response.json()
        setArticles(json.articles || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (id: string) => {
    if (!confirm('Отправить статью на модерацию?')) return
    try {
      const response = await fetch(`/api/psychologist/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit' }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось отправить статью')
      setArticles((prev) =>
        prev.map((article) => (article.id === id ? { ...article, status: 'PENDING', moderationComment: null } : article)),
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка отправки')
    }
  }

  return (
    <PsychologistProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom">
          <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Специалист</p>
                <h1 className="text-3xl font-bold text-slate-900">Мои статьи</h1>
                <p className="text-slate-600">Пишите материалы и отправляйте их на модерацию редакции</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/psychologist/dashboard"
                  className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> В кабинет
                </Link>
                <Link href="/psychologist/articles/new" className="btn-primary inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Новая статья</span>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Загрузка статей...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">У вас пока нет статей. Создайте первую, чтобы поделиться экспертизой.</p>
                <Link href="/psychologist/articles/new" className="btn-primary inline-flex items-center space-x-2 mt-6">
                  <Plus className="w-5 h-5" />
                  <span>Написать статью</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => {
                  const status = statusLabels[article.status] ?? statusLabels.DRAFT
                  return (
                    <div key={article.id} className="border border-slate-200 rounded-2xl p-6 bg-white flex flex-col gap-3">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{article.title}</h3>
                          <p className="text-sm text-slate-500">/{article.slug}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                      </div>
                      <div className="text-sm text-slate-500 flex flex-wrap gap-4">
                        <span>
                          Создана: {new Date(article.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}
                        </span>
                        <span>
                          Обновлена: {new Date(article.updatedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}
                        </span>
                      </div>
                      {article.moderationComment && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          Причина отклонения: {article.moderationComment}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {[ 'DRAFT', 'REJECTED' ].includes(article.status) && (
                          <Link
                            href={`/psychologist/articles/${article.id}/edit`}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Редактировать
                          </Link>
                        )}
                        {['DRAFT', 'REJECTED'].includes(article.status) && (
                          <button
                            onClick={() => handleSubmit(article.id)}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-600 text-sm font-medium text-white disabled:opacity-70"
                          >
                            Отправить на модерацию
                          </button>
                        )}
                        {article.status === 'PENDING' && (
                          <span className="text-sm text-slate-500">Статья проверяется редакцией</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PsychologistProtectedRoute>
  )
}
