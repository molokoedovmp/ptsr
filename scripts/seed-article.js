const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedArticle() {
  try {
    console.log('Создаем тестовую статью...')

    // Получим первого админа
    const admin = await prisma.user.findFirst({
      where: { 
        roles: {
          has: 'ADMIN'
        }
      }
    })

    if (!admin) {
      console.log('⚠️  Админ не найден, создаем статью без автора')
    }

    const content = JSON.stringify([
      {
        type: "heading",
        content: [{ type: "text", text: "Что такое ПТСР?" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{
          type: "text",
          text: "Посттравматическое стрессовое расстройство (ПТСР) — это психическое расстройство, которое может развиться после пережитого травматического события. Это состояние влияет на многие аспекты жизни человека и требует профессиональной помощи."
        }]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Основные симптомы" }],
        props: { level: 2 }
      },
      {
        type: "bulletListItem",
        content: [{
          type: "text",
          text: "Навязчивые воспоминания о травматическом событии"
        }]
      },
      {
        type: "bulletListItem",
        content: [{
          type: "text",
          text: "Избегание напоминаний о травме"
        }]
      },
      {
        type: "bulletListItem",
        content: [{
          type: "text",
          text: "Изменения в настроении и мышлении"
        }]
      },
      {
        type: "bulletListItem",
        content: [{
          type: "text",
          text: "Повышенная возбудимость и реактивность"
        }]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Когда обращаться за помощью" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{
          type: "text",
          text: "Если симптомы длятся более месяца и мешают вашей повседневной жизни, важно обратиться к специалисту. Не стоит ждать — чем раньше начать лечение, тем эффективнее будет результат."
        }]
      }
    ])

    // Создаем дефолтного автора если нужно
    let authorId = admin?.id
    if (!authorId) {
      // Создаем тестового автора
      const testAuthor = await prisma.user.create({
        data: {
          email: 'author@ptsr-expert.ru',
          password: 'test123',
          fullName: 'Редакция ПТСР Эксперт',
          roles: ['ADMIN'],
          country: 'Россия'
        }
      })
      authorId = testAuthor.id
      console.log('✅ Создан тестовый автор:', testAuthor.fullName)
    }

    const article = await prisma.article.create({
      data: {
        title: 'Понимание посттравматического стрессового расстройства',
        slug: 'ponimanie-ptsr',
        excerpt: 'Узнайте основные признаки ПТСР и когда необходимо обращаться за помощью',
        content: content,
        category: 'SYMPTOMS',
        tags: ['птср', 'симптомы', 'психология', 'травма'],
        published: true,
        authorId: authorId,
      },
    })

    console.log('✅ Создана статья:', article.title)
    console.log('   Slug:', article.slug)
    console.log('   ID автора:', article.authorId)
    console.log('\nВсего статей в базе:', await prisma.article.count())
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedArticle()

