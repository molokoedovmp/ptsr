'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PsychologistProtectedRoute from '@/components/psychologist/PsychologistProtectedRoute'
import { Calendar, Users, Clock, TrendingUp, Settings, DollarSign, Star, ShieldCheck, CheckCircle, Trash2 } from 'lucide-react'

interface DashboardStat {
  label: string
  value: string
  type: string
}

interface DashboardProfile {
  fullName: string | null
  email: string
  phone: string | null
  specialization: string[]
  experienceYears: number
  education: string
  price: number
  rating: number | null
  verified: boolean
  available: boolean
}

interface DashboardData {
  profile: DashboardProfile
  stats: DashboardStat[]
  sessions: {
    id: string
    startTime: string
    endTime: string
    status: string
    clientName?: string | null
    notes?: string | null
  }[]
}

type FeedbackMessage = { type: 'success' | 'error'; text: string } | null

const statIcons: Record<string, { icon: JSX.Element; color: string }> = {
  price: { icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  experience: { icon: <TrendingUp className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
  availability: { icon: <Users className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
  verification: { icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
}

export default function PsychologistDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileForm, setProfileForm] = useState({
    price: '',
    education: '',
    specialization: '',
    available: false,
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [slotForm, setSlotForm] = useState({
    startTime: '',
    endTime: '',
    notes: '',
  })
  const [slotFeedback, setSlotFeedback] = useState<FeedbackMessage>(null)
  const [profileFeedback, setProfileFeedback] = useState<FeedbackMessage>(null)
  const [clientsModalOpen, setClientsModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [slotModalOpen, setSlotModalOpen] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/psychologist/dashboard')
        if (!response.ok) {
          const body = await response.json()
          throw new Error(body.error || 'Не удалось загрузить данные кабинета')
        }
        const json = await response.json()
        setData(json)
        setProfileForm({
          price: String(json.profile.price ?? ''),
          education: json.profile.education ?? '',
          specialization: json.profile.specialization?.join(', ') ?? '',
          available: json.profile.available ?? false,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const upcomingSessions = data?.sessions || []
  const bookedSessions = (data?.sessions || []).filter((session) => Boolean(session.clientName))
  const statusStyles: Record<string, { label: string; className: string }> = {
    AVAILABLE: { label: 'Свободен', className: 'bg-emerald-50 text-emerald-700' },
    BOOKED: { label: 'Забронирован', className: 'bg-blue-50 text-blue-700' },
    COMPLETED: { label: 'Проведено', className: 'bg-slate-100 text-slate-700' },
    CANCELLED: { label: 'Отменено', className: 'bg-rose-50 text-rose-700' },
  }

  const formatDateTime = (dateString: string, withDate = true) => {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'Не указано'
    const options: Intl.DateTimeFormatOptions = withDate
      ? { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }
      : { hour: '2-digit', minute: '2-digit' }
    return date.toLocaleString('ru-RU', options)
  }

  const closeSlotModal = () => {
    setSlotModalOpen(false)
    setSlotFeedback(null)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileFeedback(null)
    if (!data) {
      setProfileFeedback({ type: 'error', text: 'Данные профиля еще загружаются' })
      setSavingProfile(false)
      return
    }
    try {
      const response = await fetch('/api/psychologist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: Number(profileForm.price),
          education: profileForm.education,
          specialization: profileForm.specialization,
          available: profileForm.available,
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось обновить профиль')
      const normalizedProfile: DashboardProfile = {
        fullName: json.profile.user?.fullName ?? data.profile.fullName,
        email: json.profile.user?.email ?? data.profile.email,
        phone: json.profile.user?.phone ?? data.profile.phone,
        specialization: json.profile.specialization,
        experienceYears: json.profile.experienceYears,
        education: json.profile.education,
        price: json.profile.price,
        rating: json.profile.rating,
        verified: json.profile.verified,
        available: json.profile.available,
      }
      setData((prev) => (prev ? { ...prev, profile: normalizedProfile } : prev))
      setProfileForm({
        price: String(json.profile.price ?? ''),
        education: json.profile.education ?? '',
        specialization: json.profile.specialization?.join(', ') ?? '',
        available: json.profile.available ?? false,
      })
      setProfileFeedback({ type: 'success', text: 'Профиль обновлен' })
    } catch (err) {
      setProfileFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Ошибка сохранения профиля' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSlotFeedback(null)
    try {
      const response = await fetch('/api/psychologist/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotForm),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось создать слот')
      setSlotFeedback({ type: 'success', text: 'Слот добавлен' })
      setSlotForm({ startTime: '', endTime: '', notes: '' })
      setData((prev) =>
        prev ? { ...prev, sessions: [...prev.sessions, json.slot].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) } : prev,
      )
    } catch (err) {
      setSlotFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Ошибка создания слота' })
    }
  }

  const handleSlotDelete = async (id: string) => {
    if (!confirm('Удалить слот?')) return
    try {
      const response = await fetch(`/api/psychologist/slots/${id}`, { method: 'DELETE' })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Не удалось удалить слот')
      setData((prev) => (prev ? { ...prev, sessions: prev.sessions.filter((slot) => slot.id !== id) } : prev))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления')
    }
  }

  if (loading) {
    return (
      <PsychologistProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teал"></div>
        </div>
      </PsychologistProtectedRoute>
    )
  }

  if (error || !data) {
    return (
      <PsychologistProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <p className="text-lg font-semibold text-gray-900 mb-2">Не удалось загрузить кабинет</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </PsychologistProtectedRoute>
    )
  }

  return (
    <PsychologistProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-green-600" />
              Кабинет психолога
            </h1>
            <p className="text-gray-600 mt-2">
              {data.profile.fullName ? `Здравствуйте, ${data.profile.fullName}!` : 'Управление консультациями и расписанием'}
            </p>
          </div>

          {/* Быстрые действия */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button className="btn-primary text-sm py-3" onClick={() => setSlotModalOpen(true)}>
                Добавить слот
              </button>
              <button className="btn-secondary text-sm py-3" onClick={() => setClientsModalOpen(true)}>
                Просмотреть клиентов
              </button>
              <button className="btn-secondary text-sm py-3" onClick={() => setProfileModalOpen(true)}>
                Редактировать профиль
              </button>
              <button className="btn-secondary text-sm py-3" onClick={() => router.push('/psychologist/articles')}>
                Написать статью
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Предстоящие сессии */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Предстоящие консультации
                  </h2>
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    onClick={() => setSlotModalOpen(true)}
                  >
                    Календарь →
                  </button>
                </div>

                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => {
                      const statusInfo = statusStyles[session.status] ?? statusStyles.AVAILABLE
                      return (
                        <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm text-gray-500">
                                <Clock className="inline w-4 h-4 mr-1" />
                                {formatDateTime(session.startTime)} — {formatDateTime(session.endTime, false)}
                              </p>
                              <p className="text-lg font-semibold text-gray-900 mt-1">
                                {session.clientName || 'Свободный слот'}
                              </p>
                              {session.notes && <p className="text-sm text-gray-600 mt-2">Заметки: {session.notes}</p>}
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <button
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                              onClick={() => handleSlotDelete(session.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить слот
                            </button>
                            {session.status === 'AVAILABLE' && (
                              <span className="text-sm text-gray-500 flex items-center">
                                Ожидает бронирования клиентом
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Нет предстоящих консультаций
                    </h3>
                    <p className="text-gray-600">
                      Добавьте свободные интервалы, чтобы клиенты могли записаться
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Профиль */}
              <div className="card space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{data.profile.fullName || 'Имя не указано'}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {data.profile.rating ? `${data.profile.rating.toFixed(1)} / 5.0` : 'Рейтинг не присвоен'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Email: <span className="font-medium text-gray-900">{data.profile.email}</span></p>
                  {data.profile.phone && (
                    <p className="mt-1">Телефон: <span className="font-medium text-gray-900">{data.profile.phone}</span></p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Специализация</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.profile.specialization.map((item) => (
                      <span key={item} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full btn-secondary text-sm" onClick={() => setProfileModalOpen(true)}>
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Редактировать профиль
                </button>
              </div>

              {/* Информация */}
              <div className="card space-y-3">
                <h3 className="font-semibold text-gray-900">Информация</h3>
                <p className="text-sm text-gray-600">
                  Образование: <span className="font-medium text-gray-900">{data.profile.education}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Стоимость сессии: <span className="font-medium text-gray-900">{data.profile.price.toLocaleString()}₽</span>
                </p>
                <p className="text-sm text-gray-600">
                  Статус: <span className="font-medium text-gray-900">{data.profile.available ? 'Принимаете клиентов' : 'Недоступен'}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Верификация: <span className="font-medium text-gray-900">{data.profile.verified ? 'Подтверждено' : 'Ожидает подтверждения'}</span>
                </p>
              </div>

              {/* Редактирование профиля */}
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Совет
                </h3>
                <p className="text-sm text-blue-800">
                  Заполните информацию о подходах и методиках. Это помогает клиентам понять, насколько вы им подходите.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {clientsModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setClientsModalOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Клиенты на консультации</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Здесь отображаются клиенты, которые уже забронировали время. Чтобы закрыть окно, нажмите «Закрыть».
                  </p>
                </div>
                <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => setClientsModalOpen(false)}>
                  Закрыть
                </button>
              </div>
              {bookedSessions.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {bookedSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-500">
                        {formatDateTime(session.startTime)} — {formatDateTime(session.endTime, false)}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{session.clientName}</p>
                      {session.notes && <p className="text-sm text-gray-600 mt-1">Заметки: {session.notes}</p>}
                      <p className="text-xs text-gray-500 mt-2">Статус: {session.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Пока никто не забронировал консультацию. Как только клиент запишется, вы увидите его имя в этом списке.
                </p>
              )}
              <div className="mt-6">
                <button className="btn-primary w-full" onClick={() => setClientsModalOpen(false)}>
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {slotModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeSlotModal} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Настройка слота</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Задайте точное время начала и окончания консультации, добавьте заметку или ссылку на встречу. Слот появится в списке сразу после
                    сохранения.
                  </p>
                </div>
                <button className="text-sm text-gray-500 hover:text-gray-800" onClick={closeSlotModal}>
                  Закрыть
                </button>
              </div>
              <form onSubmit={handleSlotSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Начало</label>
                    <input
                      type="datetime-local"
                      value={slotForm.startTime}
                      onChange={(e) => setSlotForm((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="mt-1 w-full input"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Окончание</label>
                    <input
                      type="datetime-local"
                      value={slotForm.endTime}
                      onChange={(e) => setSlotForm((prev) => ({ ...prev, endTime: e.target.value }))}
                      className="mt-1 w-full input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Заметки (необязательно)</label>
                  <textarea
                    value={slotForm.notes}
                    onChange={(e) => setSlotForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className="mt-1 w-full textarea"
                    rows={3}
                    placeholder="Например, формат консультации или ссылка на видеовстречу"
                  />
                </div>
                {slotFeedback && (
                  <div
                    className={
                      slotFeedback.type === 'success'
                        ? 'rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700'
                        : 'rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'
                    }
                  >
                    {slotFeedback.text}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    Добавить слот
                  </button>
                  <button type="button" className="btn-secondary flex-1" onClick={closeSlotModal}>
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setProfileModalOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Редактирование профиля</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Обновите стоимость, образование, специализации и статус доступности. Изменения сразу сохраняются в кабинете.
                  </p>
                </div>
                <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => setProfileModalOpen(false)}>
                  Закрыть
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Стоимость консультации (₽)</label>
                    <input
                      type="number"
                      min={0}
                      value={profileForm.price}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, price: e.target.value }))}
                      className="mt-1 w-full input"
                      required
                    />
                  </div>
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 pt-6 md:pt-0">
                    <input
                      type="checkbox"
                      checked={profileForm.available}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, available: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span>Принимаю новых клиентов</span>
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Образование</label>
                  <textarea
                    value={profileForm.education}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, education: e.target.value }))}
                    className="mt-1 w-full textarea"
                    rows={4}
                    placeholder="Опишите ключевые программы, сертификаты и курсы"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Специализации</label>
                  <input
                    type="text"
                    value={profileForm.specialization}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, specialization: e.target.value }))}
                    className="mt-1 w-full input"
                    placeholder="Травмотерапия, КПТ, EMDR"
                  />
                  <p className="text-xs text-gray-500 mt-1">Перечислите направления через запятую.</p>
                </div>
                {profileFeedback && (
                  <div
                    className={
                      profileFeedback.type === 'success'
                        ? 'rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700'
                        : 'rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'
                    }
                  >
                    {profileFeedback.text}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="btn-primary flex-1" disabled={savingProfile}>
                    {savingProfile ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                  <button type="button" className="btn-secondary flex-1" onClick={() => setProfileModalOpen(false)}>
                    Закрыть без сохранения
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PsychologistProtectedRoute>
  )
}
