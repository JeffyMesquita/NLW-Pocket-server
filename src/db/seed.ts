import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Fazer exercícios',
        desiredWeeklyFrequency: 6,
      },
      {
        title: 'Estudar inglês',
        desiredWeeklyFrequency: 7,
      },
      {
        title: 'Ler livros',
        desiredWeeklyFrequency: 3,
      },
      {
        title: 'Fazer meditação',
        desiredWeeklyFrequency: 1,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[0].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.add(2, 'day').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})
