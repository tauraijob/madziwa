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
        district: true,
        districts: {
          include: { district: true }
        }
      }, 
      orderBy: { fullName: 'asc' } 
    })
    
    // Transform the data to include assigned districts
    const transformedSupervisors = supervisors.map(supervisor => ({
      ...supervisor,
      assignedDistricts: supervisor.districts.map(sd => sd.district)
    }))
    
    return { supervisors: transformedSupervisors }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('List/search supervisors failed:', error)
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch supervisors: ${error.message}` })
  } finally {
    await prisma.$disconnect()
  }
})