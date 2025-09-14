import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may delete supervisors' })
    }

    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid supervisor ID' })
    }

    await prisma.supervisor.delete({ where: { id } })
    return { ok: true }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Delete supervisor failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete supervisor' })
  }
})
