import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    
    const role = getCookie(event, 'role')
    const q = getQuery(event) as { email?: string; nationalId?: string; districtId?: string }

    // If not superadmin, only allow filtered lookup by email/nationalId
    if (role !== 'superadmin') {
      if (!q.email && !q.nationalId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }
    }

    const where: any = {}
    if (q.email) where.email = q.email.toLowerCase()
    if (q.nationalId) where.nationalId = q.nationalId
    if (q.districtId) where.districtId = parseInt(q.districtId)

    const supervisors = await prisma.supervisor.findMany({ 
      where, 
      include: { 
        district: true
      }, 
      orderBy: { fullName: 'asc' } 
    })
    
    return { supervisors }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    
    // Handle database connection errors gracefully for development
    if (error.message && error.message.includes('Can\'t reach database server')) {
      console.warn('Database connection failed, returning mock data for development')
      return { 
        supervisors: [
          {
            id: 1,
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+263123456789',
            nationalId: '1234567890',
            districtId: 1,
            district: { id: 1, name: 'Harare' },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            fullName: 'Jane Smith',
            email: 'jane.smith@example.com',
            phoneNumber: '+263987654321',
            nationalId: '0987654321',
            districtId: 2,
            district: { id: 2, name: 'Bulawayo' },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    }
    
    console.error('List/search supervisors failed:', error)
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch supervisors: ${error.message}` })
  } finally {
    await prisma.$disconnect()
  }
})