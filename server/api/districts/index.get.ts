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
    
    // Handle database connection errors gracefully for development
    if (error.message && error.message.includes('Can\'t reach database server')) {
      console.warn('Database connection failed, returning mock data for development')
      return { 
        districts: [
          { id: 1, name: 'Harare' },
          { id: 2, name: 'Bulawayo' },
          { id: 3, name: 'Mutare' },
          { id: 4, name: 'Gweru' },
          { id: 5, name: 'Kwekwe' }
        ]
      }
    }
    
    console.error('Fetch districts failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch districts' })
  }
})

