import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may delete admins' })
    }

    const idParam = getRouterParam(event, 'id')
    const id = parseInt(String(idParam || '0'))
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid admin id' })

    const existing = await prisma.adminUser.findUnique({ where: { id } })
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Admin not found' })

    await prisma.adminUser.delete({ where: { id } })
    return { ok: true }
  } catch (e) {
    if ((e as any)?.statusCode) throw e
    console.error('Delete admin failed:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete admin' })
  }
})

