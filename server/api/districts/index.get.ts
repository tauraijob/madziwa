import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const districts = await prisma.district.findMany({ orderBy: { name: 'asc' } })
    return { districts }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Fetch districts failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch districts' })
  }
})

