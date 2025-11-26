'use client'

import { useMemo, useState, useEffect } from 'react'
import { Users, Star, Award, Calendar, ArrowRight, Search, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Psychologist {
  id: string
  specialization: string[]
  experienceYears: number
  price: number
  rating: number | null
  available: boolean
  user: {
    fullName: string | null
    avatarUrl: string | null
  }
}

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Psychologist[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [availabilityOnly, setAvailabilityOnly] = useState(true)
  const [minExperience, setMinExperience] = useState(0)
  const [specializationFilter, setSpecializationFilter] = useState('')
  const resetFilters = () => {
    setSearch('')
    setAvailabilityOnly(true)
    setMinExperience(0)
    setSpecializationFilter('')
  }

  useEffect(() => {
    fetchSpecialists()
  }, [])

  const fetchSpecialists = async () => {
    try {
      const response = await fetch('/api/psychologists')
      if (response.ok) {
        const data = await response.json()
        setSpecialists(data.psychologists)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSpecialists = useMemo(() => {
    return specialists.filter((specialist) => {
      if (availabilityOnly && !specialist.available) return false
      if (minExperience && specialist.experienceYears < minExperience) return false
      if (specializationFilter) {
        const match = specialist.specialization.some((spec) =>
          spec.toLowerCase().includes(specializationFilter.toLowerCase()),
        )
        if (!match) return false
      }
      if (search.trim()) {
        const target = `${specialist.user.fullName ?? ''} ${specialist.specialization.join(' ')}`.toLowerCase()
        if (!target.includes(search.trim().toLowerCase())) return false
      }
      return true
    })
  }, [specialists, availabilityOnly, minExperience, search, specializationFilter])

  const specializationOptions = useMemo(() => {
    const set = new Set<string>()
    specialists.forEach((specialist) => {
      specialist.specialization.forEach((spec) => {
        if (spec) set.add(spec)
      })
    })
    return Array.from(set)
  }, [specialists])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal" aria-label="Загрузка"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: 'linear-gradient(115deg, rgba(5,5,5,0.85), rgba(5,5,5,0.65)), url(/assets/peaceful-meadow.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-custom py-20 relative z-10 space-y-6">
          <p className="uppercase tracking-[0.3em] text-emerald-100 text-xs font-semibold mb-4">команда поддержки</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Найдите своего <span className="text-emerald-200">ПТСР‑эксперта</span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-3xl">
            Квалифицированные специалисты по травматерапии, КПТ и работе с ПТСР готовы сопровождать вас на каждом этапе восстановления.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/faq" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Часто задаваемые вопросы
            </Link>
            <Link href="#filters" className="inline-flex items-center rounded-full bg-white text-emerald-700 px-6 py-3 text-sm font-semibold">
              Подобрать специалиста
            </Link>
          </div>
          <p className="text-sm text-emerald-100/80 max-w-3xl">
            Если вы переживаете кризис или кому-то угрожает опасность,{' '}
            <Link href="/contact" className="underline font-semibold">
              перейдите на страницу с экстренными ресурсами
            </Link>{' '}
            и обратитесь за немедленной помощью.
          </p>
        </div>
      </section>

      <section id="filters" className="container-custom pb-16 -mt-10 space-y-12 relative z-10">
        {/* Фильтры */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по имени или ключевому слову..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="w-full lg:w-80 flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">специализация</label>
                <div className="relative">
                  <select
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-700"
                  >
                    <option value="">Все специализации</option>
                    {specializationOptions.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <ArrowRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="available"
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="available" className="text-sm font-medium text-slate-700">
                  Только доступные сейчас
                </label>
              </div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm text-slate-500 mr-2">Опыт:</span>
                {[0, 5, 10, 15].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMinExperience(value)}
                    className={`px-3 py-1 text-sm rounded-full border transition ${
                      minExperience === value ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {value === 0 ? 'Любой' : `от ${value} лет`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Список специалистов */}
        {filteredSpecialists.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-emerald-300 p-12 text-center shadow-sm">
            <Users className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Пока нет специалистов по заданным фильтрам</h3>
            <p className="text-gray-600 mb-4">Измените параметры поиска или подпишитесь на уведомления о новых специалистах.</p>
            <button className="btn-secondary text-sm px-6 py-2" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSpecialists.map((specialist) => (
              <div
                key={specialist.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center overflow-hidden">
                    {specialist.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={specialist.user.avatarUrl}
                        alt={specialist.user.fullName ?? 'Специалист'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-emerald-700">
                        {specialist.user.fullName?.[0] ?? 'С'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center flex-wrap gap-2 text-sm text-slate-500">
                      <span>{specialist.experienceYears} лет опыта</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 leading-tight">
                      {specialist.user.fullName ?? 'Имя не указано'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specialist.specialization.slice(0, 4).map((spec) => (
                        <span key={spec} className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 text-slate-700 self-start md:self-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {specialist.available ? 'Принимает клиентов' : 'Недоступен'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs uppercase text-slate-400 tracking-[0.3em]">стоимость</p>
                    <p className="text-3xl font-bold text-slate-900">{specialist.price.toLocaleString()} ₽</p>
                    <p className="text-sm text-slate-500">за 60 минут</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/specialists/${specialist.id}/book`} className="btn-primary inline-flex items-center space-x-2 px-4 py-2">
                      <Calendar className="w-4 h-4" />
                      <span>Записаться</span>
                    </Link>
                    <Link
                      href={`/specialists/${specialist.id}`}
                      className="text-emerald-700 font-medium text-sm inline-flex items-center hover:text-emerald-800"
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Информация о процессе */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500 mb-2">как это работает</p>
              <h2 className="text-3xl font-bold text-slate-900">Сопровождаем на каждом шаге</h2>
              <p className="text-slate-600 mt-2 max-w-2xl">
                От первого обращения до завершения программы вас поддерживает команда координаторов и психологов. Мы подберём специалиста,
                подготовим материалы и напомним о сессии.
              </p>
            </div>
            <button className="btn-secondary px-6 py-3 text-sm">Оставить заявку</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Выбор специалиста',
                text: 'Изучите профили, отзывы и специализации. Координатор поможет определиться с форматом.',
              },
              {
                step: '02',
                title: 'Запись и оплата',
                text: 'Бронируем удобное время, отправляем ссылку на оплату и памятку по подготовке к встрече.',
              },
              {
                step: '03',
                title: 'Консультация и поддержка',
                text: 'Встреча проходит онлайн. После неё вы получите рекомендации и сможете продолжить курс.',
              },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="text-emerald-600 text-sm font-semibold tracking-[0.4em] mb-3">{item.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
