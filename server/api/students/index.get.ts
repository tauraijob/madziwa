import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    
    const query = getQuery(event) as { districtId?: string }
    const role = getCookie(event, 'role')
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    const supervisorId = supervisorIdCookie ? parseInt(String(supervisorIdCookie)) : null

    const where: any = {}
    
    // Check for explicit districtId in query parameters
    if (query.districtId) {
      where.districtId = parseInt(query.districtId)
    } else if (role === 'admin' && adminDistrictId) {
      where.districtId = adminDistrictId
    } else if (role === 'supervisor' && supervisorId) {
      const sup = await prisma.supervisor.findUnique({ where: { id: supervisorId } })
      if (sup?.districtId) where.districtId = sup.districtId
      else where.id = -1 // supervisor without district sees none
    }

    const students = await prisma.student.findMany({
      where,
      include: { district: true },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { students }
  } catch (error) {
    console.error('Error fetching students:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch students: ${error.message}`
    })
  } finally {
    await prisma.$disconnect()
  }
}) 