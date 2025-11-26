import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Users, Award, Phone } from 'lucide-react'
import { prisma } from '@/lib/prisma'

interface SpecialistPageProps {
  params: { id: string }
}

export default async function SpecialistDetailPage({ params }: SpecialistPageProps) {
  const psychologist = await prisma.psychologistProfile.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
          email: true,
          phone: true,
        },
      },
      slots: {
        where: { status: 'AVAILABLE', startTime: { gte: new Date() } },
        orderBy: { startTime: 'asc' },
        take: 6,
      },
    },
  })

  if (!psychologist) {
    notFound()
  }

  const stats = [
    { label: 'Опыт', value: `${psychologist.experienceYears}+ лет`, icon: <Award className="w-5 h-5" /> },
    { label: 'Стоимость', value: `${psychologist.price.toLocaleString()} ₽`, icon: <Clock className="w-5 h-5" /> },
    { label: 'Клиентов в работе', value: psychologist.available ? 'Принимает' : 'Нет записи', icon: <Users className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden text-white" style={{ backgroundImage: 'linear-gradient(120deg, rgba(5,5,5,0.85), rgba(5,5,5,0.65)), url(/assets/peaceful-meadow.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container-custom py-16 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">специалист платформы</p>
            <h1 className="text-4xl md:text-5xl font-bold">{psychologist.user.fullName ?? 'Имя не указано'}</h1>
            <p className="text-emerald-50/90">
              {psychologist.bio ||
                'Специалист по работе с посттравматическим стрессом, тревожными расстройствами и кризисными состояниями. Сопровождает клиентов на каждом этапе восстановления.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialization.map((spec) => (
                <span key={spec} className="px-3 py-1 text-sm rounded-full border border-white/40">
                  {spec}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`/specialists/${psychologist.id}/book`} className="inline-flex items-center rounded-full bg-white text-emerald-700 px-6 py-3 text-sm font-semibold">
                Записаться на консультацию
              </Link>
              <Link href="/faq" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white">
                Частые вопросы
              </Link>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/30 p-6 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-emerald-50/80">
                    {stat.icon}
                    <span>{stat.label}</span>
                  </div>
                  <span className="font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
            {psychologist.user.phone && (
              <a href={`tel:${psychologist.user.phone}`} className="inline-flex items-center gap-2 text-sm text-white/80">
                <Phone className="w-4 h-4" />
                {psychologist.user.phone}
              </a>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/25" />
      </section>

      <section className="container-custom py-16 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-100 p-8 shadow-sm bg-white">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">О специалисте</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {psychologist.bio ||
                  'Психолог практикует индивидуальные консультации, использует техники КПТ, травмофокусированную терапию и методики эмоциональной стабилизации. Работает с ПТСР, тревогой, кризисами и семейными ситуациями.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Образование</p>
                  <p>{psychologist.education}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Языки</p>
                  <p>{psychologist.languages.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 p-8 shadow-sm bg-white">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Доступные консультации</h2>
              {psychologist.slots.length === 0 ? (
                <p className="text-slate-600">Пока нет свободных слотов. Оставьте заявку — мы сообщим, когда появятся новые.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {psychologist.slots.map((slot) => (
                    <div key={slot.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50 flex flex-col gap-3">
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(slot.startTime).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {new Date(slot.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} —{' '}
                        {new Date(slot.endTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <Link
                        href={`/specialists/${psychologist.id}/book?slotId=${slot.id}`}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Выбрать слот
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 p-6 bg-slate-50 shadow-inner">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">С какими запросами работает</h3>
              {psychologist.specialization.length ? (
                <ul className="space-y-2 text-slate-600 text-sm">
                  {psychologist.specialization.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Специалист пока не заполнил специализации.</p>
              )}
            </div>
            <div className="rounded-3xl border border-emerald-200 p-6 bg-gradient-to-b from-emerald-50 to-white">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Готовы к консультации?</h3>
              <p className="text-slate-600 text-sm mb-4">Запишитесь на встречу — выберите удобное время и опишите свой запрос. Вся информация конфиденциальна.</p>
              <Link
                href={`/specialists/${psychologist.id}/book`}
                className="block text-center rounded-full bg-emerald-600 text-white font-semibold px-4 py-2"
              >
                Записаться
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
