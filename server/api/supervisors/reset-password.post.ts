import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin can reset supervisor passwords
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may reset supervisor passwords' })
    }

    const body = await readBody(event)
    const supervisorId = body.supervisorId ? parseInt(String(body.supervisorId)) : null
    const email = String(body.email || '').trim().toLowerCase()
    const newPassword = String(body.newPassword || '')

    if ((!supervisorId && !email) || !newPassword) {
      throw createError({ statusCode: 400, statusMessage: 'supervisorId or email and newPassword required' })
    }

    const where: any = supervisorId ? { id: supervisorId } : { email }
    const supervisor = await prisma.supervisor.findUnique({ where })
    if (!supervisor) {
      throw createError({ statusCode: 404, statusMessage: 'Supervisor not found' })
    }

    const passwordHash = sha256(newPassword)
    const pinHash = sha256(newPassword) // Update both password and pin hashes
    
    await prisma.supervisor.update({ 
      where: { id: supervisor.id }, 
      data: { 
        passwordHash,
        pinHash 
      } 
    })

    return { ok: true, message: 'Supervisor password updated successfully' }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Reset supervisor password failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to reset supervisor password' })
  }
})
