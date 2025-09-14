import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may assign supervisor district' })
    }

    const body = await readBody(event)
    const supervisorId = parseInt(String(body.supervisorId))
    const districtId = parseInt(String(body.districtId))
    if (!supervisorId || !districtId) {
      throw createError({ statusCode: 400, statusMessage: 'supervisorId and districtId required' })
    }

    await prisma.supervisor.update({ where: { id: supervisorId }, data: { districtId } })
    return { ok: true }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Assign supervisor district failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to assign supervisor district' })
  }
})



