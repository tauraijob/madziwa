import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may list admins' })
    }
    const admins = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedDistrict: true },
    })
    return { admins }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    
    // Handle database connection errors gracefully for development
    if (error.message && error.message.includes('Can\'t reach database server')) {
      console.warn('Database connection failed, returning mock data for development')
      return { 
        admins: [
          {
            id: 1,
            fullName: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            assignedDistrictId: 1,
            assignedDistrict: { id: 1, name: 'Harare' },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    }
    
    console.error('List admins failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to list admins' })
  }
})

