import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export default defineEventHandler(async (event) => {
  try {
    // Superadmin only
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may reset passwords' })
    }

    const body = await readBody(event)
    const adminId = body.id ? parseInt(String(body.id)) : null
    const email = String(body.email || '').trim().toLowerCase()
    const newPassword = String(body.newPassword || '')

    if ((!adminId && !email) || !newPassword) {
      throw createError({ statusCode: 400, statusMessage: 'id or email and newPassword required' })
    }

    const where: any = adminId ? { id: adminId } : { email }
    const admin = await prisma.adminUser.findUnique({ where })
    if (!admin) {
      throw createError({ statusCode: 404, statusMessage: 'Admin not found' })
    }

    const passwordHash = sha256(newPassword)
    await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } })

    return { ok: true }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Reset admin password failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to reset password' })
  }
})


