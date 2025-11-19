'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, User, Phone, AlertCircle, FileText, GraduationCap, Brain } from 'lucide-react'

export default function RegisterPsychologistPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    specialization: '',
    experienceYears: '',
    education: '',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    setLoading(true)

    try {
      const response = await fetch('/api/psychologist-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experienceYears: parseInt(formData.experienceYears),
          education: formData.education,
          message: formData.message,
       }),
     })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка при отправке заявки')
      }

      setSuccess('Заявка отправлена. Мы свяжемся с вами после проверки.')
      setFormData({
        email: '',
        fullName: '',
        phone: '',
        specialization: '',
        experienceYears: '',
        education: '',
        message: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Регистрация психолога</h2>
            <p className="text-gray-600 mt-2">
              Присоединяйтесь к нашей команде специалистов
            </p>
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            <p className="text-sm">
              <strong>Как это работает:</strong> вы заполняете заявку, администратор проверяет данные и отправляет письмо с
              ссылкой для подтверждения регистрации. После перехода по ссылке можно создать пароль и войти как психолог.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Полное имя *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="Иван Иванов"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Телефон *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="+7 (999) 999-99-99"
                />
              </div>
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Специализация *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Травма, ПТСР, Тревожные расстройства"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
                  Опыт работы (лет) *
                </label>
                <input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="5"
                />
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                  Образование *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="education"
                    name="education"
                    type="text"
                    value={formData.education}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="МГУ"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Дополнительная информация
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="input-field"
                placeholder="Расскажите о себе, опыте, готовности работать онлайн..."
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Я согласен с{' '}
                <Link href="/privacy-policy" className="text-green-600 hover:text-green-700">
                  Политикой конфиденциальности
                </Link>
                {' '}и подтверждаю достоверность предоставленной информации
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться как психолог'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-700">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
