'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/UserSidebar'
import {
  Award,
  Download,
  Calendar,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

interface Certificate {
  id: string
  courseTitle: string
  courseSlug: string
  completionDate: string | null
  certificateUrl: string | null
  durationWeeks: number
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (!response.ok) {
        throw new Error('Failed to fetch certificates')
      }
      const data = await response.json()
      setCertificates(data.certificates || [])
    } catch (error) {
      console.error('Error loading certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = async (enrollmentId: string) => {
    setGeneratingId(enrollmentId)
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка генерации сертификата')
      }

      await fetchCertificates()
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert(error instanceof Error ? error.message : 'Ошибка генерации сертификата')
    } finally {
      setGeneratingId(null)
    }
  }

  const formatDuration = (weeks: number) => {
    if (weeks === 1) return '1 неделя'
    if (weeks >= 2 && weeks <= 4) return `${weeks} недели`
    return `${weeks} недель`
  }

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return 'Дата уточняется'
    return new Date(isoDate).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const renderEmptyState = () => (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Award className="w-12 h-12 text-yellow-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        У вас пока нет сертификатов
      </h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Завершите курс, чтобы получить сертификат о прохождении обучения. Сертификаты подтверждают ваши достижения и прогресс.
      </p>
      <Link
        href="/my-courses"
        className="inline-flex items-center gap-2 bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Перейти к курсам
      </Link>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6">
            <UserSidebar />

            <div className="flex-1">
              <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-slate-900">Мои сертификаты</h1>
                  <p className="text-slate-600 mt-2">
                    Цифровые подтверждения завершённых программ
                  </p>
                </div>
                <Link
                  href="/my-courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-teal hover:text-brand-teal transition-colors"
                >
                  Вернуться к курсам
                </Link>
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-teal mx-auto"></div>
                </div>
              ) : certificates.length === 0 ? (
                renderEmptyState()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">{cert.courseTitle}</h3>
                              <div className="flex items-center text-sm text-slate-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(cert.completionDate)}
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/learn/${cert.courseSlug}?view=completed`}
                            className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal hover:text-brand-teal/80"
                          >
                            Уроки
                          </Link>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Продолжительность программы: {formatDuration(cert.durationWeeks)}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                          href={`/learn/${cert.courseSlug}?view=completed`}
                          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-teal hover:text-brand-teal transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          К материалам
                        </Link>
                        {cert.certificateUrl ? (
                          <a
                            href={cert.certificateUrl}
                            download={`certificate-${cert.courseSlug}.pdf`}
                            className="flex items-center justify-center gap-2 rounded-xl bg-brand-teal text-white px-4 py-2 text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Скачать PDF
                          </a>
                        ) : (
                          <button
                            onClick={() => handleGenerateCertificate(cert.id)}
                            disabled={generatingId === cert.id}
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
                          >
                            {generatingId === cert.id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Генерация...
                              </>
                            ) : (
                              <>
                                <Award className="w-4 h-4" />
                                Получить сертификат
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
