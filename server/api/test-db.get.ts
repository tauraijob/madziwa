import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    await prisma.$disconnect()
    return { status: 'Database connection successful!' }
  } catch (error) {
    console.error('Database connection failed:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Database connection failed: ${error.message}` 
    })
  }
})
