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
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        assignedDistrictId: true,
        assignedDistrict: true,
        createdAt: true,
      }
    })
    return { admins }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('List admins failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to list admins' })
  }
})

