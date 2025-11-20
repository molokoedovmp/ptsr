'use client'

import Link from 'next/link'
import { useState } from 'react'
import { anxietyTests, getAnxietyTestBySlug } from '@/data/anxietyTests'
import { Calendar, FileText } from 'lucide-react'

export default function AnxietyTestsPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const selectedTest = activeTest ? getAnxietyTestBySlug(activeTest) : undefined

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundImage: 'linear-gradient(120deg, rgba(5,5,5,0.85), rgba(5,5,5,0.6)), url(/assets/peaceful-meadow.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container-custom py-16 relative z-10 space-y-4">
          <p className="uppercase tracking-[0.3em] text-emerald-100 text-xs font-semibold">оценка тревожности</p>
          <h1 className="text-4xl md:text-5xl font-bold">Оценка уровня тревоги</h1>
          <p className="text-lg text-emerald-50/90 max-w-3xl">
            Выберите стандартизированный опросник, чтобы оценить текущий уровень тревоги. Результаты сохранятся в вашем личном кабинете, и вы сможете отслеживать динамику.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/faq" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white">
              Зачем нужны тесты?
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full bg-white text-emerald-700 px-6 py-3 text-sm font-semibold">
              Связаться с психологом
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/25" />
      </section>

      <section className="container-custom py-16 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {anxietyTests.map((test) => (
            <div key={test.slug} className="rounded-3xl border border-slate-100 shadow-sm bg-white p-8 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{test.subtitle}</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{test.title}</h2>
                </div>
                <span className="text-sm text-slate-500">{test.duration}</span>
              </div>
              <p className="text-slate-600">{test.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {test.questionsCount} вопросов
                </span>
                <span className="inline-flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  {test.footnote}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/anxiety-tests/${test.slug}`} className="btn-primary px-6 py-3 text-sm rounded-full">
                  Пройти тест
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveTest(test.slug)}
                  className="text-emerald-600 font-semibold text-sm flex items-center gap-2"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{selectedTest.subtitle}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{selectedTest.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTest(null)}
                className="text-sm font-semibold text-slate-500"
              >
                Закрыть ✕
              </button>
            </div>
            <p className="text-slate-700">{selectedTest.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Длительность:</span> {selectedTest.duration}</p>
              <p><span className="font-semibold text-slate-900">Вопросов:</span> {selectedTest.questionsCount}</p>
              {selectedTest.application && (
                <p><span className="font-semibold text-slate-900">Применение:</span> {selectedTest.application}</p>
              )}
              {selectedTest.reliability && (
                <p><span className="font-semibold text-slate-900">Надёжность:</span> {selectedTest.reliability}</p>
              )}
            </div>
            {selectedTest.footnote && (
              <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">{selectedTest.footnote}</p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/anxiety-tests/${selectedTest.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-6 py-3 text-sm font-semibold"
              >
                Начать тест
              </Link>
              <button
                type="button"
                onClick={() => setActiveTest(null)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
