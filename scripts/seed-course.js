const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedCourse() {
  try {
    console.log('Создаем тестовый курс...')

    // Удаляем старые тестовые курсы если есть
    await prisma.course.deleteMany({
      where: {
        slug: {
          in: ['osnovy-raboty-s-ptsr', 'trener-po-borbe-s-ptsr']
        }
      }
    })

    // Создаем два курса
    const course1 = await prisma.course.create({
      data: {
        title: 'Основы работы с ПТСР',
        slug: 'osnovy-raboty-s-ptsr',
        description: 'Базовый курс по пониманию и работе с посттравматическим стрессовым расстройством',
        fullDescription: 'Этот курс предоставляет фундаментальные знания о ПТСР, его симптомах, причинах и методах работы. Вы узнаете, как распознать признаки ПТСР и какие шаги предпринять для получения помощи.\n\nКурс включает:\n- Теоретические основы ПТСР\n- Практические упражнения\n- Методы самопомощи\n- Техники релаксации',
        durationWeeks: 10,
        level: 'Начальный',
        price: 0,
        published: true,
        modules: {
          create: [
            {
              title: 'Введение в ПТСР',
              description: 'Что такое ПТСР и как оно проявляется. В этом модуле вы узнаете основные понятия и определения.',
              content: 'Основы понимания посттравматического стрессового расстройства. Детальное изучение причин возникновения ПТСР.',
              orderIndex: 1
            },
            {
              title: 'Симптомы и диагностика',
              description: 'Как распознать ПТСР и какие симптомы являются ключевыми.',
              content: 'Признаки и симптомы ПТСР. Методы диагностики и самодиагностики.',
              orderIndex: 2
            },
            {
              title: 'Методы работы',
              description: 'Основные подходы к лечению и работе с ПТСР.',
              content: 'Терапевтические методы работы с ПТСР. Когнитивно-поведенческая терапия, EMDR и другие подходы.',
              orderIndex: 3
            }
          ]
        }
      },
      include: {
        modules: true
      }
    })

    const course2 = await prisma.course.create({
      data: {
        title: 'Программа курса "Тренер по борьбе с посттравматическим стрессовым расстройством (ПТСР) участников боевых действий"',
        slug: 'trener-po-borbe-s-ptsr',
        description: 'Предназначен для всех, кому нужна помощь в преодолении негативных эмоций. Он может быть полезен людям, пережившим травму, их семьям или всем, кто борется со стрессом.',
        fullDescription: 'Эта программа предназначена для специалистов, которые хотят помогать участникам боевых действий справляться с ПТСР. Курс включает теоретические знания и практические навыки работы с травмой.\n\nВ программе:\n- Специфика работы с военной травмой\n- Техники психологической поддержки\n- Групповая работа с ветеранами\n- Профилактика выгорания специалиста',
        durationWeeks: 10,
        level: 'Начальный',
        price: 0,
        published: true,
        modules: {
          create: []
        }
      },
      include: {
        modules: true
      }
    })

    console.log('✅ Создан курс 1:', course1.title, '(slug:', course1.slug, ')')
    console.log('   Модулей:', course1.modules.length)
    console.log('✅ Создан курс 2:', course2.title, '(slug:', course2.slug, ')')
    console.log('   Модулей:', course2.modules.length)
    
    console.log('\nВсего курсов в базе:', await prisma.course.count())
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCourse()

