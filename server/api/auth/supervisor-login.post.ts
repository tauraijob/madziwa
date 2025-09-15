import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const nationalIdInput = String(body.nationalId || '').trim()
    const nationalId = nationalIdInput.replace(/[^a-z0-9]/gi, '').toUpperCase()
    const pin = String(body.pin || '').trim()

    if (!nationalId || !pin) {
      throw createError({ statusCode: 400, statusMessage: 'nationalId and pin required' })
    }

    let supervisor = await prisma.supervisor.findUnique({ where: { nationalId } })
    if (!supervisor && nationalIdInput) {
      // Fallback: try exact, unnormalized match for legacy records
      supervisor = await prisma.supervisor.findFirst({ where: { nationalId: nationalIdInput } })
    }
    if (!supervisor) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const phone = supervisor.phoneNumber || ''
    const last4 = phone.replace(/\D/g, '').slice(-4)
    if (!last4 || last4 !== pin) {
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

