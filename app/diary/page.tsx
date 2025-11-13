'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ProtectedRoute from '@/components/ProtectedRoute'
import BlockNoteEditor from '@/components/editor/BlockNoteEditor'
import BlockNoteViewer from '@/components/editor/BlockNoteViewer'
import { BookOpen, Plus, Calendar, Search, Filter, Trash2, Edit, X } from 'lucide-react'

interface DiaryEntry {
  id: string
  title: string
  content: string
  activityType: string | null
  createdAt: string
}

export default function DiaryPage() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [activityType, setActivityType] = useState('')
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/diary')
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
    if (!title || !content) return

    setSaving(true)
    try {
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, activityType: activityType || null }),
      })

      if (response.ok) {
        const data = await response.json()
        setEntries([data.entry, ...entries])
        setTitle('')
        setContent('')
        setActivityType('')
        alert('Запись успешно сохранена!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка сохранения записи')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return

    try {
      const response = await fetch(`/api/diary/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(entries.filter(e => e.id !== id))
        setSelectedEntry(null)
        alert('Запись удалена')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка удаления записи')
    }
  }

  const startEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setSelectedEntry(null)
  }

  const cancelEdit = () => {
    setEditingEntry(null)
  }

  const saveEdit = async () => {
    if (!editingEntry) return

    setSaving(true)
    try {
      const response = await fetch(`/api/diary/${editingEntry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingEntry.title,
          content: editingEntry.content,
          activityType: editingEntry.activityType || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setEntries(entries.map(e => e.id === data.entry.id ? data.entry : e))
        setEditingEntry(null)
        alert('Запись обновлена!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка обновления')
    } finally {
      setSaving(false)
    }
  }

  const getActivityTypeLabel = (type: string | null) => {
    const types: Record<string, string> = {
      activity: 'Активность',
      practice: 'Практика',
      social: 'Социальное',
      reflection: 'Рефлексия',
      therapy: 'Терапия',
      other: 'Другое',
    }
    return type ? types[type] || type : 'Без категории'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-6xl">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Дневник активности</h1>
            <p className="text-gray-600 mt-2">
              Записывайте важные события и рефлексируйте о своём дне
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Форма добавления записи */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Plus className="w-6 h-6 mr-2 text-primary-600" />
                  Новая запись
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Заголовок *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="input-field"
                      placeholder="О чём эта запись?"
                    />
                  </div>

                  <div>
                    <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-2">
                      Тип активности
                    </label>
                    <select
                      id="activityType"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Выберите тип</option>
                      <option value="activity">Активность</option>
                      <option value="practice">Практика</option>
                      <option value="social">Социальное</option>
                      <option value="reflection">Рефлексия</option>
                      <option value="therapy">Терапия</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Содержание *
                    </label>
                    <BlockNoteEditor
                      initialContent={content}
                      onChange={(newContent) => setContent(newContent)}
                      placeholder="Опишите, что произошло, что вы почувствовали..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full btn-primary inline-flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{saving ? 'Сохранение...' : 'Сохранить запись'}</span>
                  </button>
                </form>
              </div>

              {/* Список записей */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Ваши записи ({entries.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Загрузка записей...</p>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">У вас пока нет записей</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 
                            className="font-semibold text-gray-900 text-lg cursor-pointer hover:text-primary-600"
                            onClick={() => setSelectedEntry(entry)}
                          >
                            {entry.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {entry.activityType && (
                              <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                                {getActivityTypeLabel(entry.activityType)}
                              </span>
                            )}
                            <button
                              onClick={() => startEdit(entry)}
                              className="p-1 hover:bg-blue-50 rounded text-blue-600"
                              title="Редактировать"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-1 hover:bg-red-50 rounded text-red-600"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm mb-3 line-clamp-3">
                          <BlockNoteViewer content={entry.content} />
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(entry.createdAt).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Статистика */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                  Статистика
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Всего записей</span>
                    <span className="font-bold text-2xl text-gray-900">{entries.length}</span>
                  </div>
                </div>
              </div>

              {/* Совет */}
              <div className="card bg-green-50 border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  💡 Совет дня
                </h3>
                <p className="text-sm text-green-800">
                  Регулярное ведение дневника помогает лучше понять свои эмоции и отслеживать прогресс. 
                  Старайтесь делать записи ежедневно!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно просмотра записи */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEntry.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedEntry.createdAt).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {selectedEntry.activityType && (
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                        {getActivityTypeLabel(selectedEntry.activityType)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <BlockNoteViewer content={selectedEntry.content} />
              </div>
              <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
                <button
                  onClick={() => startEdit(selectedEntry)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(selectedEntry.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Удалить
                </button>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно редактирования записи */}
        {editingEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Редактировать запись</h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок *
                  </label>
                  <input
                    type="text"
                    value={editingEntry.title}
                    onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                    className="input-field"
                    placeholder="Заголовок записи"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип активности
                  </label>
                  <select
                    value={editingEntry.activityType || ''}
                    onChange={(e) => setEditingEntry({ ...editingEntry, activityType: e.target.value || null })}
                    className="input-field"
                  >
                    <option value="">Выберите тип</option>
                    <option value="activity">Активность</option>
                    <option value="practice">Практика</option>
                    <option value="social">Социальное</option>
                    <option value="reflection">Рефлексия</option>
                    <option value="therapy">Терапия</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Содержание *
                  </label>
                  <BlockNoteEditor
                    initialContent={editingEntry.content}
                    onChange={(newContent) => setEditingEntry({ ...editingEntry, content: newContent })}
                    placeholder="Опишите, что произошло..."
                  />
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

