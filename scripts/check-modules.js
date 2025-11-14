const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          lessons: true
        },
        orderBy: { orderIndex: 'asc' }
      }
    }
  })
  
  console.log('Курсы в базе:')
  courses.forEach(course => {
    console.log(`\n📚 ${course.title} (id: ${course.id})`)
    console.log(`   Slug: ${course.slug}`)
    console.log(`   Модулей: ${course.modules.length}`)
    course.modules.forEach(module => {
      console.log(`   📖 ${module.title} - уроков: ${module.lessons.length}`)
    })
  })
  
  await prisma.$disconnect()
}

check().catch(console.error)

