'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Eye, Tag } from 'lucide-react'
import BlockNoteViewer from '@/components/editor/BlockNoteViewer'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  coverImage: string | null
  viewCount: number
  createdAt: string
  author: {
    fullName: string | null
  } | null
}

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchArticle()
    }
  }, [params.slug])

  const fetchArticle = async () => {
    try {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
      const response = await fetch(`/api/articles/${slug}`)
      
      if (response.ok) {
        const data = await response.json()
        setArticle(data.article)
      } else {
        setError(true)
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'SYMPTOMS': 'Симптомы',
      'METHODS': 'Методы лечения',
      'SELF_HELP': 'Самопомощь',
      'STORIES': 'Истории',
      'NEWS': 'Новости'
    }
    return categories[category] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-teal/20"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-teal border-t-transparent absolute top-0 left-0" style={{ animationDuration: '1s' }}></div>
          </div>
          <p className="mt-4 text-slate-600 animate-pulse">Загрузка статьи...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Статья не найдена</h1>
              <p className="text-slate-600 mb-8">
                К сожалению, запрашиваемая статья не найдена или была удалена.
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center bg-gradient-to-r from-brand-teal to-brand-blue text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Вернуться к ресурсам
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
      <div className="container-custom max-w-5xl">
        {/* Навигация назад */}
        <div className="mb-8 animate-slide-in-left">
          <Link
            href="/resources"
            className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            Назад к ресурсам
          </Link>
        </div>

        <article className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
          {/* Обложка */}
          {article.coverImage && (
            <div className="w-full h-96 overflow-hidden">
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Метаданные */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                {getCategoryName(article.category)}
              </span>
              
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="flex items-center text-sm text-slate-600">
                <Eye className="w-4 h-4 mr-2" />
                {article.viewCount} просмотров
              </div>

              {article.author?.fullName && (
                <div className="flex items-center text-sm text-slate-600">
                  Автор: {article.author.fullName}
                </div>
              )}
            </div>

            {/* Заголовок */}
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Краткое описание */}
            <p className="text-xl text-slate-700 leading-relaxed mb-8 pb-8 border-b border-slate-200">
              {article.excerpt}
            </p>

            {/* Содержание */}
            <div className="article-content">
              <BlockNoteViewer content={article.content} />
            </div>

            {/* Теги */}
            {article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-5 h-5 text-slate-600" />
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Призыв к действию */}
        <div className="mt-12 bg-gradient-to-r from-brand-teal to-brand-blue text-white rounded-3xl p-8 lg:p-12 shadow-2xl animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Нужна помощь специалиста?
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              Запишитесь на консультацию с нашими квалифицированными психологами
            </p>
            <Link
              href="/specialists"
              className="inline-flex items-center bg-white text-brand-teal px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Найти специалиста
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

