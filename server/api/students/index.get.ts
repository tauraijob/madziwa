import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    if (role === 'admin' && adminDistrictId) {
      where.districtId = adminDistrictId
    }

    const students = await prisma.student.findMany({
      where,
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