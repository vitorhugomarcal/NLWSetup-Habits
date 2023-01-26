import dayjs from 'dayjs';
import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"
import { z } from 'zod'

export async function appRoutes(app: FastifyInstance){

  app.post('/user', async(req) => {
    const createUser = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      photo: z.string(),
    })

    const { name, email, photo, id } = createUser.parse(req.body)

    const userExists = await prisma.user.findFirst({
      where: {
        id,
      }
    })

    if (!userExists) {
      await prisma.user.create({
        data: {
          id,
          name,
          email,
          photo,
        }
      })
      } else {
        return
    }
  })

  app.post('/habits', async(req) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
      userId: z.string(),
    })

    const { title, weekDays, userId } = createHabitBody.parse(req.body)

    const today = dayjs().startOf('day').toDate()

    const addToday = dayjs(today).hour(3).toDate()
    // console.log(addToday)

    await prisma.habit.create({
      data: {
        userId,
        title,
        created_at: addToday,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
              userId
            }
          })
        }
      }
    })
  })

  app.get('/day', async (req) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
      userId: z.string()
    })

    const { date, userId } = getDayParams.parse(req.query)

    const parsedDate = dayjs(date).startOf('day').hour(3)
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        userId,
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    })

    const day = await prisma.day.findFirst({
      where: {
        userId,
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })

    if(possibleHabits.length > 0){
      const completedHabits = day?.dayHabits.map(dayHabit => {
        return dayHabit.habit_id
      }) ?? []
      
      return {
        possibleHabits,
        completedHabits,
      }
    }
  })

  app.patch('/habits/:id/:userId/toggle', async (req) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
      userId: z.string()
    })

    const { id, userId } = toggleHabitParams.parse(req.params)

    const today = dayjs().startOf('day').toDate()
    const addToday = dayjs(today).hour(3).toDate()

    let day = await prisma.day.findFirst({
      where: {
        userId,
        date: addToday,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data:{
          userId,
          date: addToday,
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id_userId: {
          day_id: day.id,
          habit_id: id,
          userId: userId
        }
      }
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
          userId: userId,
        }
      })
    }
  })

  app.get('/summary', async (req) => {
    const getUser = z.object({
      userId: z.string()
    })

    const { userId } = getUser.parse(req.query)

    const summary = await prisma.$queryRaw`
      SELECT
        D.id,
        D.date,
        D.userId,
        (
          SELECT
            cast(count(*) as char)
            FROM day_habits DH
            WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as char)
            
            FROM habit_week_days HWD
            JOIN habits H
              ON H.id = HWD.habit_id
            WHERE
              HWD.week_day = DATE_FORMAT(D.date, '%w')
              AND H.created_at <= D.date
              AND D.userId = H.userId
        ) as amount
      FROM days D
      WHERE D.userId = ${userId}
    `
    // console.log(summary)
    return summary
  })
}

