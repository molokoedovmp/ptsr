'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Clock, Search } from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  durationWeeks: number | null
  level: string | null
  coverImage?: string | null
  _count: { modules: number }
}

const highlights = [
  'Методические материалы и рабочие тетради',
  'Встречи с наставниками и сообществом',
  'Отслеживание динамики состояния и отчеты',
  'Доступ к дополнительным практикам и эфиром',
]

const fallbackImages = ['/assets/peaceful-meadow.jpg', '/assets/forest-path.jpg']

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          setPrograms(data.courses ?? [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  const availableLevels = useMemo(() => {
    const levels = new Set(programs.map((course) => course.level).filter(Boolean) as string[])
    return Array.from(levels)
  }, [programs])

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.title.toLowerCase().includes(search.toLowerCase()) ||
        program.description.toLowerCase().includes(search.toLowerCase())

      const matchesLevel = levelFilter === 'all' || (program.level ?? '').toLowerCase() === levelFilter.toLowerCase()

      const matchesDuration =
        durationFilter === 'all' ||
        (durationFilter === 'short' && (program.durationWeeks ?? 0) <= 4) ||
        (durationFilter === 'medium' && (program.durationWeeks ?? 0) > 4 && (program.durationWeeks ?? 0) <= 8) ||
        (durationFilter === 'long' && (program.durationWeeks ?? 0) > 8)

      return matchesSearch && matchesLevel && matchesDuration
    })
  }, [programs, search, levelFilter, durationFilter])

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <section className="relative isolate overflow-hidden px-6 py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/lovable-uploads/hero-forest.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-900/70" />

        <div className="relative z-10 mx-auto max-w-6xl text-center text-white space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">ПТСР Эксперт</p>
          <h1 className="font-heading text-4xl md:text-5xl leading-tight">Программы восстановления и поддержки</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Структурированные курсы, которые дополняют индивидуальную терапию. Аналитика состояния, практические задания и поддержка кураторов в одном кабинете.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              Подать заявку
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Консультация с куратором
            </Link>
          </div>
        </div>
      </section>

      <main className="space-y-16 pb-24">
        <section className="bg-brand-light py-16">
          <div className="page-container space-y-10">
            <div className="text-center space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Программы</p>
              <h2 className="text-3xl font-heading">Выберите маршрут</h2>
              <p className="text-slate-600">Каждая программа включает тематические модули, практики и поддержку экспертов PTSD Expert.</p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm lg:grid-cols-[1fr_auto_auto]">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск программы"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>
              <select
                value={levelFilter}
                onChange={(event) => setLevelFilter(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                <option value="all">Все уровни</option>
                {availableLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <select
                value={durationFilter}
                onChange={(event) => setDurationFilter(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                <option value="all">Любая длительность</option>
                <option value="short">До 4 недель</option>
                <option value="medium">5–8 недель</option>
                <option value="long">Более 8 недель</option>
              </select>
            </div>

            {loading && (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-white h-72 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && filteredPrograms.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                Пока нет опубликованных программ. Подпишитесь на обновления или свяжитесь с куратором, чтобы узнать о запуске новых направлений.
              </div>
            )}

            {!loading && filteredPrograms.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPrograms.map((program, index) => (
                  <article key={program.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-40 w-full bg-slate-100">
                      {program.coverImage ? (
                        <Image
                          src={program.coverImage}
                          alt={program.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <Image
                          src={fallbackImages[index % fallbackImages.length]}
                          alt={program.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                        {program.level || 'Авторская программа'}
                      </span>
                    </div>

                    <div className="px-6 pb-6 pt-4">
                      <p className="text-sm uppercase tracking-wide text-slate-400">{program._count?.modules ?? 0} модулей</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">{program.title}</h3>
                      <p className="mt-3 text-slate-600">{program.description}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-4 border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                          <Clock className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Длительность</p>
                          <p className="font-medium text-slate-900">{program.durationWeeks ? `${program.durationWeeks} недель` : 'Свободный темп'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Формат</p>
                          <p className="font-medium text-slate-900">Онлайн</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-teal/90"
                      >
                        Подробнее о программе
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        
      </main>
    </div>
  )
}
