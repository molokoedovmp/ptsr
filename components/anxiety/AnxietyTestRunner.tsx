'use client'

import { useMemo, useState } from 'react'
import { AnxietyTestDefinition } from '@/data/anxietyTests'
import Link from 'next/link'

interface Props {
  test: AnxietyTestDefinition
}

type AnswerState = Record<string, number>

export default function AnxietyTestRunner({ test }: Props) {
  const [answers, setAnswers] = useState<AnswerState>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; severity: string; description: string } | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  const maxScore = test.questions.length * test.maxOptionValue

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateScore = () => {
    return test.questions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0)
  }

  const determineSeverity = (score: number) => {
    return (
      test.severityLevels.find((level) => score >= level.min && score <= level.max) ?? test.severityLevels[test.severityLevels.length - 1]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (answeredCount < test.questions.length) {
      setError('Пожалуйста, ответьте на все вопросы, чтобы получить результат.')
      return
    }

    const score = calculateScore()
    const severity = determineSeverity(score)

    setSubmitting(true)
    try {
      const response = await fetch('/api/anxiety-tests/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testSlug: test.slug,
          testTitle: test.title,
          score,
          maxScore,
          severity: severity.label,
          answers,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Нужно войти в аккаунт, чтобы сохранить результат')
        }
        const body = await response.json()
        throw new Error(body.error || 'Не удалось сохранить результат')
      }

      setResult({ score, severity: severity.label, description: severity.description })
      setAnswers({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-[32px] border border-slate-100 shadow-2xl bg-white p-8 space-y-8">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 justify-between">
        <div className="flex flex-wrap gap-4">
          <span>Длительность: {test.duration}</span>
          <span>Вопросов: {test.questionsCount}</span>
          {test.reliability && <span>Надёжность: {test.reliability}</span>}
          {test.application && <span>Область применения: {test.application}</span>}
        </div>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="text-sm font-semibold text-emerald-600 underline underline-offset-4"
        >
          Подробнее о тесте
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {test.questions.map((question, index) => (
          <div key={question.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
            <p className="font-semibold text-slate-900 mb-3">
              {index + 1}. {question.text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((option) => (
                <label key={option.label} className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer ${answers[question.id] === option.value ? 'border-emerald-500 bg-white' : 'border-slate-200 bg-white/70'}`}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => handleAnswerChange(question.id, option.value)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-full bg-emerald-600 text-white font-semibold px-6 py-4 shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Сохранение...' : 'Завершить и сохранить результат'}
        </button>

        <p className="text-xs text-slate-500">
          Результаты носят ознакомительный характер и не заменяют консультацию с психологом. При высоких показателях тревожности обратитесь к специалисту.
        </p>
      </form>
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">результат сохранён</p>
            <p className="text-2xl font-semibold text-slate-900">
              {result.score} из {maxScore} — {result.severity}
            </p>
            <p className="text-slate-600 text-sm">{result.description}</p>
            <div className="flex flex-col gap-3">
              <Link href="/profile/tests" className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white font-semibold px-6 py-3">
                Перейти к результатам тестирования
              </Link>
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}

      {infoOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full space-y-4 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{test.subtitle}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{test.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="text-sm font-semibold text-slate-500"
              >
                Закрыть ✕
              </button>
            </div>
            <p className="text-slate-700">{test.description}</p>
            {test.application && (
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">Применение:</span> {test.application}
              </p>
            )}
            {test.reliability && (
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">Надёжность:</span> {test.reliability}
              </p>
            )}
            {test.footnote && (
              <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">{test.footnote}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
