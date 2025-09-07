import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may create districts' })
    }

    const body = await readBody(event)
    const name = String(body.name || '').trim()
    if (!name) throw createError({ statusCode: 400, statusMessage: 'name required' })

    const district = await prisma.district.create({ data: { name } })
    return { ok: true, district }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Create district failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to create district' })
  }
})

