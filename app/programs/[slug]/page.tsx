'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Award, BookOpen, Calendar, CheckCircle, Clock, Target, Users } from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  content: string
  orderIndex: number
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  fullDescription: string
  durationWeeks: number
  level: string
  price: number
  coverImage: string | null
  modules: Module[]
}

const fallbackHero = '/assets/peaceful-meadow.jpg'

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (!params.slug) return
    fetchCourse()
    if (session) {
      checkEnrollment()
    }
  }, [params.slug, session])

  const fetchCourse = async () => {
    try {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
      const response = await fetch(`/api/courses/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Error fetching course:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/user/enrollments')
      if (response.ok) {
        const data = await response.json()
        const enrolled = data.enrollments.some((entry: any) => entry.course.slug === params.slug)
        setIsEnrolled(enrolled)
      }
    } catch (err) {
      console.error('Error checking enrollment:', err)
    }
  }

  const handleEnroll = async () => {
    if (!session) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (!course) return

    setEnrolling(true)
    try {
      const response = await fetch(`/api/enrollments/${course.id}`, { method: 'POST' })
      const data = await response.json()
      if (response.ok) {
        setIsEnrolled(true)
        router.push('/my-courses')
      } else {
        alert(data.error || 'Ошибка записи на курс')
      }
    } catch (err) {
      console.error('Error enrolling:', err)
      alert('Ошибка записи на курс')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 text-slate-600 shadow-sm">Загрузка программы…</div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <BookOpen className="mx-auto mb-6 h-16 w-16 text-slate-300" />
            <h1 className="text-3xl font-heading text-slate-900">Программа не найдена</h1>
            <p className="mt-3 text-slate-600">К сожалению, запрашиваемая программа не найдена или была удалена.</p>
            <Link href="/programs" className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Вернуться к программам
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const heroImage = course.coverImage || fallbackHero

  return (
    <div className="bg-white text-slate-900">
      <section className="relative isolate overflow-hidden px-6 py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-emerald-900/70" />

        <div className="relative z-10 mx-auto max-w-5xl text-center text-white space-y-6">
          <Link href="/programs" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            К программам
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl leading-tight">{course.title}</h1>
          <p className="text-white/80">{course.description}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-wide text-white/70">
            <span className="rounded-full border border-white/30 px-4 py-2">{course.durationWeeks} недель</span>
            <span className="rounded-full border border-white/30 px-4 py-2">{course.level}</span>
            <span className="rounded-full border border-white/30 px-4 py-2">{course.modules.length} модулей</span>
          </div>
        </div>
      </section>

      <main className="page-container space-y-12 pb-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <article className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <section>
              <h2 className="text-2xl font-heading text-slate-900">О программе</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">{course.fullDescription || course.description}</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-slate-900">Что входит</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  { icon: <Target className="h-5 w-5 text-emerald-600" />, title: 'Практические модули', description: 'Каждый блок завершается заданиями и обратной связью.' },
                  { icon: <Users className="h-5 w-5 text-blue-600" />, title: 'Поддержка кураторов', description: 'Кураторы помогают выстроить план и отслеживать прогресс.' },
                  { icon: <Calendar className="h-5 w-5 text-indigo-600" />, title: 'Гибкий график', description: 'Учитесь в удобном ритме и совмещайте с личной терапией.' },
                  { icon: <Award className="h-5 w-5 text-teal-600" />, title: 'Сертификат', description: 'По итогам прохождения вы получаете подтверждение компетенций.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow">{item.icon}</div>
                    <h4 className="mt-4 font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Структура программы</h3>
                <span className="text-sm text-slate-500">{course.modules.length} модулей</span>
              </div>
              <div className="mt-4 space-y-4">
                {course.modules
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((module, index) => (
                    <div key={module.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-semibold text-emerald-700">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{module.title}</h4>
                          <p className="mt-2 text-sm text-slate-600">{module.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="lg:sticky lg:top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Стоимость</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-600">{course.level}</span>
              </div>
              <p className="mt-4 text-3xl font-heading text-slate-900">{course.price ? `${course.price.toLocaleString()} ₽` : 'Бесплатно'}</p>
              <p className="mt-2 text-sm text-slate-500">Материалы, супервизия и сопровождение на протяжении программы.</p>
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="mt-6 w-full rounded-2xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-teal/90 disabled:opacity-50"
                >
                  {enrolling ? 'Записываем...' : 'Записаться на программу'}
                </button>
              ) : (
                <Link
                  href="/my-courses"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-brand-teal/40 px-4 py-3 text-sm font-semibold text-brand-teal transition hover:bg-brand-teal/5"
                >
                  Перейти к программе
                </Link>
              )}

              <dl className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Возврат средств в течение 14 дней</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span>Поддержка кураторов 7 дней в неделю</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span>Сертификат после завершения программы</span>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-800">
              <h3 className="text-lg font-semibold">Нужна помощь с выбором?</h3>
              <p className="mt-2 text-sm text-slate-600">Оставьте заявку — мы поможем подобрать программу и расскажем о деталях участия.</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Связаться с куратором
              </Link>
            </div>
          </aside>
        </div>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Для кого', description: 'Участники и ветераны боевых действий, их семьи, специалисты по ментальному здоровью.', icon: Users },
            { title: 'Цели программы', description: 'Стабилизация состояния, развитие навыков саморегуляции и поддержка в долгосрочной перспективе.', icon: Target },
            { title: 'Формат', description: 'Онлайн-уроки, живые встречи с экспертами, практические задания и обратная связь.', icon: BookOpen },
            { title: 'График', description: 'Гибкий темп, доступ к материалам 24/7 и еженедельные контрольные точки.', icon: Calendar },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-emerald-600">
                <item.icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
