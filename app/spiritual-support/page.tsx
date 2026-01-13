'use client'

import { useState } from 'react'
import { Heart, Book, Sparkles, HandHeart, Compass, Phone, Link as LinkIcon } from 'lucide-react'

type Tradition = {
  id: string
  name: string
  badge: string
  intro: string
  context: string
  practices: string[]
  prayers: { title: string; text: string }[]
  grounding: string
  supportTips: string[]
  resources: { title: string; url: string; note?: string }[]
}

const TRADITIONS: Tradition[] = [
  {
    id: 'christian',
    name: 'Христианство',
    badge: 'Псалмы и молитва',
    intro: 'Вернуться к ощущению опоры помогают короткие молитвы, чтение псалмов и разговор с духовником.',
    context: 'Если волнения вспыхивают волнами, выделите 5–10 минут тишины: зафиксируйте дыхание, вслух назовите, что волнует, и отдайте это в молитве. Затем выберите один посильный шаг — позвонить близкому, сходить в храм, выпить воды, выйти на свет.',
    practices: [
      'Молитва дыханием: на вдохе «Господи», на выдохе «помилуй меня» 5–7 раз.',
      'Чтение Псалма 22 (23) или 90 вслух или прослушивание аудио.',
      'Запишите тревоги и отдайте их Богу в молитве, затем выберите один небольшой шаг на сегодня.',
      'Сделайте «молитвенную паузу»: остановитесь на минуту, сложите ладони и трижды повторите «Да будет воля Твоя».',
      'Короткая благодарность: назовите вслух три вещи, за которые благодарны, чтобы вернуть чувство опоры.',
    ],
    prayers: [
      { title: 'Молитва о мире', text: 'Господи, даруй мне мир принять то, что я не могу изменить, смелость изменить то, что могу, и мудрость отличить одно от другого.' },
      { title: 'Псалом 22 (фрагмент)', text: 'Господь — Пастырь мой; я ни в чем не буду нуждаться. Он покоит меня на злачных пажитях и водит меня к водам тихим.' },
    ],
    grounding: 'Сядьте, поставьте ноги на пол, медленно вдохните и на выдохе повторите «Со мной Бог». Сделайте так три раза, ощущая опору под стопами.',
    supportTips: [
      'Позвоните священнику или наставнику, попросите о личной беседе или исповеди.',
      'Согласуйте возможность молитвенной поддержки общины (молебен, записка).',
      'Если тяжело ехать в храм, попросите о звонке или онлайн-разговоре.',
    ],
    resources: [
      { title: 'Псалом 22 (23) и 90', url: 'https://azbyka.ru/molitvoslov/psalom-90', note: 'Текст и аудио псалмов' },
      { title: 'Молитва об исцелении', url: 'https://azbyka.ru/molitvoslov/molitva-o-zdorove', note: 'Сборник молитв о здравии' },
      { title: 'Найти храм', url: 'https://pravoslavie.ru/churches/', note: 'Карта православных приходов' },
    ],
  },
  {
    id: 'islam',
    name: 'Ислам',
    badge: 'Дуа и зикр',
    intro: 'Короткие дуа и зикр возвращают спокойствие. Важно помнить о милости Аллаха и обратиться за поддержкой к имаму.',
    context: 'Сведите внимание к дыханию и повторяйте дуа мягко, без напряжения. Если тревога поднимается, сделайте вуду, прочитайте несколько аятов и попросите близкого поддержать вас словом или присутствием.',
    practices: [
      'Зикр: «Хасби Аллаху ла илаха илла Ху» — повторите 33 раза, дыша медленно.',
      'Чтение суры «Аль-Ихляс», «Аль-Фаляк» и «Ан-Нас» для защиты и успокоения.',
      'Попросите близкого прочитать с вами «Аятуль Курси» и сделать дуа о мире и стойкости.',
      'Сделайте паузу на тасбих: 33 раза «Субханаллах», 33 раза «Альхамдулиллях», 34 раза «Аллаху Акбар».',
      'Запишите беспокоящие мысли и закончите фразой «Таваккальту аля Аллах» (уповаю на Аллаха).',
    ],
    prayers: [
      { title: 'Дуа при тревоге', text: 'Аллахумма инни а’узу бика мин аль-хамми валь-хузн. (О Аллах, прибегаю к Тебе от тревоги и печали).' },
      { title: 'Слова опоры', text: 'Ля хавля ва ля куввата илля биллях (Нет мощи и силы, кроме как с Аллахом).' },
    ],
    grounding: 'Положите руку на сердце, сделайте медленный вдох на 4 счёта и выдох на 6, проговаривая «Алхамдулиллях» на выдохе.',
    supportTips: [
      'Свяжитесь с имамом вашей мечети, узнайте о возможности личной беседы или дуа вместе.',
      'Попросите родных помочь добраться в мечеть или организовать онлайн-разговор.',
      'Если есть группа поддержки при мечети, договоритесь о встрече или созвоне.',
    ],
    resources: [
      { title: 'Аятуль Курси (2:255)', url: 'https://quran.com/255', note: 'Текст и перевод' },
      { title: 'Суры «Аль-Ихляс», «Аль-Фаляк», «Ан-Нас»', url: 'https://quran.com/112', note: 'Короткие суры для защиты' },
      { title: 'Поиск ближайшей мечети', url: 'https://umma.ru/contacts/', note: 'Контакты общин и имамов' },
    ],
  },
  {
    id: 'judaism',
    name: 'Иудаизм',
    badge: 'Теилим и шма',
    intro: 'Чтение Теилим (Псалмов), «Шма, Исраэль» и разговор с раввином помогают вернуть чувство защищенности.',
    context: 'Опирайтесь на привычный порядок: дыхание — Шма — Теилим — разговор с близким или раввином. Важно не оставаться одному с сильной тревогой: договоритесь о коротком звонке или встрече.',
    practices: [
      'Прочитайте Теилим 23 или 121 вслух, удерживая внимание на каждом слове.',
      'Шма, Исраэль: повторите несколько раз, замедляя дыхание.',
      'Напишите записку с тем, что отдаёте в руки Всевышнего, и назовите три вещи, за которые благодарны сегодня.',
      'Сделайте паузу на дыхание: вдох на 4, выдох на 6, проговаривая «Б-г со мной».',
      'Позвоните другу из общины и прочитайте короткий псалом вместе, чтобы услышать живой голос.',
    ],
    prayers: [
      { title: 'Теилим 121 (фрагмент)', text: 'Возвожу очи мои к горам: откуда придёт помощь моя? Помощь моя от Господа, сотворившего небо и землю.' },
      { title: 'Шма, Исраэль', text: 'Шма, Исраэль, Адонай Элохейнуу, Адонай Эхад.' },
    ],
    grounding: 'Сядьте, ощутите опору под спиной и стопами. На вдохе считайте до 4, на выдохе до 6, повторяя «Эхад».',
    supportTips: [
      'Позвоните раввину или координатору общины, попросите о встрече или созвоне.',
      'Если есть хевра кадиша или волонтеры, узнайте о возможности сопровождения.',
      'Попросите о чтении Теилим за ваше здоровье или участии в миньяне, если это возможно.',
    ],
    resources: [
      { title: 'Tehillim 23 на Sefaria', url: 'https://www.sefaria.org/Tehillim.23?lang=he-en' },
      { title: 'Шма, Исраэль', url: 'https://www.sefaria.org/Deuteronomy.6.4?lang=he-en', note: 'Текст и перевод' },
      { title: 'Поиск общины / синагоги', url: 'https://www.jewish.ru/ru/street/', note: 'Контакты и адреса' },
    ],
  },
  {
    id: 'buddhism',
    name: 'Буддизм',
    badge: 'Метта и дыхание',
    intro: 'Метта-медитация и внимательное дыхание помогают снизить тревогу и вернуть контакт с настоящим моментом.',
    context: 'Работайте через тело: найдите опору в стопах, смягчите плечи, дышите медленно. После нескольких циклов дыхания переходите к метта — сначала к себе, затем к другу, затем к нейтральному человеку.',
    practices: [
      'Метта: мысленно повторяйте «Пусть я буду в безопасности. Пусть буду спокоен. Пусть буду здоров».',
      'Осознанное дыхание: вдох на 4, выдох на 6, наблюдайте ощущения в теле.',
      'Мантра «Ом мани падме хум» — повторяйте на выдохе 3–5 минут, держа внимание в сердце.',
      'Практика «замечаю — называю — отпускаю»: отмечайте чувство («тревога»), называйте его и возвращайтесь к дыханию.',
      'Короткий бодисаттва-обет для опоры: вспомните, зачем вы хотите обрести спокойствие — чтобы помогать себе и другим.',
    ],
    prayers: [
      { title: 'Фраза метта', text: 'Пусть все существа будут свободны от страданий и причин страданий. Пусть будут здоровы, спокойны и защищены.' },
      { title: 'Короткая мантра', text: 'Ом мани падме хум.' },
    ],
    grounding: 'Обопритесь спиной о стул, почувствуйте контакт стоп с полом. Дышите медленно и мягко, называя вслух то, что видите, слышите и чувствуете.',
    supportTips: [
      'Свяжитесь с учителем или координатором вашего центра, попросите о совместной практике или наставлении.',
      'Уточните расписание ближайших медитаций или онлайн-ретритов поддержки.',
      'Попросите друга из сангхи пройти практику метта вместе по аудио/видео.',
    ],
    resources: [
      { title: 'Метта-медитация', url: 'https://www.lionsroar.com/how-to-practice-metta/', note: 'Краткое руководство' },
      { title: 'Ом мани падме хум', url: 'https://tricycle.org/article/om-mani-padme-hum/', note: 'Значение мантры' },
      { title: 'Поиск буддийских центров', url: 'https://fpmt.org/centers/', note: 'Каталог FPMT (англ.)' },
    ],
  },
  {
    id: 'secular',
    name: 'Без религиозной традиции',
    badge: 'Поддержка и осознанность',
    intro: 'Если вы не относите себя к определённой традиции, оперируйте простыми практиками присутствия, благодарности и общения с близкими.',
    context: 'Держите фокус на телесной опоре и маленьких действиях: вода, свет, движение, разговор. Любая практика — это не «правильно сделать», а дать себе передышку и опору.',
    practices: [
      'Дыхание 4–6: вдох на 4, выдох на 6, 10 циклов — это снижает напряжение.',
      'Практика «5-4-3-2-1»: назовите 5 предметов, которые видите, 4 звука, 3 ощущения, 2 запаха, 1 вкус.',
      'Запишите три опоры: человек, место и действие, которые дают вам чувство безопасности.',
      '«Два шага»: один шаг для тела (вода, душ, растяжка), один шаг для связи (сообщение или звонок близкому).',
      'Короткая самоподдержка: положите руку на грудь и скажите вслух «Мне можно переживать, и я могу о себе позаботиться».',
    ],
    prayers: [
      { title: 'Фраза поддержки', text: 'Я делаю достаточно на сегодня. Я имею право на отдых и заботу.' },
      { title: 'Фокус на ценностях', text: 'Что важно для меня прямо сейчас? Какой один маленький шаг приближает меня к этому?' },
    ],
    grounding: 'Поставьте стопы на пол, найдите три точки контакта тела со стулом, сделайте медленный выдох. Посмотрите вокруг и отметьте, что сейчас с вами безопасно.',
    supportTips: [
      'Поговорите с близким человеком и попросите о простом присутствии рядом.',
      'Если есть наставник или терапевт, сообщите ему о своём состоянии и договоритесь о встрече.',
      'Используйте службы поддержки (телефон доверия, чат-поддержку) в вашем регионе.',
    ],
    resources: [
      { title: 'Практика 5-4-3-2-1', url: 'https://www.healthline.com/health/grounding-techniques', note: 'Пошаговое описание' },
      { title: 'Как делать осознанное дыхание', url: 'https://www.mindful.org/beginners-guide-to-meditation/' },
      { title: 'Службы поддержки в РФ', url: 'https://telefon-doveriya.ru/', note: 'Телефон доверия 24/7' },
    ],
  },
]

