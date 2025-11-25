'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookOpen, Clock, Search, Video, Brain, Heart, Activity, PenSquare } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  SYMPTOMS: 'Симптомы',
  METHODS: 'Методы лечения',
  SELF_HELP: 'Самопомощь',
  STORIES: 'Истории',
  NEWS: 'Новости',
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  displayAuthor: string | null
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

  const tools = [
    {
      title: 'Оценка уровня тревоги',
      description: 'GAD-7, BAI, HARS и STAI с автоматическим подсчётом и сохранением в профиле.',
      icon: <Brain className="w-6 h-6 text-emerald-600" />,
      href: '/anxiety-tests',
      badge: 'GAD-7 / BAI / HARS / STAI',
    },
    {
      title: 'Дневник настроения',
      description: 'Фиксируйте эмоциональное состояние и отслеживайте динамику в личном кабинете.',
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      href: '/mood-diary',
      badge: 'Ежедневная рефлексия',
    },
    {
      title: 'Дневник активности',
      description: 'Записывайте действия и триггеры, чтобы видеть взаимосвязь событий и самочувствия.',
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      href: '/diary',
      badge: 'Аналитика поведения',
    },
    {
      title: 'План действий с психологом',
      description: 'Подбор специалистов, курсов и практик на основе ваших запросов.',
      icon: <PenSquare className="w-6 h-6 text-purple-500" />,
      href: '/specialists',
      badge: 'Координация и сопровождение',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, videosRes] = await Promise.all([fetch('/api/articles'), fetch('/api/videos')])
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json()
          setArticles(articlesData.articles ?? [])
        }
        if (videosRes.ok) {
          const videosData = await videosRes.json()
          setVideos(videosData.videos ?? [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 text-slate-600 shadow-sm">Загрузка ресурсов…</div>
      </div>
    )
  }

  return (
    <div className="bg-white text-slate-900">
      <section className="relative isolate overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Ресурсы</p>
          <h1 className="font-heading text-4xl text-slate-900">Библиотека для самостоятельной поддержки</h1>
          <p className="text-slate-600">Подборки статей, видео и практических материалов, подготовленные экспертами ПТСР Эксперт.</p>
          <label className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            <Search className="h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Поиск по материалам" className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400" />
          </label>
        </div>
      </section>

      <main className="page-container space-y-16 pb-16">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Инструменты</p>
          <h2 className="text-3xl font-heading text-slate-900">Что вы получаете на платформе</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-slate-100 p-3">{tool.icon}</div>
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{tool.badge}</span>
                    <h3 className="text-xl font-semibold text-slate-900">{tool.title}</h3>
                    <p className="text-sm text-slate-600">{tool.description}</p>
                    <span className="text-sm font-semibold text-brand-teal">Открыть →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Статьи</p>
              <h2 className="text-3xl font-heading text-slate-900">Аналитика и практические обзоры</h2>
            </div>
            {articles.length > 0 && (
              <Link href="/articles" className="text-sm font-semibold text-brand-teal hover:text-brand-teal/80">
                Все статьи →
              </Link>
            )}
          </div>

          {articles.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">Материалы готовятся к публикации.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                    {article.coverImage ? (
                      <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-slate-400" />
                      </div>
                    )}
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
                      {CATEGORY_LABELS[article.category] || article.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>
                  {article.displayAuthor && <p className="mt-2 text-xs text-slate-500">Автор: {article.displayAuthor}</p>}
                  <span className="mt-3 inline-flex items-center text-xs text-slate-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {article.viewCount} просмотров
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Видео</p>
              <h2 className="text-3xl font-heading text-slate-900">Лекции и упражнения</h2>
            </div>
            {videos.length > 0 && (
              <Link href="/resources?category=videos" className="text-sm font-semibold text-brand-teal hover:text-brand-teal/80">
                Все видео →
              </Link>
            )}
          </div>

          {videos.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">Видео появятся в ближайшее время.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {videos.map((video) => (
                <a key={video.id} href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                    {video.thumbnailUrl ? (
                      <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Video className="h-10 w-10 text-slate-400" />
                      </div>
                    )}
                    {video.duration && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">{formatDuration(video.duration)}</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{video.title}</h3>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-3xl font-heading text-slate-900">Нужна персональная помощь?</h2>
          <p className="mt-4 text-slate-600">Оставьте заявку на консультацию — мы поможем подобрать программу и расскажем, с чего начать.</p>
          <Link href="/specialists" className="mt-6 inline-flex items-center justify-center rounded-2xl border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white">
            Найти специалиста
          </Link>
        </section>
      </main>
    </div>
  )
}
