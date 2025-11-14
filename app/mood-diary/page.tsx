'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { Smile, Frown, Meh, TrendingUp, Calendar, Plus, Trash2, X } from 'lucide-react'

interface MoodEntry {
  id: string
  moodLevel: number
  notes: string | null
  createdAt: string
}

export default function MoodDiaryPage() {
  const [moodLevel, setMoodLevel] = useState(5)
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/mood')
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSaving(true)
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodLevel, notes: notes || null }),
      })

      if (response.ok) {
        const data = await response.json()
        setEntries([data.entry, ...entries])
        setMoodLevel(5)
        setNotes('')
        setShowCreateForm(false)
        alert('Настроение сохранено!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту запись?')) return

    try {
      const response = await fetch(`/api/mood/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setEntries(entries.filter(e => e.id !== id))
        alert('Запись удалена')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка удаления')
    }
  }

  const getMoodInfo = (level: number) => {
    const moods = [
      { icon: '😢', label: 'Очень плохо', color: 'text-red-600' },
      { icon: '😟', label: 'Плохо', color: 'text-orange-600' },
      { icon: '😐', label: 'Нормально', color: 'text-yellow-600' },
      { icon: '🙂', label: 'Хорошо', color: 'text-lime-600' },
      { icon: '😊', label: 'Отлично', color: 'text-green-600' },
    ]
    return moods[level - 1] || moods[2]
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex gap-6">
            {/* Боковая панель */}
            <UserSidebar />

            {/* Основной контент */}
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Дневник настроения</h1>
                  <p className="text-gray-600 mt-2">
                    Отслеживайте своё эмоциональное состояние каждый день
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Записать настроение</span>
                </button>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-brand-teal" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{entries.length}</div>
                      <div className="text-sm text-gray-600">Всего записей</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Smile className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {entries.length > 0 
                          ? (entries.reduce((sum, e) => sum + e.moodLevel, 0) / entries.length).toFixed(1)
                          : '-'}
                      </div>
                      <div className="text-sm text-gray-600">Средний уровень</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {entries.length > 0 ? Math.ceil((Date.now() - new Date(entries[entries.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7)) : '-'}
                      </div>
                      <div className="text-sm text-gray-600">Недель ведения</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Список записей */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  История настроения
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Загрузка записей...</p>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-12">
                    <Smile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">У вас пока нет записей настроения</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="btn-primary"
                    >
                      Записать первое настроение
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => {
                      const mood = getMoodInfo(entry.moodLevel)
                      return (
                        <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:border-brand-teal transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <span className="text-3xl">{mood.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className={`font-medium ${mood.color}`}>{mood.label}</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(entry.createdAt).toLocaleString('ru-RU', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {entry.notes && (
                                  <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-2 hover:bg-red-50 rounded text-red-600"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Модальное окно создания записи */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Как вы себя чувствуете?</h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setMoodLevel(5)
                      setNotes('')
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Оцените своё настроение *
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const mood = getMoodInfo(level)
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setMoodLevel(level)}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                              moodLevel === level
                                ? 'border-brand-teal bg-brand-teal/10 scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-4xl mb-2">{mood.icon}</div>
                            <div className={`text-sm font-medium ${moodLevel === level ? 'text-brand-teal' : 'text-gray-600'}`}>
                              {mood.label}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Заметки (необязательно)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input-field min-h-[100px]"
                      placeholder="Что повлияло на ваше настроение?"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setMoodLevel(5)
                        setNotes('')
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 disabled:opacity-50"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
