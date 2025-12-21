'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamicImport from 'next/dynamic'
import PsychologistProtectedRoute from '@/components/psychologist/PsychologistProtectedRoute'
import { ArrowLeft, FileText, Save } from 'lucide-react'

export const dynamic = 'force-dynamic'

const BlockNoteEditor = dynamicImport(() => import('@/components/editor/BlockNoteEditor'), {
  ssr: false,
})

const categoryOptions = [
  { value: 'SYMPTOMS', label: 'Симптомы' },
  { value: 'METHODS', label: 'Методы лечения' },
  { value: 'SELF_HELP', label: 'Самопомощь' },
  { value: 'STORIES', label: 'Истории' },
  { value: 'NEWS', label: 'Новости' },
]

export default function PsychologistNewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    displayAuthor: '',
    readingMinutes: '',
    sourceTitle: '',
    sourceUrl: '',
    publishedAt: '',
  })

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[а-яё]/gi, (char) => {
        const map: Record<string, string> = {
          а: 'a',
          б: 'b',
          в: 'v',
          г: 'g',
          д: 'd',
          е: 'e',
          ё: 'yo',
          ж: 'zh',
          з: 'z',
          и: 'i',
          й: 'y',
          к: 'k',
          л: 'l',
          м: 'm',
          н: 'n',
          о: 'o',
          п: 'p',
          р: 'r',
          с: 's',
          т: 't',
          у: 'u',
          ф: 'f',
          х: 'h',
          ц: 'ts',
          ч: 'ch',
          ш: 'sh',
          щ: 'sch',
          ъ: '',
          ы: 'y',
          ь: '',
          э: 'e',
          ю: 'yu',
          я: 'ya',
        }
        return map[char.toLowerCase()] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/psychologist/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          readingMinutes: formData.readingMinutes ? Number(formData.readingMinutes) : null,
          publishedAt: formData.publishedAt || null,
          tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          faq: faqs.filter((f) => f.question && f.answer),
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Ошибка создания статьи')
      alert('Черновик сохранен. Отправьте его на модерацию после редактирования.')
      router.push('/psychologist/articles')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PsychologistProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-4">
              <Link
                href="/psychologist/dashboard"
                className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> В кабинет
              </Link>
              <Link
                href="/psychologist/articles"
                className="inline-flex items-center px-4 py-2 rounded-full text-brand-teal border border-brand-teal/30 bg-brand-teal/5 hover:bg-brand-teal/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> К списку статей
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-emerald-600" />
              Новая статья
            </h1>
            <p className="text-slate-600 mt-2">Сохраните черновик и отправьте его на модерацию редакции</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Заголовок *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  onBlur={generateSlug}
                  className="input-field"
                  placeholder="Название материала"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">URL (slug) *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="input-field"
                  placeholder="url-stati"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Краткое описание *</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">Содержание статьи *</label>
                <BlockNoteEditor
                  initialContent={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                  placeholder="Опишите ваш опыт, рекомендации и упражнения..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Категория *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Выберите категорию</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Автор (для отображения)</label>
                  <input
                    type="text"
                    value={formData.displayAuthor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, displayAuthor: e.target.value }))}
                    className="input-field"
                    placeholder="Например, Анна Петрова, психолог"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Теги</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    className="input-field"
                    placeholder="тег1, тег2, тег3"
                  />
                  <p className="text-xs text-slate-500 mt-1">Через запятую</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL обложки</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Время чтения (минуты)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.readingMinutes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, readingMinutes: e.target.value }))}
                    className="input-field"
                    placeholder="Например, 7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Дата публикации (если нужна)</label>
                  <input
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
                    className="input-field"
                  />
                  <p className="text-xs text-slate-500 mt-1">Оставьте пустым, если дата не нужна</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Источник (название)</label>
                  <input
                    type="text"
                    value={formData.sourceTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sourceTitle: e.target.value }))}
                    className="input-field"
                    placeholder="Например, название издания или автора"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ссылка на источник</label>
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sourceUrl: e.target.value }))}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">FAQ (вопрос–ответ)</label>
                  <button
                    type="button"
                    className="text-brand-teal text-sm font-medium"
                    onClick={() => setFaqs((prev) => [...prev, { question: '', answer: '' }])}
                  >
                    Добавить вопрос
                  </button>
                </div>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          setFaqs((prev) => prev.map((item, i) => (i === index ? { ...item, question: e.target.value } : item)))
                        }
                        className="input-field"
                        placeholder="Вопрос"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) =>
                          setFaqs((prev) => prev.map((item, i) => (i === index ? { ...item, answer: e.target.value } : item)))
                        }
                        className="input-field"
                        rows={2}
                        placeholder="Ответ"
                      />
                      {faqs.length > 1 && (
                        <div className="text-right">
                          <button
                            type="button"
                            className="text-sm text-red-600 hover:text-red-700"
                            onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}
                          >
                            Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary inline-flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>{loading ? 'Сохранение...' : 'Сохранить черновик'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </PsychologistProtectedRoute>
  )
}
