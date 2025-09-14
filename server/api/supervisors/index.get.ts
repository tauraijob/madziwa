import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    const q = getQuery(event) as { email?: string; nationalId?: string }

    // If not superadmin, only allow filtered lookup by email/nationalId
    if (role !== 'superadmin') {
      if (!q.email && !q.nationalId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }
    }

    const where: any = {}
    if (q.email) where.email = q.email.toLowerCase()
    if (q.nationalId) where.nationalId = q.nationalId

    const supervisors = await prisma.supervisor.findMany({ where, include: { district: true }, orderBy: { fullName: 'asc' } })
    return { supervisors }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('List/search supervisors failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch supervisors' })
  }
})