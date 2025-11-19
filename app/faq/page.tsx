'use client'

import { useMemo } from 'react'
import Link from 'next/link'

const faqs = [
  {
    question: 'Что такое ПСТР Эксперт?',
    answer:
      'ПСТР Эксперт — специализированная платформа психологической поддержки для людей, переживших травматические события. Мы подключаем квалифицированных психологов, работающих с ПТСР, тревогой и другими трудностями, чтобы сделать профессиональную помощь доступной каждому.',
  },
  {
    question: 'Кто будет мне помогать?',
    answer:
      'После регистрации мы предложим специалистов, которые соответствуют вашим запросам и предпочтениям. Вы всегда можете выбрать другого психолога, если чувствуете, что текущий не подходит.',
  },
  {
    question: 'Кто такие специалисты на платформе?',
    answer:
      'Все специалисты проходят тщательную проверку, имеют высшее профильное образование и опыт работы от 3 лет. Многие из них специализируются на травмотерапии, работе с тревогой и кризисными состояниями.',
  },
  {
    question: 'Как проверяются специалисты?',
    answer:
      'Мы проверяем дипломы, сертификаты, подтверждение опыта и проводим собеседование с методистом. Менее трети специалистов проходят отбор.',
  },
  {
    question: 'Подходит ли мне ПСТР Эксперт?',
    answer:
      'Платформа подойдёт, если вы хотите улучшить качество жизни и справиться с психологическими трудностями (ПТСР, стресс, тревога, конфликты). Она не заменяет экстренную помощь, психиатра или очную терапию при острых состояниях.',
  },
  {
    question: 'Сколько стоят услуги?',
    answer:
      'Средняя стоимость консультации — 2000–5000 ₽ в зависимости от квалификации и формата. Уточнить цену можно в профиле специалиста; для некоторых категорий есть льготы.',
  },
  {
    question: 'Может ли ПСТР Эксперт заменить очную терапию?',
    answer:
      'Онлайн-консультации эффективны во многих случаях, но психологи не ставят диагнозы и не выписывают рецепты. При необходимости они рекомендуют обратиться к врачу.',
  },
  {
    question: 'Я зарегистрировался. Как быстро мне подберут специалиста?',
    answer:
      'Подбор занимает от нескольких часов до одного рабочего дня. Первую консультацию обычно назначают в течение 2–3 дней.',
  },
  {
    question: 'Как проходят консультации?',
    answer:
      'Доступны онлайн-видео, телефон, очные встречи (если специалист в вашем городе) и текстовые форматы. Сессия длится 50–60 минут, частота подбирается индивидуально.',
  },
  {
    question: 'Конфиденциальность и безопасность данных',
    answer:
      'Мы используем шифрование данных, соблюдаем требования законодательства и профессионального кодекса. Психологи не раскрывают информацию без вашего согласия, кроме случаев, предусмотренных законом.',
  },
  {
    question: 'Что делать, если специалист мне не подходит?',
    answer:
      'Вы можете в любой момент запросить замену через поддержку. Мы поможем подобрать другого специалиста с подходящим опытом.',
  },
  {
    question: 'Нужно ли направление от врача?',
    answer:
      'Нет, направление не требуется. Если у вас есть диагноз или вы принимаете препараты, сообщите об этом психологу на первой встрече.',
  },
  {
    question: 'Поддержка для участников СВО и их семей',
    answer:
      'Для участников СВО и их семей действуют специальные программы с льготными условиями и приоритетным подбором специалистов, знакомых с боевой травмой.',
  },
  {
    question: 'Не нашли ответ на свой вопрос?',
    answer:
      'Свяжитесь с нашей службой поддержки — мы ответим в течение одного рабочего дня.',
  },
]

export default function FAQPage() {
  const groupedFaqs = useMemo(() => {
    const midpoint = Math.ceil(faqs.length / 2)
    return [faqs.slice(0, midpoint), faqs.slice(midpoint)]
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden text-white" style={{ backgroundImage: 'linear-gradient(120deg, rgba(5,5,5,0.8), rgba(5,5,5,0.65)), url(/assets/peaceful-meadow.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container-custom py-16 relative z-10">
          <p className="uppercase tracking-[0.3em] text-emerald-100 text-xs font-semibold mb-4">поддержка</p>
          <h1 className="text-4xl md:text-5xl font-bold">Часто задаваемые вопросы</h1>
          <p className="text-lg text-emerald-50/90 max-w-3xl mt-4">
            Разобрали самые популярные вопросы о платформе ПТСР Эксперт. Если вы не нашли нужный ответ, напишите нам — мы поможем.
          </p>
          <Link href="/contact" className="inline-flex mt-6 items-center gap-2 rounded-full bg-white/10 border border-white/30 px-6 py-3 text-sm font-semibold">
            Связаться с поддержкой
          </Link>
        </div>
        <div className="absolute inset-0 bg-black/25" />
      </section>

      <section className="container-custom py-16 space-y-10">
        <div className="flex flex-col md:flex-row gap-8">
          {groupedFaqs.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 space-y-4">
              {column.map((faq) => (
                <details key={faq.question} className="group border border-slate-100 rounded-2xl bg-white shadow-sm open:shadow-lg transition">
                  <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                    <span className="text-emerald-600 text-sm group-open:hidden">+</span>
                    <span className="text-emerald-600 text-sm hidden group-open:inline">–</span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
