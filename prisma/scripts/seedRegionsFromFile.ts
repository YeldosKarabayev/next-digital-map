import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Импорт регионов начат...')

  const filePath = path.join(__dirname, '../../data/regions.json')
  console.log('📂 Путь к файлу:', filePath)

  if (!fs.existsSync(filePath)) {
    console.error('❌ Файл regions.json не найден!')
    return
  }

  const data = fs.readFileSync(filePath, 'utf-8')
  const regions = JSON.parse(data)

  console.log(`📦 Найдено регионов: ${regions.length}`)

  for (const region of regions) {
    console.log(`➡️ Импорт региона: ${region.id}`)

    await prisma.region.upsert({
      where: { id: region.id },
      update: {},
      create: {
        id: region.id,
        name: region.name,
        color: region.color,
        coordinates: {
          create: region.coordinates.map((coord: any) => ({
            lat: coord.lat,
            lon: coord.lon,
          })),
        },
      },
    })
  }

  console.log('✅ Регионы успешно добавлены в базу данных.')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при импорте регионов:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
