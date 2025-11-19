'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserSidebar from '@/components/UserSidebar'
import { BookOpen, Clock, Award, TrendingUp, ArrowRight, CheckCircle, RefreshCw, Eye, Calendar } from 'lucide-react'

interface Enrollment {
  id: string
  progress: number
  completed: boolean
  enrolledAt: string
  completedAt: string | null
  certificateUrl: string | null
  course: {
    id: string
    title: string
    slug: string
    description: string
    durationWeeks: number
    level: string
    price: number
    coverImage: string | null
    _count: {
      modules: number
    }
  }
}

export default function MyCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingCert, setGeneratingCert] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchEnrollments()
    }
  }, [status, router])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/user/enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = async (enrollmentId: string) => {
    setGeneratingCert(enrollmentId)
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Обновляем список enrollments
        setEnrollments(prev => 
          prev.map(e => 
            e.id === enrollmentId 
              ? { ...e, certificateUrl: data.certificateUrl }
              : e
          )
        )
        
        alert('Сертификат успешно сгенерирован!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Ошибка генерации сертификата')
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert('Ошибка генерации сертификата')
    } finally {
      setGeneratingCert(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal"></div>
      </div>
    )
  }

  const activeEnrollments = enrollments.filter(e => !e.completed)
  const completedEnrollments = enrollments.filter(e => e.completed)
  const totalCourses = enrollments.length
  const certificateCount = completedEnrollments.filter(e => Boolean(e.certificateUrl)).length
  const averageProgress = totalCourses
    ? Math.round(enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / totalCourses)
    : 0

  const formatDate = (iso: string | null, fallback = 'Скоро') => {
    if (!iso) return fallback
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const renderEmptyState = () => (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50 text-brand-teal mb-6">
        <BookOpen className="w-10 h-10" />
      </div>
      <h3 className="text-3xl font-semibold text-slate-900 mb-4">Начните обучение</h3>
      <p className="text-slate-600 max-w-2xl mx-auto mb-8">
        У вас пока нет активных программ. Выберите курс в каталоге, чтобы открыть доступ к видеоурокам, практикам
        и персональным рекомендациям.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 text-white font-semibold shadow-lg shadow-brand-teal/30 hover:translate-y-0.5 transition-transform"
        >
          <span>Перейти к каталогу</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/analytics"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-slate-700 font-semibold hover:border-brand-teal hover:text-brand-teal transition-colors"
        >
          Посмотреть аналитику
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
      <div className="container-custom">
        <div className="flex gap-6">
          <UserSidebar />

          <div className="flex-1 space-y-10">
            <section className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-8 flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">личный прогресс</p>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Мои курсы</h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                  Продолжайте восстановление в комфортном темпе: следите за активными программами, пересматривайте уроки
                  и сохраняйте сертификаты.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-teal px-5 py-3 text-white font-semibold shadow-brand-teal/40 shadow-lg hover:translate-y-0.5 transition-transform"
                  >
                    <span>Каталог программ</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/certificates"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 font-semibold hover:border-brand-teal hover:text-brand-teal transition-colors"
                  >
                    Мои сертификаты
                  </Link>
                </div>
              </div>
              <div className="w-full lg:w-72 rounded-2xl bg-white/90 border border-white shadow-xl p-6">
                <div className="text-sm text-slate-500">Средний прогресс</div>
                <div className="text-5xl font-bold text-slate-900 my-3">{averageProgress}%</div>
                <p className="text-sm text-slate-500 mb-6">по {totalCourses || '0'} программам</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Активные</p>
                    <p className="text-lg font-semibold text-slate-900">{activeEnrollments.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Сертификаты</p>
                    <p className="text-lg font-semibold text-slate-900">{certificateCount}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Всего программ</p>
                  <p className="text-2xl font-bold text-slate-900">{totalCourses}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">В процессе</p>
                  <p className="text-2xl font-bold text-slate-900">{activeEnrollments.length}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Завершено</p>
                  <p className="text-2xl font-bold text-slate-900">{completedEnrollments.length}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Сертификатов</p>
                  <p className="text-2xl font-bold text-slate-900">{certificateCount}</p>
                </div>
              </div>
            </section>

            {enrollments.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <section className="space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Активные программы</h2>
                      <p className="text-sm text-slate-500">
                        Продолжайте обучение и фиксируйте прогресс в реальном времени
                      </p>
                    </div>
                    {activeEnrollments.length === 0 && (
                      <Link href="/programs" className="text-sm font-semibold text-brand-teal hover:text-brand-teal/80">
                        Выбрать программу
                      </Link>
                    )}
                  </div>
                  {activeEnrollments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                      Нет активных программ. Начните новый курс, чтобы увидеть его здесь.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {activeEnrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                        >
                          <div className="relative h-48 bg-slate-100 overflow-hidden">
                            {enrollment.course.coverImage ? (
                              <img
                                src={enrollment.course.coverImage}
                                alt={enrollment.course.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-200 to-teal-200">
                                <BookOpen className="w-16 h-16 text-emerald-700" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                              {enrollment.course.level}
                            </div>
                          </div>
                          <div className="flex flex-col flex-1 p-6 space-y-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">В процессе</p>
                              <h3 className="text-xl font-semibold text-slate-900">{enrollment.course.title}</h3>
                              <p className="text-sm text-slate-600 line-clamp-2 mt-2">{enrollment.course.description}</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                                <span>Прогресс</span>
                                <span className="font-semibold text-slate-900">{enrollment.progress}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-brand-teal to-blue-500"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-brand-teal" />
                                <span>{enrollment.course.durationWeeks} недель</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span>{enrollment.course._count.modules} модулей</span>
                              </div>
                            </div>
                            <Link
                              href={`/learn/${enrollment.course.slug}`}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal text-white px-6 py-3 font-semibold hover:bg-brand-teal/90 transition-colors"
                            >
                              Продолжить обучение
                              <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Завершённые программы</h2>
                      <p className="text-sm text-slate-500">Скачайте сертификат и пересматривайте нужные уроки</p>
                    </div>
                    {completedEnrollments.length > 0 && (
                      <Link href="/certificates" className="text-sm font-semibold text-brand-teal hover:text-brand-teal/80">
                        Все сертификаты
                      </Link>
                    )}
                  </div>
                  {completedEnrollments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                      Как только курс будет завершён, здесь появится карточка с сертификатом.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {completedEnrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                                Завершён {formatDate(enrollment.completedAt)}
                              </span>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  enrollment.certificateUrl ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {enrollment.certificateUrl ? 'Сертификат готов' : 'Сертификат не получен'}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">{enrollment.course.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-2">{enrollment.course.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Старт: {formatDate(enrollment.enrolledAt, '—')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{enrollment.course.durationWeeks} недель</span>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Link
                              href={`/learn/${enrollment.course.slug}?view=completed`}
                              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-teal hover:text-brand-teal transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Пройденные уроки
                            </Link>
                            {enrollment.certificateUrl ? (
                              <a
                                href={enrollment.certificateUrl}
                                download={`certificate-${enrollment.course.slug}.pdf`}
                                className="flex items-center justify-center gap-2 rounded-xl bg-brand-teal text-white px-4 py-2 text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
                              >
                                <Award className="w-4 h-4" />
                                Скачать PDF
                              </a>
                            ) : (
                              <button
                                onClick={() => handleGenerateCertificate(enrollment.id)}
                                disabled={generatingCert === enrollment.id}
                                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
                              >
                                {generatingCert === enrollment.id ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Генерация...
                                  </>
                                ) : (
                                  <>
                                    <Award className="w-4 h-4" />
                                    Получить сертификат
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
