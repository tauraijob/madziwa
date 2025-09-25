import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin can update supervisor details
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may update supervisors' })
    }

    const idParam = getRouterParam(event, 'id')
    const id = idParam ? parseInt(String(idParam)) : NaN
    if (!id || Number.isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid supervisor id' })
    }

    const body = await readBody(event)
    const phoneNumber = String(body.phoneNumber || '').trim()
    if (!phoneNumber) {
      throw createError({ statusCode: 400, statusMessage: 'phoneNumber required' })
    }

    const updated = await prisma.supervisor.update({ where: { id }, data: { phoneNumber } })
    return { ok: true, supervisor: { id: updated.id, phoneNumber: updated.phoneNumber } }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Update supervisor failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update supervisor' })
  }
})


