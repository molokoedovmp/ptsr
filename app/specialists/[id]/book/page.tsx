'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, Clock, Send } from 'lucide-react'

interface Slot {
  id: string
  startTime: string
  endTime: string
}

interface SpecialistResponse {
  psychologist: {
    id: string
    price: number
    specialization: string[]
    experienceYears: number
    user: {
      fullName: string | null
      avatarUrl: string | null
    }
    slots: Slot[]
  }
}

interface UserProfileResponse {
  user: {
    fullName: string | null
    email: string
    phone: string | null
  }
}

interface PageProps {
  params: { id: string }
}

export default function BookSpecialistPage({ params }: PageProps) {
  const { status } = useSession()
  const [data, setData] = useState<SpecialistResponse['psychologist'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const initialSlotId = searchParams.get('slotId') ?? ''
  const [profileLoading, setProfileLoading] = useState(status === 'loading')
  const [profilePrefillError, setProfilePrefillError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    slotId: initialSlotId,
    message: '',
  })

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`/api/psychologists/${params.id}`)
        if (!response.ok) {
          const body = await response.json()
          throw new Error(body.error || 'Не удалось загрузить данные специалиста')
        }
        const json: SpecialistResponse = await response.json()
        setData(json.psychologist)
        if (!initialSlotId && json.psychologist.slots.length > 0) {
          setFormData((prev) => ({ ...prev, slotId: json.psychologist.slots[0].id }))
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialist()
  }, [params.id, initialSlotId])

  useEffect(() => {
    if (status === 'loading') {
      setProfileLoading(true)
      return
    }

    if (status !== 'authenticated') {
      setProfileLoading(false)
      return
    }

    let isActive = true

    const fetchProfile = async () => {
      setProfileLoading(true)
      setProfilePrefillError(null)
      try {
        const response = await fetch('/api/user/profile', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Не удалось загрузить профиль')
        }
        const json: UserProfileResponse = await response.json()
        if (isActive && json.user) {
          setFormData((prev) => ({
            ...prev,
            name: prev.name || json.user.fullName || '',
            email: prev.email || json.user.email || '',
            phone: prev.phone || json.user.phone || '',
          }))
        }
      } catch (err) {
        if (isActive) {
          console.error('Profile prefill error:', err)
          setProfilePrefillError('Не удалось автоматически заполнить данные профиля. Заполните поля вручную.')
        }
      } finally {
        if (isActive) {
          setProfileLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isActive = false
    }
  }, [status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)

    if (!formData.slotId) {
      setFormError('Выберите слот из списка')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          psychologistId: params.id,
          slotId: formData.slotId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось отправить заявку')

      const bookedSlotId = formData.slotId
      let nextSlotId = ''
      setData((prev) => {
        if (!prev) return prev
        const updatedSlots = prev.slots.filter((slot) => slot.id !== bookedSlotId)
        nextSlotId = updatedSlots[0]?.id ?? ''
        return { ...prev, slots: updatedSlots }
      })

      setFormData((prev) => ({
        ...prev,
        slotId: nextSlotId,
        message: '',
      }))

      setSubmitted(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  const formattedSlots = useMemo(() => {
    return (
      data?.slots.map((slot) => ({
        id: slot.id,
        label: `${new Date(slot.startTime).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}, ${new Date(slot.startTime).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        range: `${new Date(slot.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${new Date(slot.endTime).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      })) || []
    )
  }, [data?.slots])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (!data || loadError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-center px-6">
        <div className="space-y-4">
          <p className="text-lg text-slate-700">{loadError || 'Специалист не найден'}</p>
          <Link href="/specialists" className="text-emerald-600 font-semibold">
            Вернуться к списку специалистов
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden text-white" style={{ backgroundImage: 'linear-gradient(110deg, rgba(5,5,5,0.8), rgba(5,5,5,0.6)), url(/assets/peaceful-meadow.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container-custom py-16 relative z-10 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">Запись к психологу</p>
          <h1 className="text-4xl font-bold">Записаться на консультацию</h1>
          <p className="text-emerald-50/90 max-w-3xl">
            Вы бронируете встречу со специалистом {data.user.fullName ?? 'Психолог'}.
            Стоимость консультации — {data.price.toLocaleString()} ₽. После отправки заявки координатор подтвердит время и вышлет инструкции.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </section>

      <section className="container-custom py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 rounded-3xl border border-slate-100 p-6 shadow-sm bg-slate-50 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl font-semibold text-emerald-700">
              {data.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.user.avatarUrl} alt={data.user.fullName ?? 'Психолог'} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                (data.user.fullName?.[0] ?? 'П')
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Психолог</p>
              <p className="text-xl font-semibold text-slate-900">{data.user.fullName ?? 'Имя не указано'}</p>
              <p className="text-sm text-slate-500">Опыт {data.experienceYears}+ лет</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Доступно {data.slots.length} слотов
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              50–60 минут сессия
            </p>
            <p>Специализация: {data.specialization.slice(0, 3).join(', ')}</p>
          </div>
          <Link href={`/specialists/${data.id}`} className="text-emerald-600 text-sm font-semibold">
            ← Вернуться к профилю
          </Link>
        </div>

        <div className="lg:col-span-2 rounded-[32px] border border-slate-100 shadow-2xl p-8 bg-white">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {submitted && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-emerald-700 text-sm">
                Заявка отправлена. Координатор свяжется с вами по указанной почте для подтверждения времени.
              </div>
            )}
            {formError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {formError}
              </div>
            )}
            {status !== 'authenticated' && status !== 'loading' && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Авторизуйтесь, чтобы мы автоматически подставили ваши данные профиля.</p>
                <p className="mt-1 text-slate-500">Так запись займет меньше времени, но вы всегда можете заполнить форму вручную.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                    Войти
                  </Link>
                  <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                    Создать аккаунт
                  </Link>
                </div>
              </div>
            )}
            {status === 'authenticated' && profileLoading && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Загружаем данные вашего профиля...
              </div>
            )}
            {profilePrefillError && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {profilePrefillError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-slate-600 space-y-2">
                <span>Полное имя</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Иван Иванов"
                />
              </label>
              <label className="text-sm font-medium text-slate-600 space-y-2">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="you@email.com"
                />
              </label>
              <label className="text-sm font-medium text-slate-600 space-y-2">
                <span>Телефон</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="+7 (999) 000-00-00"
                />
              </label>
              <label className="text-sm font-medium text-slate-600 space-y-2">
                <span>Выберите слот</span>
                <select
                  name="slotId"
                  value={formData.slotId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  required={data.slots.length > 0}
                >
                  {formattedSlots.length === 0 ? (
                    <option value="">Свободные слоты появятся позже</option>
                  ) : (
                    formattedSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label} ({slot.range})
                      </option>
                    ))
                  )}
                </select>
              </label>
            </div>
            <label className="text-sm font-medium text-slate-600 space-y-2">
              <span>Опишите ваш запрос</span>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                placeholder="Какие темы вы хотите обсудить на консультации?"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-white font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Отправка...' : 'Подтвердить запись'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
