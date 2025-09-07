import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may assign districts' })
    }

    const body = await readBody(event)
    const adminId = parseInt(String(body.adminId || '0'))
    const districtId = parseInt(String(body.districtId || '0'))

    if (!adminId || !districtId) {
      throw createError({ statusCode: 400, statusMessage: 'adminId and districtId required' })
    }

    // Ensure district exists
    const district = await prisma.district.findUnique({ where: { id: districtId } })
    if (!district) throw createError({ statusCode: 404, statusMessage: 'District not found' })

    const admin = await prisma.adminUser.update({
      where: { id: adminId },
      data: { assignedDistrictId: districtId },
      select: { id: true, fullName: true, role: true, assignedDistrictId: true }
    })

    return { ok: true, admin }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Assign district failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to assign district' })
  }
})

