import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    
    const districtId = parseInt(getRouterParam(event, 'id') || '0')
    
    if (!districtId) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid district ID' })
    }

    const district = await prisma.district.findUnique({
      where: { id: districtId },
      include: {
        students: {
          select: { id: true, fullName: true, candidateNo: true }
        },
        supervisors: {
          select: { id: true, fullName: true, email: true }
        }
      }
    })

    if (!district) {
      throw createError({ statusCode: 404, statusMessage: 'District not found' })
    }

    return { district }
  } catch (error) {
    console.error('Error fetching district:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to fetch district: ${error.message}` 
    })
  } finally {
    await prisma.$disconnect()
  }
})
