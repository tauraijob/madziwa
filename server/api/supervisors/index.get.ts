import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const supervisors = await prisma.supervisor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { supervisors }
  } catch (error) {
    console.error('Error fetching supervisors:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch supervisors'
    })
  }
}) 