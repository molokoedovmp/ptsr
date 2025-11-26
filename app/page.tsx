'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

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

interface ProgramPreview {
  title: string
  description: string
  meta: string
  href: string
  coverImage: string
}

const services = [
  {
    title: 'Онлайн консультации',
    description: 'Индивидуальные консультации с профессиональными психологами и психотерапевтами в удобном онлайн-формате.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    title: 'Образовательные материалы',
    description: 'Доступ к статьям, видео и другим образовательным ресурсам по вопросам психического здоровья.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Группы поддержки',
    description: 'Возможность участвовать в онлайн группах поддержки по различным темам психического здоровья.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-5m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20h2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

const steps = [
  { title: 'Регистрация', description: 'Создайте аккаунт на нашей платформе за несколько минут' },
  { title: 'Заполнение профиля', description: 'Расскажите нам немного о себе и ваших потребностях' },
  { title: 'Выбор специалиста', description: 'Найдите подходящего психолога из нашей базы экспертов' },
  { title: 'Начало работы', description: 'Планируйте сессии и получайте помощь онлайн' },
]

const previewFallbacks = ['/assets/peaceful-meadow.jpg', '/assets/forest-path.jpg']
const buttonPrimary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-brand-teal px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5'
const buttonSecondaryDark =
  'inline-flex items-center justify-center rounded-full border border-white/50 px-8 py-3 text-sm font-semibold text-white transition hover:border-white'
const buttonSecondaryLight =
  'inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-teal'

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCookieBanner, setShowCookieBanner] = useState(false)

  useEffect(() => {
    const consent = typeof window !== 'undefined' ? localStorage.getItem('ptsd-cookie-consent') : null
    setShowCookieBanner(!consent)
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data.courses ?? [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const programs = useMemo<ProgramPreview[]>(
    () =>
      courses.slice(0, 2).map((course, index) => ({
        title: course.title,
        description: course.description,
        meta: formatProgramMeta(course),
        href: `/programs/${course.slug}`,
        coverImage: course.coverImage || previewFallbacks[index % previewFallbacks.length],
      })),
    [courses],
  )

  const handleCookieAction = (decision: 'accepted' | 'declined') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ptsd-cookie-consent', decision)
    }
    setShowCookieBanner(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-10 duration-500">
          <div className="max-w-3xl mx-auto rounded-2xl bg-white/95 text-slate-900 shadow-xl border border-slate-200 backdrop-blur">
            <div className="p-5 md:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-700 flex-1 text-center md:text-left">
                Мы используем файлы cookie, чтобы сайт работал корректно. Нажимая «Принять», вы соглашаетесь с их использованием. Подробнее в{' '}
                <Link href="/privacy-policy" className="underline hover:text-brand-teal font-medium">
                  Политике конфиденциальности
                </Link>
                .
              </p>
              <div className="flex items-center gap-2 justify-center md:justify-end">
                <button
                  onClick={() => handleCookieAction('declined')}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Отклонить
                </button>
                <button
                  onClick={() => handleCookieAction('accepted')}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow"
                >
                  Принять
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <section
          className="relative py-20 bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
          style={{ backgroundImage: "url('/lovable-uploads/hero-forest.png')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="page-container relative z-10">
            <div className="max-w-3xl animate-fade-in mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading text-white mb-6 lg:text-6xl font-bold">
                Поддержка, когда она действительно нужна
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Получите доступ к профессиональной поддержке и ресурсам для заботы о вашем психическом благополучии, не
                выходя из дома
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/specialists" className={buttonPrimary}>
                  Найти специалиста
                </Link>
                <Link href="/anxiety-tests" className={buttonSecondaryDark}>
                  Оценка уровня тревоги
                </Link>
                <Link href="/resources" className={buttonSecondaryDark}>
                  Инструменты
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-brand-light">
          <div className="page-container">
            <h2 className="section-title text-center">Ключевые программы поддержки</h2>
            <p className="section-subtitle text-center mx-auto">
              Наши флагманские курсы, разработанные для оказания целенаправленной помощи.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {loading &&
                [1, 2].map((item) => (
                  <div key={item} className="rounded-lg border bg-card text-card-foreground shadow-sm h-80 animate-pulse" />
                ))}

              {!loading && programs.length === 0 && (
                <div className="rounded-lg border border-dashed text-center p-10 text-slate-500">
                  В данный момент нет опубликованных программ. Загляните позднее — команда готовит новые направления.
                </div>
              )}

              {programs.map((program) => (
                <div key={program.title} className="rounded-lg border bg-card text-card-foreground shadow-sm card-hover flex flex-col overflow-hidden">
                  <div className="relative h-44 w-full">
                    <Image
                      src={program.coverImage}
                      alt={program.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-slate-900/50 px-3 py-1 rounded-full">
                      {program.meta}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5 text-center md:text-left px-6 pt-6">
                    <h3 className="font-semibold tracking-tight text-xl">{program.title}</h3>
                  </div>
                  <p className="text-muted-foreground mt-4 flex-1 text-center md:text-left px-6">{program.description}</p>
                  <div className="pt-6 px-6 pb-6">
                    <Link href={program.href} className={buttonPrimary + ' w-full justify-center'}>
                      Узнать больше
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="page-container">
            <h2 className="section-title text-center">Наши услуги</h2>
            <p className="section-subtitle text-center mx-auto">
              ПТСР Эксперт предлагает широкий спектр услуг для поддержки вашего психического здоровья
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-8 text-center space-y-3"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-brand-light">
          <div className="page-container">
            <h2 className="section-title text-center">Как это работает</h2>
            <p className="section-subtitle text-center mx-auto">Получить помощь еще никогда не было так просто</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-brand-teal text-white flex items-center justify-center text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/register" className={buttonPrimary}>
                Начать сейчас
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="page-container text-center space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Начните сегодня</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
              Готовы сделать первый шаг к улучшению вашего психического здоровья?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Присоединяйтесь к сообществу, где эксперты и программы помогают восстанавливаться в комфортном темпе.
            </p>
            <Link href="/specialists" className={buttonPrimary}>
              Найти специалиста
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

function formatProgramMeta(course: Course) {
  const duration = course.durationWeeks ? `${course.durationWeeks} недель` : ''
  const level = course.level ?? ''

  if (duration && level) return `${duration} • ${level}`
  return duration || level || 'Программа'
}
