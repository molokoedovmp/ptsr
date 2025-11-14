'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { Smile, Frown, Meh, TrendingUp, Calendar, Plus, Trash2 } from 'lucide-react'

interface MoodEntry {
  id: string
  moodLevel: number
  notes: string | null
  createdAt: string
}

export default function MoodDiaryPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const moods = [
    { value: 1, label: 'Очень плохо', icon: '😢', color: 'text-red-500' },
    { value: 2, label: 'Плохо', icon: '😟', color: 'text-orange-500' },
    { value: 3, label: 'Нейтрально', icon: '😐', color: 'text-yellow-500' },
    { value: 4, label: 'Хорошо', icon: '🙂', color: 'text-green-500' },
    { value: 5, label: 'Отлично', icon: '😊', color: 'text-green-600' },
  ]

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
    if (!selectedMood) return

    setSaving(true)
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodLevel: selectedMood, notes: notes || null }),
      })

      if (response.ok) {
        const data = await response.json()
        setEntries([data.entry, ...entries])
        setSelectedMood(null)
        setNotes('')
        alert('Запись успешно добавлена!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка сохранения записи')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту запись?')) return

    try {
      const response = await fetch(`/api/mood/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(entries.filter(e => e.id !== id))
        alert('Запись удалена')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка удаления')
    }
  }

  const calculateStats = () => {
    if (entries.length === 0) return { average: 0, count: 0 }
    const sum = entries.reduce((acc, entry) => acc + entry.moodLevel, 0)
    return {
      average: (sum / entries.length).toFixed(1),
      count: entries.length
    }
  }

  const stats = calculateStats()

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
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Дневник настроения</h1>
                <p className="text-gray-600 mt-2">
                  Отслеживайте своё эмоциональное состояние каждый день
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Форма добавления записи */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Как вы себя чувствуете сегодня?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Выбор настроения */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Выберите ваше настроение
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {moods.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() => setSelectedMood(mood.value)}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            selectedMood === mood.value
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-4xl mb-2">{mood.icon}</div>
                          <div className={`text-xs font-medium ${mood.color}`}>
                            {mood.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Заметки */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Заметки (опционально)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Что повлияло на ваше настроение сегодня?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedMood || saving}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{saving ? 'Сохранение...' : 'Добавить запись'}</span>
                  </button>
                </form>
              </div>

              {/* История записей */}
              <div className="card mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Недавние записи ({entries.length})
                </h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Загрузка записей...</p>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-12">
                    <Smile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">У вас пока нет записей</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.slice(0, 10).map((entry) => {
                      const mood = moods.find(m => m.value === entry.moodLevel)
                      return (
                        <div key={entry.id} className="border-l-4 border-primary-600 pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{mood?.icon}</span>
                              <span className={`font-medium ${mood?.color}`}>
                                {mood?.label}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {new Date(entry.createdAt).toLocaleString('ru-RU', {
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="p-1 hover:bg-red-50 rounded text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {entry.notes && (
                            <p className="text-gray-600 text-sm">{entry.notes}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Боковая панель с аналитикой */}
            <div className="space-y-6">
              {/* Статистика */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Статистика
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Среднее настроение</span>
                      <span className="font-semibold text-green-600">{stats.average} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(parseFloat(stats.average) / 5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Всего записей: <span className="font-semibold">{stats.count}</span></p>
                  </div>
                </div>
              </div>

              {/* Инсайты */}
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Инсайт
                </h3>
                <p className="text-sm text-blue-800">
                  Ваше настроение улучшается, когда вы занимаетесь физическими упражнениями. 
                  Попробуйте добавить больше активности в свой распорядок дня.
                </p>
              </div>

              {/* Быстрые действия */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Быстрые действия
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    📊 Посмотреть графики
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    📅 Календарь настроения
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    💾 Экспорт данных
                  </button>
                </div>
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

