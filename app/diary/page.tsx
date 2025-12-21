'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { BookOpen, Plus, Calendar, Trash2, Edit, X } from 'lucide-react'

export const dynamic = 'force-dynamic'

const BlockNoteEditor = dynamicImport(() => import('@/components/editor/BlockNoteEditor'), {
  ssr: false,
})
const BlockNoteViewer = dynamicImport(() => import('@/components/editor/BlockNoteViewer'), {
  ssr: false,
})

interface DiaryEntry {
  id: string
  title: string
  content: string
  activityType: string | null
  createdAt: string
}

interface ActivityLog {
  id: string
  path: string
  title: string | null
  createdAt: string
}

export default function DiaryPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [activityType, setActivityType] = useState('')
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchEntries()
    fetchActivityLogs()
  }, [])

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/user/activity-log')
      if (response.ok) {
        const data = await response.json()
        setActivityLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

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
        setShowCreateForm(false)
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
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Боковая панель */}
            <UserSidebar />

            {/* Основной контент */}
            <div className="flex-1">
              {/* Заголовок */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Дневник активности</h1>
                  <p className="text-gray-600 mt-2">
                    Записывайте важные события и рефлексируйте о своём дне
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Создать запись</span>
                </button>
              </div>

              
            </div>
          </div>

          {/* Модальное окно создания записи */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Новая запись</h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setTitle('')
                      setContent('')
                      setActivityType('')
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setTitle('')
                        setContent('')
                        setActivityType('')
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
                        <span className="px-2 py-1 bg-brand-teal/10 text-brand-teal text-xs font-medium rounded">
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип активности
                    </label>
                    <select
                      value={editingEntry.activityType || ''}
                      onChange={(e) => setEditingEntry({ ...editingEntry, activityType: e.target.value })}
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
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="px-6 py-3 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 disabled:opacity-50"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
