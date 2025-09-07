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
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may create admins' })
    }

    const body = await readBody(event)
    const fullName = String(body.fullName || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const userRole = (String(body.role || 'admin') === 'superadmin') ? 'superadmin' : 'admin'
    const assignedDistrictId = body.assignedDistrictId ? parseInt(String(body.assignedDistrictId)) : null

    if (!fullName || !email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'fullName, email, password required' })
    }

    const passwordHash = sha256(password)

    const admin = await prisma.adminUser.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: userRole,
        assignedDistrictId: assignedDistrictId || undefined,
      }
    })

    return { ok: true, admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role, assignedDistrictId: admin.assignedDistrictId } }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Create admin failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to create admin' })
  }
})

