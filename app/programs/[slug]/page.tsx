'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Clock, Award, CheckCircle, ArrowLeft, Users, Target, Calendar } from 'lucide-react'

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
    if (params.slug) {
      fetchCourse()
      if (session) {
        checkEnrollment()
      }
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
    } catch (error) {
      console.error('Error fetching course:', error)
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
        const enrolled = data.enrollments.some((e: any) => e.course.slug === params.slug)
        setIsEnrolled(enrolled)
      }
    } catch (error) {
      console.error('Error checking enrollment:', error)
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
      const response = await fetch(`/api/enrollments/${course.id}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        alert('Вы успешно записались на курс!')
        setIsEnrolled(true)
        router.push('/my-courses')
      } else {
        alert(data.error || 'Ошибка записи на курс')
      }
    } catch (error) {
      console.error('Error enrolling:', error)
      alert('Ошибка записи на курс')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-teal/20"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-teal border-t-transparent absolute top-0 left-0" style={{ animationDuration: '1s' }}></div>
          </div>
          <p className="mt-4 text-slate-600 animate-pulse">Загрузка программы...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6 animate-float" />
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Программа не найдена</h1>
              <p className="text-slate-600 mb-8">
                К сожалению, запрашиваемая программа не найдена или была удалена.
              </p>
              <Link
                href="/programs"
                className="inline-flex items-center bg-gradient-to-r from-brand-teal to-brand-blue text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Вернуться к программам
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
      <div className="container-custom">
        {/* Навигация назад */}
        <div className="mb-8 animate-slide-in-left">
          <Link
            href="/programs"
            className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            Назад к программам
          </Link>
        </div>

        {/* Заголовок и основная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Левая колонка - основная информация */}
          <div className="lg:col-span-2 space-y-8">
            {/* Заголовок */}
            <div className="animate-fade-in">
              {course.coverImage && (
                <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 h-96 bg-gray-100">
                  <Image 
                    src={course.coverImage} 
                    alt={course.title} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    priority
                  />
                </div>
              )}
              
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-6">
                {course.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="px-5 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {course.durationWeeks} недель
                </div>
                <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {course.level}
                </div>
                <div className="px-5 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {course.modules.length} модулей
                </div>
              </div>

              <p className="text-xl text-slate-700 leading-relaxed mb-8">
                {course.description}
              </p>
            </div>

            {/* Подробное описание */}
            {course.fullDescription && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100/50 animate-slide-in-up">
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6 flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-brand-teal" />
                  О программе
                </h2>
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {course.fullDescription}
                </div>
              </div>
            )}

            {/* Модули курса */}
            {course.modules.length > 0 && (
              <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-white rounded-3xl p-8 shadow-xl border border-slate-100/50 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8 flex items-center">
                  <Calendar className="w-8 h-8 mr-3 text-brand-teal" />
                  Модули программы
                </h2>
                <div className="space-y-4">
                  {course.modules.sort((a, b) => a.orderIndex - b.orderIndex).map((module, index) => (
                    <div
                      key={module.id}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-slate-100/50 group"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-brand-teal transition-colors duration-300">
                            {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                              {module.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - карточка записи */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100/50 transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-white opacity-50"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-2">Стоимость программы</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                      {course.price === 0 ? 'Бесплатно' : `${course.price.toLocaleString()}₽`}
                    </p>
                  </div>

                  {isEnrolled ? (
                    <Link
                      href="/my-courses"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Вы записаны на курс
                    </Link>
                  ) : course.price === 0 ? (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-brand-teal to-brand-blue text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Award className="w-5 h-5" />
                      {enrolling ? 'Записываемся...' : 'Записаться бесплатно'}
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('Платные курсы скоро будут доступны')}
                      className="w-full bg-gradient-to-r from-brand-teal to-brand-blue text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6 flex items-center justify-center gap-2"
                    >
                      <Award className="w-5 h-5" />
                      Записаться на курс
                    </button>
                  )}

                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-slate-900 text-lg mb-4">Что включено:</h3>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Доступ ко всем материалам курса</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Практические упражнения</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Поддержка специалистов</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Сертификат о прохождении</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Пожизненный доступ</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Уже записалось 127 человек</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span>Рейтинг: 4.9/5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

