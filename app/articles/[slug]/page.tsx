'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

const BlockNoteViewer = dynamicImport(() => import('@/components/editor/BlockNoteViewer'), {
  ssr: false,
})

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  displayAuthor: string | null
  tags: string[]
  coverImage: string | null
  viewCount: number
  createdAt: string
  publishedAt: string | null
  readingMinutes: number | null
  verifiedAt: string | null
  sourceTitle: string | null
  sourceUrl: string | null
  faq: { question: string; answer: string }[] | null
  author: {
    fullName: string | null
  } | null
  feedback: { rating: number }[]
}

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchArticle()
    }
  }, [params.slug])

  const fetchArticle = async () => {
    try {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
      const response = await fetch(`/api/articles/${slug}`)
      if (!response.ok) {
        setError(true)
        return
      }
      const data = await response.json()
      setArticle(data.article)
    } catch (err) {
      console.error('Error fetching article:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      SYMPTOMS: 'Симптомы',
      METHODS: 'Методы лечения',
      SELF_HELP: 'Самопомощь',
      STORIES: 'Истории',
      NEWS: 'Новости',
    }
    return categories[category] || category
  }

  const averageRating =
    article && article.feedback.length
      ? (article.feedback.reduce((sum, entry) => sum + entry.rating, 0) / article.feedback.length).toFixed(1)
      : null

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!article) return
    setSubmittingFeedback(true)
    setFeedbackMessage('')
    try {
      const response = await fetch(`/api/articles/${article.slug}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось отправить отзыв')
      setFeedbackMessage('Спасибо за ваш отзыв!')
      setRating(0)
      setComment('')
    } catch (err) {
      setFeedbackMessage(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-slate-600 animate-pulse">Загрузка статьи...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Статья не найдена</h1>
          <Link href="/articles" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к статьям
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
      <div className="container-custom max-w-5xl">
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад ко всем статьям
          </Link>
        </div>

        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {article.coverImage && (
            <div className="w-full h-96 overflow-hidden">
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8 lg:p-12 space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                {getCategoryName(article.category)}
              </span>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Eye className="w-4 h-4 mr-2" />
                {article.viewCount} просмотров
              </div>
              {(article.displayAuthor || article.author?.fullName) && (
                <div className="flex items-center text-sm text-slate-600">Автор: {article.displayAuthor || article.author?.fullName}</div>
              )}
              {article.readingMinutes && <div className="text-sm text-slate-500">Время чтения ~ {article.readingMinutes} мин</div>}
            </div>

            {article.verifiedAt && (
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                Статья проверена редакцией {new Date(article.verifiedAt).toLocaleDateString('ru-RU')}
              </div>
            )}

            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-tight">{article.title}</h1>

            <p className="text-xl text-slate-700 leading-relaxed border-b border-slate-200 pb-6">{article.excerpt}</p>

            <div className="article-content">
              <BlockNoteViewer content={article.content} />
            </div>

            {article.sourceTitle && (
              <div className="border-t border-slate-200 pt-4 text-sm text-slate-500">
                Источник: {article.sourceTitle}{' '}
                {article.sourceUrl && (
                  <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="underline">
                    {article.sourceUrl}
                  </a>
                )}
              </div>
            )}

            {article.tags.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-5 h-5 text-slate-600" />
                  {article.tags.map((tag, index) => (
                    <span key={index} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {article.faq && article.faq.length > 0 && (
              <div className="border-t border-slate-200 pt-6 space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">Вопросы и ответы</h3>
                {article.faq.map((item, index) => (
                  <details key={index} className="border border-slate-200 rounded-2xl p-4">
                    <summary className="cursor-pointer font-semibold text-slate-900">{item.question}</summary>
                    <p className="text-slate-600 mt-2">{item.answer}</p>
                  </details>
                ))}
              </div>
            )}

            <div className="border border-slate-200 rounded-3xl bg-slate-50 p-6 space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Отметьте полезность статьи</p>
                {averageRating && <p className="text-xs text-slate-500">Средняя оценка: {averageRating} / 5</p>}
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                        rating >= value ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-slate-300 text-slate-400'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Поделитесь комментарием или вопросом (необязательно)"
                  rows={4}
                  className="w-full input-field"
                />
                {feedbackMessage && <p className="text-sm text-emerald-600">{feedbackMessage}</p>}
                <button type="submit" disabled={rating === 0 || submittingFeedback} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {submittingFeedback ? 'Отправка...' : 'Отправить отзыв'}
                </button>
              </form>
            </div>

            <p className="text-xs text-slate-500 border-t border-slate-200 pt-4">
              Информация на этой странице не предназначена для замены диагностики, лечения или квалифицированной профессиональной консультации. Не предпринимайте действий без консультации со специалистом в области психического здоровья. Подробнее — в условиях использования.
            </p>
          </div>
        </article>

        <div className="mt-12 bg-gradient-to-r from-brand-teal to-brand-blue text-white rounded-3xl p-8 lg:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-heading font-bold">Нужна помощь специалиста?</h2>
            <p className="text-white/90">Запишитесь на консультацию с нашими квалифицированными психологами</p>
            <Link href="/specialists" className="inline-flex items-center bg-white text-brand-teal px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition">
              Найти специалиста
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
