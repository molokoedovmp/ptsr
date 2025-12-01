'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import { useEffect, useState } from 'react'

type AnxietyResult = {
  id: string
  testTitle: string
  score: number
  maxScore: number
  severity: string
  completedAt: string
}

export default function ProfileTestsPage() {
  const [results, setResults] = useState<AnxietyResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/anxiety-tests/results')
        if (response.ok) {
          const json = await response.json()
          setResults(json.results || [])
        }
      } catch (error) {
        console.error('Failed to load results', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6">
            <UserSidebar />
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">Результаты тестирования</h1>
                <p className="text-slate-600 mt-2">История прохождения тестов тревожности и оценок состояния</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                {loading ? (
                  <p className="text-slate-500 text-sm">Загрузка результатов...</p>
                ) : results.length === 0 ? (
                  <p className="text-slate-500 text-sm">Вы ещё не проходили тесты. Начните с GAD-7 в разделе «Оценка тревожности».</p>
                ) : (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div key={result.id} className="border border-slate-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{result.testTitle}</p>
                          <p className="text-slate-900 font-semibold">{result.severity}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(result.completedAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            {result.score}/{result.maxScore}
                          </p>
                          <p className="text-sm text-slate-500">баллов</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
