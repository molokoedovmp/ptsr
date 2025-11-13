'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { ArrowUpRight, BookOpen, Heart, MessageCircle, PlayCircle, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Course {
  id: string
  title: string
  slug: string
  description: string
  durationWeeks: number
  level: string
  _count: { modules: number }
}

const services = [
  {
    title: "Онлайн консультации",
    description: "Индивидуальные консультации с профессиональными психологами и психотерапевтами в удобном онлайн-формате.",
    icon: MessageCircle,
  },
  {
    title: "Образовательные материалы",
    description: "Доступ к статьям, видео и другим образовательным ресурсам по вопросам психического здоровья.",
    icon: BookOpen,
  },
  {
    title: "Группы поддержки",
    description: "Возможность участвовать в онлайн группах поддержки по различным темам психического здоровья.",
    icon: PlayCircle,
  },
]

const steps = [
  {
    title: "Регистрация",
    description: "Создайте аккаунт на нашей платформе за несколько минут",
  },
  {
    title: "Заполнение профиля",
    description: "Расскажите нам немного о себе и ваших потребностях",
  },
  {
    title: "Выбор специалиста",
    description: "Найдите подходящего психолога из нашей базы экспертов",
  },
  {
    title: "Начало работы",
    description: "Планируйте сессии и получайте помощь онлайн",
  },
]

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses.slice(0, 2))
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Hero секция */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-teal/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto w-full grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="font-heading text-4xl lg:text-5xl text-slate-900 leading-tight animate-slide-in-left">
              Поддержка, когда она действительно нужна
            </h1>
            <p className="text-lg text-slate-600 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              Получите доступ к профессиональной поддержке и ресурсам для заботы о вашем психическом благополучии, не выходя из дома
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <Link href="/specialists">Найти специалиста</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <Link href="/mood-diary">Оценка уровня тревоги</Link>
              </Button>
            </div>
            <div className="flex gap-4 pt-4 animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
              <Button asChild variant="outline" className="transform hover:scale-105 transition-all duration-300">
                <Link href="/resources">Инструменты</Link>
              </Button>
              <Button asChild variant="outline" className="transform hover:scale-105 transition-all duration-300">
                <Link href="/diary">Дневник</Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 bg-brand-teal/10 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="relative rounded-3xl shadow-2xl bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 h-96 flex items-center justify-center transform hover:scale-105 transition-all duration-500 hover:shadow-3xl group">
              <Heart className="w-32 h-32 text-brand-teal animate-float group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Ключевые программы */}
      <section className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl lg:text-5xl text-slate-900 mb-4 font-bold">
            Ключевые программы поддержки
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Наши флагманские курсы, разработанные для оказания целенаправленной помощи.
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-teal/20"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-teal border-t-transparent absolute top-0 left-0" style={{ animationDuration: '1s' }}></div>
            </div>
            <p className="mt-4 text-slate-600 animate-pulse">Загрузка программ...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gray-200 rounded-full blur-2xl opacity-50"></div>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4 relative z-10 animate-float" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Программы в разработке</h3>
            <p className="text-slate-600">Скоро здесь появятся программы восстановления</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {courses.map((course, index) => (
              <Link 
                key={course.id}
                href={`/programs/${course.slug}`}
                className="group"
              >
                <div 
                  className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-slide-in-up border border-slate-100/50 overflow-hidden h-full flex flex-col"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  {/* Corner badge */}
                  <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 pr-20 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-blue-600 transition-all duration-300">
                        {course.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-semibold transform group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.durationWeeks} недель
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold transform group-hover:scale-105 transition-transform duration-300">
                          {course.level}
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold transform group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {course._count.modules} модулей
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-base mb-6 group-hover:text-slate-900 transition-colors duration-300 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-200 group-hover:border-teal-200 transition-colors duration-300">
                      <span className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors duration-300 font-medium">
                        Узнать больше
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg transform group-hover:translate-x-2 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Наши услуги */}
      <section className="max-w-6xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl lg:text-5xl text-slate-900 mb-4 font-bold">Наши услуги</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ПТСР Эксперт предлагает широкий спектр услуг для поддержки вашего психического здоровья
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            const colors = [
              { bg: 'from-teal-50 to-cyan-50', icon: 'bg-gradient-to-br from-teal-500 to-cyan-600', shadow: 'shadow-teal-500/20' },
              { bg: 'from-blue-50 to-indigo-50', icon: 'bg-gradient-to-br from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
              { bg: 'from-emerald-50 to-green-50', icon: 'bg-gradient-to-br from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' }
            ]
            const color = colors[index]
            return (
              <div
                key={service.title}
                className={`relative bg-gradient-to-br ${color.bg} rounded-3xl p-8 transform hover:scale-105 hover:-translate-y-3 transition-all duration-500 hover:shadow-2xl ${color.shadow} animate-slide-in-up group cursor-pointer overflow-hidden`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 ${color.icon} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl ${color.shadow}`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-blue-600 transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Как это работает */}
      <section className="max-w-7xl mx-auto px-4 py-20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white rounded-3xl -z-10"></div>
        
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl lg:text-5xl text-slate-900 mb-4 font-bold">Как это работает</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Получить помощь еще никогда не было так просто
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {steps.map((step, index) => {
            const gradients = [
              'from-teal-500 to-cyan-600',
              'from-blue-500 to-indigo-600',
              'from-purple-500 to-pink-600',
              'from-emerald-500 to-green-600'
            ]
            const bgGradients = [
              'from-teal-50 via-cyan-50 to-white',
              'from-blue-50 via-indigo-50 to-white',
              'from-purple-50 via-pink-50 to-white',
              'from-emerald-50 via-green-50 to-white'
            ]
            return (
              <div
                key={step.title}
                className={`relative bg-gradient-to-br ${bgGradients[index]} rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-slide-in-up group cursor-pointer border border-slate-100/50 overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10 flex gap-6 items-start">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shrink-0 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <span className="text-white font-bold text-2xl">{index + 1}</span>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradients[index]} blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-blue-600 transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-base group-hover:text-slate-900 transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-brand-teal to-brand-blue rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            )
          })}
        </div>
        
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg" className="transform hover:scale-110 transition-all duration-300 hover:shadow-2xl bg-gradient-to-r from-brand-teal to-brand-blue text-white px-12 py-6 text-lg">
            <Link href="/register">Начать сейчас</Link>
          </Button>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Card className="border-none bg-gradient-to-r from-brand-teal to-brand-blue text-white shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden group">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          </div>
          
          <CardHeader className="relative z-10">
            <h2 className="text-3xl font-heading animate-slide-in-left">Готовы сделать первый шаг к улучшению вашего психического здоровья?</h2>
            <p className="text-white/80 mt-3 max-w-3xl animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              Присоединяйтесь к тысячам людей, которые уже получили поддержку на нашей платформе.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 relative z-10 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" variant="secondary" className="bg-white text-brand-teal hover:bg-slate-100 transform hover:scale-110 transition-all duration-300 hover:shadow-2xl">
              <Link href="/specialists">Найти специалиста</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

