import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstUserId = '103701335099402499437'

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2022-12-31T03:00:00.000')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2023-01-03T03:00:00.000')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  // await prisma.habit.deleteMany()
  // await prisma.day.deleteMany()

  /**
   * Create habits
   */
  await Promise.all([
    await prisma.user.upsert({
      where: { email: 'alice@prisma.io' },
      update: {},
      create: {
        email: 'alice@prisma.io',
        id: '1312',
        name: 'Alice',
        photo: '123',
        habit: {
          create: {
            id: firstHabitId,
            title: 'Exercitar',
            created_at: secondHabitCreationDate,
            weekDays: {
              create: [
                { week_day: 3 },
                { week_day: 4 },
                { week_day: 5 },
              ]
            },
          },
        },
      },
    })
  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })