import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const filePath = path.join(__dirname, '../../data/providers.json')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const providers = JSON.parse(fileContent)

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { id: provider.id },
      update: {},
      create: {
        id: provider.id,
        name: provider.name,
        color: provider.color,
        createdAt: new Date(provider.createdAt),
        cables: {
          create: provider.cables.map((cable: any) => ({
            id: cable.id,
            street: cable.street,
            color: cable.color,
            createdAt: new Date(
              cable.createdAt._seconds * 1000 + Math.floor(cable.createdAt._nanoseconds / 1_000_000)
            ),
            coordinates: {
              create: cable.coordinates.map((coord: any) => ({
                lat: coord.lat,
                lon: coord.lon
              }))
            }
          }))
        }
      }
    })
  }

  console.log('✅ Импорт завершён: все провайдеры добавлены.')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при импорте:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


// import { PrismaClient } from '@prisma/client'
// import fs from 'fs'
// import path from 'path'

// const prisma = new PrismaClient()

// async function main() {
//   const filePath = path.join(__dirname, '../../data/providers.json')
//   const fileContent = fs.readFileSync(filePath, 'utf-8')
//   const providers = JSON.parse(fileContent)

//   // Удаляем все старые записи в нужном порядке
//   console.log('🧹 Удаляем старые данные...')
//   await prisma.cableCoordinate.deleteMany({})
//   await prisma.cable.deleteMany({})
//   await prisma.provider.deleteMany({})
//   console.log('✅ Старые данные удалены.')

//   // Добавляем заново
//   for (const provider of providers) {
//     console.log(`📦 Импорт провайдера: ${provider.name}`)
//     await prisma.provider.create({
//       data: {
//         id: provider.id,
//         name: provider.name,
//         color: provider.color,
//         createdAt: new Date(provider.createdAt),
//         cables: {
//           create: provider.cables.map((cable: any) => ({
//             id: cable.id,
//             street: cable.street || '',
//             color: cable.color || '#000000',
//             createdAt: new Date(
//               cable.createdAt?._seconds * 1000 + Math.floor(cable.createdAt?._nanoseconds / 1_000_000)
//             ),
//             coordinates: {
//               create: cable.coordinates.map((coord: any) => ({
//                 lat: coord.lat,
//                 lon: coord.lon
//               }))
//             }
//           }))
//         }
//       }
//     })
//   }

//   console.log('✅ Импорт завершён: все провайдеры добавлены.')
// }

// main()
//   .catch((e) => {
//     console.error('❌ Ошибка при импорте:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
