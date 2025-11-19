'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-custom space-y-12">
        <section
          className="relative overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] text-white p-12 text-center border border-white/30"
          style={{
            backgroundImage: 'linear-gradient(110deg, rgba(5,5,5,0.8), rgba(5,5,5,0.6)), url(/assets/peaceful-meadow.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100 mb-3">Поддержка ПТСР Эксперт</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Свяжитесь с нашей командой</h1>
            <p className="text-lg text-emerald-50/90 max-w-3xl mx-auto">
              Мы внимательно относимся к каждому запросу. Расскажите о своём вопросе — специалисты поддержки ответят в течение одного рабочего дня.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Часто задаваемые вопросы
              </Link>
              <Link
                href="#contact-form"
                className="inline-flex items-center justify-center rounded-full bg-white text-emerald-700 px-6 py-3 text-sm font-semibold"
              >
                Написать нам
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: 'Email',
                description: 'support@ptsr-expert.ru',
                href: 'mailto:support@ptsr-expert.ru',
                footer: 'Ответ в течение 24 часов',
              },
              {
                icon: <Phone className="w-6 h-6" />,
                title: 'Телефон',
                description: '8 (800) 123-45-67',
                href: 'tel:+78001234567',
                footer: 'Пн-Пт • 9:00–18:00 (МСК)',
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Офис',
                description: 'Москва, ул. Большая Никитская, 25',
                href: 'https://yandex.ru/maps',
                footer: 'Приём по предварительной записи',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/70 bg-white/90 backdrop-blur px-6 py-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-brand-teal">{item.icon}</div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
                    <a href={item.href} className="block text-xl font-semibold text-slate-900 hover:text-brand-teal">
                      {item.description}
                    </a>
                    <p className="text-sm text-slate-500 mt-1">{item.footer}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white p-6 shadow-lg">
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">Срочная поддержка</p>
              <h3 className="text-2xl font-semibold my-3 leading-tight">Нужна помощь прямо сейчас?</h3>
              <p className="text-sm text-white/90 mb-4">Позвоните на круглосуточную линию — дежурный психолог ответит в течение нескольких минут.</p>
              <a href="tel:+78001234567" className="inline-flex items-center gap-2 text-lg font-semibold">
                <Phone className="w-5 h-5" />
                8 (800) 123-45-67
              </a>
            </div>
          </div>

          <div id="contact-form" className="lg:col-span-3">
            <div className="rounded-[32px] bg-white border border-white/80 shadow-2xl p-8 backdrop-blur">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-500 mb-2">Форма обратной связи</p>
                <h2 className="text-3xl font-bold text-slate-900">Напишите нам</h2>
              </div>

              {submitted && (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-emerald-700">
                  Спасибо за сообщение! Команда поддержки свяжется с вами по указанной почте.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="space-y-2 text-sm font-medium text-slate-600">
                    <span>Полное имя</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
                      placeholder="Михаил Молокоедов"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-600">
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
                      placeholder="you@email.com"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>Тема обращения</span>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
                  >
                    <option value="">Выберите тему</option>
                    <option value="general">Общий вопрос</option>
                    <option value="technical">Техническая поддержка</option>
                    <option value="consultation">Консультации и специалисты</option>
                    <option value="programs">Обучающие программы</option>
                    <option value="other">Другое</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>Сообщение</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 resize-none"
                    placeholder="Опишите ваш запрос или проблему..."
                  />
                </label>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 text-white font-semibold shadow-lg shadow-brand-teal/40 hover:bg-brand-teal/90 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  <span>Отправить сообщение</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
