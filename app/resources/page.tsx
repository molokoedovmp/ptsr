'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Video, Heart, Clock, Search } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  coverImage: string | null
  viewCount: number
}

interface VideoItem {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null
}

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [articlesRes, videosRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/videos'),
      ])

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json()
        setArticles(articlesData.articles)
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json()
        setVideos(videosData.videos)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    )
  }

  const tools = [
    {
      title: 'Оценка тревожности',
      description: 'Инструменты для самооценки уровня тревожности',
      icon: <Heart className="w-8 h-8 text-primary-600" />,
      link: '/resources/anxiety-assessment',
    },
    {
      title: 'Таймер медитации',
      description: 'Инструмент для практики медитации и релаксации',
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      link: '/resources/meditation-timer',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="section-title">Библиотека ресурсов</h1>
          <p className="section-subtitle">
            Образовательные материалы, видео и инструменты для самопомощи
          </p>
        </div>

        {/* Поиск */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по ресурсам..."
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Инструменты */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Инструменты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.link} className="card hover:shadow-xl transition-shadow group">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 rounded-lg p-4 group-hover:bg-primary-200 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Статьи */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Статьи</h2>
            {articles.length > 0 && (
              <Link href="/resources?category=articles" className="text-primary-600 hover:text-primary-700 font-medium">
                Посмотреть все →
              </Link>
            )}
          </div>
          {articles.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Статьи в разработке</h3>
              <p className="text-gray-600">Скоро здесь появятся образовательные материалы</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="card hover:shadow-xl transition-shadow group cursor-pointer">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="rounded-lg h-48 w-full object-cover mb-4" />
                  ) : (
                    <div className="bg-primary-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary-600" />
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.viewCount} просмотров
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Видео */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Видео</h2>
            {videos.length > 0 && (
              <Link href="/resources?category=videos" className="text-primary-600 hover:text-primary-700 font-medium">
                Посмотреть все →
              </Link>
            )}
          </div>
          {videos.length === 0 ? (
            <div className="card text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Видео в разработке</h3>
              <p className="text-gray-600">Скоро здесь появятся полезные видеоматериалы</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <a key={video.id} href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="card hover:shadow-xl transition-shadow group cursor-pointer">
                  {video.thumbnailUrl ? (
                    <div className="rounded-lg h-48 mb-4 relative overflow-hidden">
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-primary-100 rounded-lg h-48 mb-4 flex items-center justify-center relative">
                      <Video className="w-16 h-16 text-primary-600" />
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {video.title}
                  </h3>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Призыв к действию */}
        <div className="bg-primary-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Нужна персональная помощь?
          </h2>
          <p className="text-primary-100 mb-6 text-lg">
            Запишитесь на консультацию с нашими специалистами
          </p>
          <Link
            href="/specialists"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Найти специалиста
          </Link>
        </div>
      </div>
    </div>
  )
}

