'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ArrowUpDown, BookmarkPlus, Loader2 } from 'lucide-react'

interface ArticleListItem {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  displayAuthor: string | null
  tags: string[]
  coverImage: string | null
  viewCount: number
  createdAt: string
  verifiedAt: string | null
  publishedAt: string | null
  readingMinutes: number | null
}

const categoryOptions = [
  { value: '', label: 'Все категории' },
  { value: 'SYMPTOMS', label: 'Симптомы' },
  { value: 'METHODS', label: 'Методы лечения' },
  { value: 'SELF_HELP', label: 'Самопомощь' },
  { value: 'STORIES', label: 'Истории' },
  { value: 'NEWS', label: 'Новости' },
]

const sortOptions = [
  { value: 'date', label: 'По дате (сначала новые)' },
  { value: 'popular', label: 'По популярности' },
]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [authorQuery, setAuthorQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('date')
  const [email, setEmail] = useState('')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')
  const [bookmarkMessage, setBookmarkMessage] = useState('')
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null)

  const params = useMemo(() => {
    const searchParams = new URLSearchParams()
    if (query) searchParams.set('q', query)
    if (authorQuery) searchParams.set('author', authorQuery)
    if (category) searchParams.set('category', category)
    if (sort) searchParams.set('sort', sort)
    return searchParams.toString()
  }, [query, authorQuery, category, sort])

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`/api/articles/list?${params}`)
        const json = await response.json()
        if (!response.ok) throw new Error(json.error || 'Не удалось загрузить статьи')
        setArticles(json.articles || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [params])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscriptionMessage('')
    if (!email) return
    try {
      const response = await fetch('/api/articles/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось оформить подписку')
      setSubscriptionMessage('Спасибо! Мы будем присылать новые статьи на почту.')
      setEmail('')
    } catch (err) {
      setSubscriptionMessage(err instanceof Error ? err.message : 'Ошибка подписки')
    }
  }

  const addToDiary = async (article: ArticleListItem) => {
    setBookmarkMessage('')
    setBookmarkingId(article.id)
    try {
      const response = await fetch('/api/articles/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось сохранить')
      setBookmarkMessage(`Статья «${article.title}» сохранена в вашем профиле.`)
    } catch (err) {
      setBookmarkMessage(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setBookmarkingId(null)
    }
  }

  const formatDate = (date?: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden text-white" style={{ backgroundImage: 'linear-gradient(120deg, rgba(5,5,5,0.85), rgba(5,5,5,0.65)), url(/assets/peaceful-meadow.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container-custom py-16 space-y-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">библиотека статей</p>
          <h1 className="text-4xl md:text-5xl font-bold">Все материалы ПТСР Эксперт</h1>
          <p className="text-lg text-emerald-50/90 max-w-3xl">Читайте статьи психологов, истории восстановления и практические рекомендации. Настройте фильтры и найдите нужный материал.</p>
          <form onSubmit={handleSubscribe} className="bg-white/10 backdrop-blur rounded-3xl border border-white/30 p-6 flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">подписаться на новые статьи</p>
              <p className="text-emerald-50/90 text-sm">Получайте подборку материалов раз в неделю на вашу почту</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Укажите свою электронную почту"
                className="flex-1 rounded-full px-4 py-2 text-slate-900 bg-white"
                required
              />
              <button type="submit" className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white">
                Подписаться
              </button>
            </div>
          </form>
          {subscriptionMessage && <p className="text-sm text-emerald-100">{subscriptionMessage}</p>}
        </div>
        <div className="absolute inset-0 bg-black/25" />
      </section>

      <section className="container-custom py-12 space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию" className="w-full outline-none" />
            </label>
            <label className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" value={authorQuery} onChange={(e) => setAuthorQuery(e.target.value)} placeholder="Поиск по автору" className="w-full outline-none" />
            </label>
            <label className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent outline-none">
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full bg-transparent outline-none">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {bookmarkMessage && <p className="text-sm text-emerald-600">{bookmarkMessage}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Загрузка статей...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl text-slate-500">Подходящих статей пока нет.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <article key={article.id} className="border border-slate-200 rounded-3xl bg-white p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                      {categoryOptions.find((option) => option.value === article.category)?.label || article.category}
                    </p>
                    <Link href={`/articles/${article.slug}`} className="text-2xl font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                      {article.title}
                    </Link>
                    <p className="text-sm text-slate-500 mt-1">
                      {article.displayAuthor ? `Автор: ${article.displayAuthor}` : 'Автор: редакция ПТСР Эксперт'}
                    </p>
                    <p className="text-sm text-slate-500">
                      Опубликовано: {formatDate(article.publishedAt || article.createdAt)} · Время чтения: {article.readingMinutes ?? 8} мин
                    </p>
                    <p className="text-slate-600 mt-4">{article.excerpt}</p>
                  </div>
                    {article.coverImage && (
                      <div className="w-full lg:w-48 h-48 rounded-2xl overflow-hidden">
                        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    Просмотров: {article.viewCount}
                  </span>
                  {article.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-auto">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Читать полностью
                  </Link>
                  <button
                    onClick={() => addToDiary(article)}
                    disabled={bookmarkingId === article.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Добавить в дневник
                  </button>
                  {article.verifiedAt && <p className="text-xs text-slate-500">Проверено редакцией {formatDate(article.verifiedAt)}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
