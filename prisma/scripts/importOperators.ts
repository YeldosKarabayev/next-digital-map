import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const filePath = path.join(__dirname, '../data/operators.json')
  const fileData = fs.readFileSync(filePath, 'utf-8')
  const operators = JSON.parse(fileData)

  for (const operator of operators) {
    const existing = await prisma.operator.findUnique({
      where: { id: operator.id },
    })

    if (existing) {
      console.log(`⏭️ Пропущено: оператор "${operator.name}" уже существует.`)
      continue
    }

    await prisma.operator.create({
      data: {
        id: operator.id,
        name: operator.name,
        pointIcon: operator.pointIcon,
        points: {
          create: operator.points.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            lat: p.lat,
            lon: p.lon,
            photoUrl: p.photoUrl,
          })),
        },
      },
    })

    console.log(`✅ Импортирован оператор: ${operator.name}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
