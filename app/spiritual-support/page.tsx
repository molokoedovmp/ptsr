'use client'

import { Heart, Book, Sun, Moon } from 'lucide-react'

export default function SpiritualSupportPage() {
  const traditions = [
    {
      name: 'Христианство',
      prayers: [
        {
          title: 'Молитва об исцелении',
          text: 'Господи Иисусе Христе, Сыне Божий, помилуй меня грешного...',
        },
        {
          title: 'Молитва о покое',
          text: 'Боже, даруй мне спокойствие принять то, что я не могу изменить...',
        },
      ],
    },
    {
      name: 'Ислам',
      prayers: [
        {
          title: 'Дуа от тревоги',
          text: 'Аллахумма инни а\'узу бика минал-хамми валь-хузн...',
        },
      ],
    },
    {
      name: 'Иудаизм',
      prayers: [
        {
          title: 'Псалом 23',
          text: 'Господь - Пастырь мой; я ни в чем не буду нуждаться...',
        },
      ],
    },
  ]

  const practices = [
    {
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      title: 'Утренние практики',
      description: 'Медитация, благодарность, намерения на день',
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: 'Практика осознанности',
      description: 'Внимательное присутствие в моменте',
    },
    {
      icon: <Moon className="w-8 h-8 text-blue-500" />,
      title: 'Вечерние практики',
      description: 'Рефлексия, прощение, покой',
    },
    {
      icon: <Book className="w-8 h-8 text-green-500" />,
      title: 'Чтение священных текстов',
      description: 'Духовное чтение для успокоения',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="section-title">Духовная поддержка</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Молитвы и духовные практики для внутреннего покоя и исцеления
          </p>
        </div>

        {/* Важное примечание */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Важно знать</h3>
            <p className="text-blue-800">
              Духовные практики могут быть важной частью восстановления, но они не заменяют 
              профессиональную психологическую помощь. Мы уважаем все религиозные традиции 
              и предлагаем ресурсы различных конфессий.
            </p>
          </div>
        </div>

        {/* Духовные практики */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Духовные практики
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practices.map((practice, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  {practice.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {practice.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {practice.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Молитвы по традициям */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Молитвы и медитации
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {traditions.map((tradition, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Book className="w-6 h-6 mr-2 text-primary-600" />
                  {tradition.name}
                </h3>
                <div className="space-y-4">
                  {tradition.prayers.map((prayer, pIndex) => (
                    <div key={pIndex} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {prayer.title}
                      </h4>
                      <p className="text-gray-700 italic">
                        {prayer.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Управляемая медитация */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Управляемая медитация для исцеления
            </h2>
            <p className="text-gray-600 mb-6">
              Посвятите 10 минут своему внутреннему покою с нашей управляемой медитацией
            </p>
            <button className="btn-primary">
              Начать медитацию
            </button>
          </div>
        </div>

        {/* Цитаты для вдохновения */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Слова для размышления
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <p className="text-gray-800 italic mb-3">
                &quot;Мир оставляю вам, мир Мой даю вам; не так, как мир дает, Я даю вам.&quot;
              </p>
              <p className="text-sm text-gray-600">— Евангелие от Иоанна 14:27</p>
            </div>
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <p className="text-gray-800 italic mb-3">
                &quot;Воистину, с трудностью приходит облегчение.&quot;
              </p>
              <p className="text-sm text-gray-600">— Коран 94:5-6</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <p className="text-gray-800 italic mb-3">
                &quot;Господь близок к сокрушенным сердцем и спасает смиренных духом.&quot;
              </p>
              <p className="text-sm text-gray-600">— Псалом 34:18</p>
            </div>
            <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <p className="text-gray-800 italic mb-3">
                &quot;Каждое дыхание - это возможность начать заново.&quot;
              </p>
              <p className="text-sm text-gray-600">— Буддийская мудрость</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

