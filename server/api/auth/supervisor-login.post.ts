import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const nationalId = String(body.nationalId || '').trim()
    const pin = String(body.pin || '').trim()

    if (!nationalId || !pin) {
      throw createError({ statusCode: 400, statusMessage: 'nationalId and pin required' })
    }

    const supervisor = await prisma.supervisor.findUnique({ where: { nationalId } })
    if (!supervisor) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')
    const providedHash = sha256(pin)
    let valid = false
    if (supervisor.pinHash) {
      valid = supervisor.pinHash === providedHash
    } else {
      const phone = supervisor.phoneNumber || ''
      const last4 = phone.replace(/\D/g, '').slice(-4)
      valid = !!last4 && last4 === pin
    }
    if (!valid) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    // Set role and supervisor id cookies
    setCookie(event, 'role', 'supervisor', { httpOnly: false, sameSite: 'lax', path: '/' })
    setCookie(event, 'supervisorId', String(supervisor.id), { httpOnly: false, sameSite: 'lax', path: '/' })

    return { ok: true, supervisor: { id: supervisor.id, fullName: supervisor.fullName } }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Supervisor login failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Login failed' })
  }
})

