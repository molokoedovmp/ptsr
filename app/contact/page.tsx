'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // В реальном приложении здесь будет отправка данных
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="section-title">Свяжитесь с нами</h1>
          <p className="section-subtitle">
            Мы всегда рады ответить на ваши вопросы
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Контактная информация */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:support@ptsr-expert.ru"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    support@ptsr-expert.ru
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Телефон</h3>
                  <a
                    href="tel:+78001234567"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    8 (800) 123-45-67
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Пн-Пт: 9:00 - 18:00 (МСК)
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Адрес</h3>
                  <p className="text-gray-600">
                    г. Москва, Россия
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-primary-50 border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Срочная помощь
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Если вам нужна срочная психологическая помощь, позвоните:
              </p>
              <a
                href="tel:+78001234567"
                className="text-lg font-bold text-primary-600 hover:text-primary-700"
              >
                8 (800) 123-45-67
              </a>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Отправить сообщение
              </h2>

              {submitted && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Тема обращения *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Выберите тему</option>
                    <option value="general">Общий вопрос</option>
                    <option value="technical">Техническая поддержка</option>
                    <option value="consultation">Вопрос о консультации</option>
                    <option value="programs">Вопрос о программах</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Опишите ваш вопрос или проблему..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary inline-flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Отправить сообщение</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ секция */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Как записаться на консультацию?
              </h3>
              <p className="text-gray-600">
                Зарегистрируйтесь на платформе, выберите подходящего специалиста и забронируйте удобное время в его расписании.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Сколько стоят ваши услуги?
              </h3>
              <p className="text-gray-600">
                Стоимость консультаций варьируется от 2500₽ до 3500₽ в зависимости от опыта специалиста. Образовательные программы стоят от 12000₽ до 20000₽.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Конфиденциальны ли консультации?
              </h3>
              <p className="text-gray-600">
                Да, все консультации строго конфиденциальны. Мы соблюдаем профессиональную этику и защищаем ваши личные данные.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

