import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may view supervisor districts' })
    }

    const supervisorId = parseInt(getRouterParam(event, 'id') || '0')
    
    if (!supervisorId) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid supervisor ID' })
    }

    const supervisor = await prisma.supervisor.findUnique({
      where: { id: supervisorId },
      include: { 
        districts: {
          include: { district: true }
        },
        district: true // Primary district
      }
    })

    if (!supervisor) {
      throw createError({ statusCode: 404, statusMessage: 'Supervisor not found' })
    }

    return { 
      supervisor: {
        id: supervisor.id,
        fullName: supervisor.fullName,
        email: supervisor.email,
        primaryDistrict: supervisor.district,
        assignedDistricts: supervisor.districts.map(sd => sd.district)
      }
    }
  } catch (error) {
    console.error('Error fetching supervisor districts:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to fetch supervisor districts: ${error.message}` 
    })
  } finally {
    await prisma.$disconnect()
  }
})
