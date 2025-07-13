// import { PrismaClient } from '@prisma/client'
// import fs from 'fs'
// import path from 'path'

// const prisma = new PrismaClient()

// async function main() {
//   const filePath = path.join(__dirname, '../../data/regions.json')
//   const data = fs.readFileSync(filePath, 'utf-8')
//   const regions = JSON.parse(data)

//   for (const region of regions) {
//     await prisma.region.upsert({
//       where: { id: region.id },
//       update: {},
//       create: {
//         id: region.id,
//         name: region.name,
//         color: region.color,
//         coordinates: {
//           create: region.coordinates.map((coord: any) => ({
//             lat: coord.lat,
//             lon: coord.lon
//           }))
//         }
//       }
//     })
//   }

//   console.log('✅ Регионы добавлены в базу данных.')
// }

// main()
//   .catch((e) => {
//     console.error('❌ Ошибка при импорте регионов:', e)
//     process.exit(1)
//   })
//   .finally(() => prisma.$disconnect())
