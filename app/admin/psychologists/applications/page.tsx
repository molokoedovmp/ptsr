'use client'

import { useEffect, useState } from 'react'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react'
import { ApplicationStatus } from '@prisma/client'

interface Application {
  id: string
  fullName: string
  email: string
  phone: string
  specialization: string
  experienceYears: number
  education: string
  inviteCode?: string | null
  message?: string | null
  status: ApplicationStatus
  createdAt: string
}

const statusLabels: Record<ApplicationStatus, { label: string; color: string }> = {
  PENDING: { label: 'На рассмотрении', color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Одобрена (ожидает подтверждения)', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Отклонена', color: 'bg-red-100 text-red-700' },
  ACTIVATED: { label: 'Активирован', color: 'bg-emerald-100 text-emerald-700' },
}

export default function PsychologistApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/psychologist-applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      const response = await fetch(`/api/admin/psychologist-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const pendingApplications = applications.filter((app) => app.status === 'PENDING')

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
        </div>
      </AdminProtectedRoute>
    )
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex gap-6">
            <AdminSidebar />
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <ClipboardList className="w-8 h-8 text-brand-teal" />
                  Заявки психологов
                </h1>
                <p className="text-gray-600 mt-2">Новных заявок: {pendingApplications.length}</p>
              </div>

              {pendingApplications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Пока нет заявок</h3>
                  <p className="text-gray-600">Как только психолог отправит заявку, она появится здесь.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApplications.map((application) => (
                    <div key={application.id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold text-gray-900">{application.fullName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[application.status].color}`}>
                              {statusLabels[application.status].label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{application.email} · {application.phone}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Специализация: {application.specialization} · Опыт: {application.experienceYears} лет
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(application.id, 'APPROVED')}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle className="w-4 h-4" /> Одобрить
                          </button>
                          <button
                            onClick={() => updateStatus(application.id, 'REJECTED')}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" /> Отклонить
                          </button>
                          <button
                            onClick={() => updateStatus(application.id, 'PENDING')}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            <Clock className="w-4 h-4" /> В ожидании
                          </button>
                        </div>
                      </div>
                      {application.message && (
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 text-sm text-slate-700">
                          {application.message}
                        </div>
                      )}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <p><span className="font-semibold text-slate-900">Образование:</span> {application.education}</p>
                        {application.inviteCode && (
                          <p><span className="font-semibold text-slate-900">Код приглашения:</span> {application.inviteCode}</p>
                        )}
                        <p><span className="font-semibold text-slate-900">Отправлено:</span> {new Date(application.createdAt).toLocaleString('ru-RU')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
