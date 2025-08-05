import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { students }
  } catch (error) {
    console.error('Error fetching students:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch students'
    })
  }
}) 