export default function SpiritualSupportPage() {
  const [selectedId, setSelectedId] = useState<string>(TRADITIONS[0].id)
  const tradition = TRADITIONS.find((item) => item.id === selectedId) ?? TRADITIONS[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f1a] via-[#0f2f26] to-[#0d3b28]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(52,211,153,0.35), transparent 22%), radial-gradient(circle at 80% 0%, rgba(94,234,212,0.35), transparent 22%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.25), transparent 28%)' }}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="container-custom relative z-10 py-16 space-y-6">
          <div className="flex items-center gap-3 text-emerald-200">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.3em]">Духовная поддержка</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight drop-shadow-lg">
            Подберите духовную опору под вашу традицию
          </h1>
          <p className="max-w-3xl text-emerald-50/90 text-lg drop-shadow">
            Выберите свою религию или путь — мы покажем краткие практики, молитвы и шаги, которые помогут снизить тревогу и найти внутренний ресурс.
          </p>
          <div className="flex items-center gap-3 text-sm text-emerald-50/90 drop-shadow">
            <Heart className="w-5 h-5" />
            <span>Духовные практики не заменяют медицинскую помощь. Если состояние тяжёлое — обратитесь к специалисту.</span>
          </div>
        </div>
      </section>

      <section className="container-custom py-12 space-y-8">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {TRADITIONS.map((item) => {
            const isActive = item.id === selectedId
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`text-left rounded-2xl border transition shadow-sm hover:-translate-y-1 ${
                  isActive ? 'border-emerald-500 bg-white shadow-lg' : 'border-slate-200 bg-white/80'
                } p-4`}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">{item.badge}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.intro}</p>
              </button>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <HandHeart className="w-5 h-5" />
                <span className="text-sm font-semibold">Практики прямо сейчас</span>
              </div>
              <p className="text-slate-700 mb-3">{tradition.intro}</p>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">{tradition.context}</p>
              <ul className="space-y-3">
                {tradition.practices.map((practice) => (
                  <li key={practice} className="flex gap-3 text-slate-800">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-900 border border-emerald-100">
                <p className="text-sm font-semibold">Короткое заземление</p>
                <p className="text-sm mt-1">{tradition.grounding}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Book className="w-5 h-5" />
                <span className="text-sm font-semibold">Молитвы, тексты, мантры</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {tradition.prayers.map((prayer) => (
                  <div key={prayer.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-2">{prayer.title}</p>
                    <p className="text-sm text-slate-700 italic leading-relaxed">{prayer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Compass className="w-5 h-5" />
                <span className="text-sm font-semibold">Первые шаги</span>
              </div>
              <ul className="space-y-3 text-slate-800">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Отключите раздражители: приглушите звук, отойдите в тихое место на 10 минут.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Сделайте 5 медленных циклов дыхания и повторите ключевую фразу из вашей традиции.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Запишите одну заботу, которую отдаёте в молитве, и один шаг, который сможете сделать сегодня.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <HandHeart className="w-5 h-5" />
                <span className="text-sm font-semibold">Как получить поддержку</span>
              </div>
              <ul className="space-y-3 text-slate-800">
                {tradition.supportTips.map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm text-rose-900">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-semibold">Если нужна срочная помощь</span>
              </div>
              <p className="text-sm">
                При признаках опасности для себя или других обратитесь к экстренным службам или врачу. Духовные практики можно продолжить после того, как будет обеспечена безопасность и медицинская поддержка.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <LinkIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Полезные источники</span>
              </div>
              <ul className="space-y-3 text-slate-800">
                {tradition.resources.map((resource) => (
                  <li key={resource.url} className="flex flex-col gap-1">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold">
                      <LinkIcon className="w-4 h-4" />
                      {resource.title}
                    </a>
                    {resource.note && <p className="text-sm text-slate-600">{resource.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
