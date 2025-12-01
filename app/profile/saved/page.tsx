'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'

type Bookmark = {
  id: string
  createdAt: string
  article: {
    id: string
    title: string
    slug: string
    excerpt: string
    displayAuthor: string | null
    readingMinutes: number | null
    coverImage: string | null
    publishedAt: string | null
  }
}

export default function SavedArticlesPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/articles/bookmarks')
        const json = await response.json()
        if (!response.ok) throw new Error(json.error || 'Не удалось загрузить')
        setBookmarks(json.bookmarks || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  const formatDate = (date?: string | null) => (date ? new Date(date).toLocaleDateString('ru-RU') : '')

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6">
            <UserSidebar />
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">Сохранённые статьи</h1>
                <p className="text-slate-600 mt-2">Материалы, добавленные в закладки</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 min-h-[300px]">
                {loading ? (
                  <p className="text-slate-500">Загрузка...</p>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : bookmarks.length === 0 ? (
                  <p className="text-slate-500">Вы пока не добавили ни одной статьи.</p>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex flex-wrap gap-4 border border-slate-200 rounded-2xl p-4 items-center">
                        {bookmark.article.coverImage && (
                          <div className="w-24 h-24 rounded-xl overflow-hidden">
                            <img src={bookmark.article.coverImage} alt={bookmark.article.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-[200px]">
                          <Link href={`/articles/${bookmark.article.slug}`} className="text-lg font-semibold text-slate-900 hover:text-emerald-600">
                            {bookmark.article.title}
                          </Link>
                          <p className="text-sm text-slate-500">
                            {bookmark.article.displayAuthor || 'Редакция ПТСР Эксперт'} · {bookmark.article.readingMinutes ?? 8} мин чтения
                          </p>
                          <p className="text-xs text-slate-400">Добавлено: {formatDate(bookmark.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
