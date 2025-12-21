'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, BookOpen, Award, Heart, FileText } from 'lucide-react'

const worldviewOptions = [
  { value: '', label: 'Не указано' },
  { value: 'Православие', label: 'Православие' },
  { value: 'Католицизм', label: 'Католицизм' },
  { value: 'Ислам', label: 'Ислам' },
  { value: 'Иудаизм', label: 'Иудаизм' },
  { value: 'Буддизм', label: 'Буддизм' },
  { value: 'Индуизм', label: 'Индуизм' },
  { value: 'Агностицизм', label: 'Агностицизм' },
  { value: 'Атеизм', label: 'Атеизм' },
  { value: 'Другое', label: 'Другое' },
]

const genderOptions = [
  { value: 'NOT_SPECIFIED', label: 'Не выбран' },
  { value: 'MALE', label: 'Мужской' },
  { value: 'FEMALE', label: 'Женский' },
  { value: 'OTHER', label: 'Другое' },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
    dateOfBirth: '',
    gender: 'NOT_SPECIFIED',
    city: '',
    country: 'Россия',
    worldview: '',
  })
  const [profileLoading, setProfileLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (!response.ok) throw new Error('Не удалось загрузить профиль')
        const json = await response.json()
        const u = json.user
        setProfileForm({
          fullName: u.fullName || '',
          email: u.email || '',
          avatarUrl: u.avatarUrl || '',
          dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : '',
          gender: u.gender || 'NOT_SPECIFIED',
          city: u.city || '',
          country: u.country || 'Россия',
          worldview: u.worldview || '',
        })
      } catch (error) {
        console.error(error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMessage(null)
    setSavingProfile(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.error || 'Не удалось сохранить профиль')
      }
      const json = await response.json()
      const u = json.user
      setProfileForm({
        fullName: u.fullName || '',
        email: u.email || '',
        avatarUrl: u.avatarUrl || '',
        dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : '',
        gender: u.gender || 'NOT_SPECIFIED',
        city: u.city || '',
        country: u.country || 'Россия',
        worldview: u.worldview || '',
      })
      setProfileMessage({ type: 'success', text: 'Профиль обновлён' })
    } catch (error) {
      setProfileMessage({ type: 'error', text: error instanceof Error ? error.message : 'Ошибка сохранения' })
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Боковая панель */}
            <UserSidebar />

            {/* Основной контент */}
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">Мой профиль</h1>
                <p className="text-slate-600 mt-2">
                  Управляйте информацией о вашем профиле
                </p>
              </div>

              {/* Карточка профиля */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                {profileLoading ? (
                  <div className="text-slate-500 text-sm">Загрузка профиля...</div>
                ) : (
                  <form className="space-y-8" onSubmit={handleProfileSubmit}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {profileForm.avatarUrl ? (
                            <img src={profileForm.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                          ) : user?.image ? (
                            <img src={user.image} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                          ) : (
                            <User className="w-12 h-12 text-white" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">
                            {profileForm.fullName || user?.name || 'Пользователь'}
                          </h2>
                          <div className="flex items-center text-slate-600 mt-2">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{profileForm.email || user?.email || 'Не указан'}</span>
                          </div>
                          {user?.roles && user.roles.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {user.roles.map((role) => (
                                <span key={role} className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-1 rounded">
                                  {role}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="hidden bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors md:inline-flex"
                        disabled={savingProfile}
                      >
                        {savingProfile ? 'Сохранение...' : 'Сохранить'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Полное имя</span>
                        <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} className="input-field" placeholder="Иван Иванов" />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Email</span>
                        <input value={profileForm.email} readOnly className="input-field bg-slate-50" />
                        <p className="text-xs text-slate-500">Email нельзя изменить</p>
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Ссылка на аватар</span>
                        <input name="avatarUrl" value={profileForm.avatarUrl} onChange={handleProfileChange} className="input-field" placeholder="https://" />
                        <p className="text-xs text-slate-500">Укажите ссылку на изображение</p>
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Дата рождения</span>
                        <input type="date" name="dateOfBirth" value={profileForm.dateOfBirth} onChange={handleProfileChange} className="input-field" />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Пол</span>
                        <select name="gender" value={profileForm.gender} onChange={handleProfileChange} className="input-field">
                          {genderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Город</span>
                        <input name="city" value={profileForm.city} onChange={handleProfileChange} className="input-field" placeholder="Москва" />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Страна</span>
                        <input name="country" value={profileForm.country} onChange={handleProfileChange} className="input-field" placeholder="Россия" />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Мировоззрение</span>
                        <select name="worldview" value={profileForm.worldview} onChange={handleProfileChange} className="input-field">
                          {worldviewOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-brand-teal px-6 py-3 text-center font-medium text-white transition-colors hover:bg-brand-teal/90 md:hidden"
                      disabled={savingProfile}
                    >
                      {savingProfile ? 'Сохранение...' : 'Сохранить'}
                    </button>

                    {profileMessage && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          profileMessage.type === 'success'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border border-red-200 bg-red-50 text-red-700'
                        }`}
                      >
                        {profileMessage.text}
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Быстрые действия */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/mood-diary')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-brand-teal"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-brand-teal/10 rounded-lg p-3">
                        <Heart className="w-6 h-6 text-brand-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Дневник настроения</h3>
                        <p className="text-sm text-slate-600">Отслеживайте своё состояние</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/diary')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-brand-blue"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-brand-blue/10 rounded-lg p-3">
                        <FileText className="w-6 h-6 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Дневник активности</h3>
                        <p className="text-sm text-slate-600">Записывайте события</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/my-courses')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-purple-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Мои курсы</h3>
                        <p className="text-sm text-slate-600">Продолжить обучение</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/certificates')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-yellow-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 rounded-lg p-3">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Сертификаты</h3>
                        <p className="text-sm text-slate-600">Просмотр достижений</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => router.push('/anxiety-tests')}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-emerald-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-100 rounded-lg p-3">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Оценка тревожности</h3>
                        <p className="text-sm text-slate-600">Пройдите стандартизированный тест</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Результаты тестов</h2>
                    <p className="text-sm text-slate-600">Сохраняются после прохождения в разделе «Оценка тревожности»</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => router.push('/anxiety-tests')} className="text-sm font-semibold text-emerald-600">
                      Пройти тест →
                    </button>
                    <button onClick={() => router.push('/profile/tests')} className="text-sm font-semibold text-slate-500">
                      Смотреть историю
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
