'use client'

import { useState } from 'react'
import { AlertCircle, HelpCircle, Send } from 'lucide-react'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium',
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
      setFormData({ subject: '', priority: 'medium', message: '' })
    }, 3000)
  }

  const faqItems = [
    {
      question: 'Как сбросить пароль?',
      answer: 'Перейдите на страницу входа и нажмите "Забыли пароль?". Следуйте инструкциям в письме.',
    },
    {
      question: 'Как изменить информацию в профиле?',
      answer: 'Войдите в свой профиль и нажмите "Редактировать профиль". Внесите изменения и сохраните.',
    },
    {
      question: 'Как записаться на консультацию?',
      answer: 'Перейдите в раздел "Специалисты", выберите психолога и нажмите "Записаться".',
    },
    {
      question: 'Как получить сертификат о прохождении курса?',
      answer: 'Сертификат автоматически становится доступен после завершения всех модулей программы.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="section-title">Служба поддержки</h1>
          <p className="section-subtitle">
            Мы здесь, чтобы помочь вам с любыми вопросами
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Форма обращения */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Создать обращение
            </h2>

            {submitted && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Ваше обращение отправлено! Мы свяжемся с вами в ближайшее время.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Тема обращения *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Опишите проблему кратко"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание проблемы *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Подробно опишите вашу проблему или вопрос..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary inline-flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Отправить обращение</span>
              </button>
            </form>
          </div>

          {/* Информация */}
          <div className="space-y-6">
            {/* Срочная помощь */}
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Нужна срочная помощь?
                  </h3>
                  <p className="text-red-800 text-sm mb-3">
                    Если вы находитесь в кризисной ситуации, немедленно позвоните:
                  </p>
                  <a
                    href="tel:+78001234567"
                    className="text-lg font-bold text-red-600 hover:text-red-700"
                  >
                    8 (800) 123-45-67
                  </a>
                  <p className="text-xs text-red-700 mt-2">
                    Горячая линия доступна 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Время ответа */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">
                Время ответа
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Низкий приоритет:</span>
                  <span className="font-medium">2-3 рабочих дня</span>
                </li>
                <li className="flex justify-between">
                  <span>Средний приоритет:</span>
                  <span className="font-medium">24 часа</span>
                </li>
                <li className="flex justify-between">
                  <span>Высокий приоритет:</span>
                  <span className="font-medium">4-6 часов</span>
                </li>
              </ul>
            </div>

            {/* Альтернативные способы связи */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">
                Другие способы связи
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <a href="mailto:support@ptsr-expert.ru" className="text-primary-600 hover:text-primary-700 ml-2">
                    support@ptsr-expert.ru
                  </a>
                </div>
                <div>
                  <span className="text-gray-600">Telegram:</span>
                  <a href="#" className="text-primary-600 hover:text-primary-700 ml-2">
                    @ptsr_support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

