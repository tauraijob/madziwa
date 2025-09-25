import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'email and password required' })
    }

    // Prefer real DB lookup; only use fallback if the lookup throws (e.g., client not generated)
    let user: any = null
    let lookupErrored = false
    try {
      user = await prisma.adminUser.findUnique({ where: { email } })
    } catch (e) {
      lookupErrored = true
    }
    if (!user && lookupErrored) {
      // Temporary fallback accounts until prisma generate/db push/seed are run
      const fallback: Record<string, { password: string; role: 'admin' | 'superadmin'; assignedDistrictId?: number | null }> = {
        'superadmin@example.com': { password: 'superadmin123', role: 'superadmin' },
        'admin@example.com': { password: 'admin123', role: 'admin', assignedDistrictId: null },
        // Legacy demo creds (username without @)
        'superadmin': { password: 'superadmin123', role: 'superadmin' },
        'admin': { password: 'admin123', role: 'admin', assignedDistrictId: null },
      }
      const demo = fallback[email]
      if (!demo || demo.password !== password) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
      }
      setCookie(event, 'role', demo.role, { httpOnly: false, sameSite: 'lax', path: '/' })
      if (demo.role === 'admin' && demo.assignedDistrictId) {
        setCookie(event, 'adminDistrictId', String(demo.assignedDistrictId), { httpOnly: false, sameSite: 'lax', path: '/' })
      } else {
        deleteCookie(event, 'adminDistrictId', { path: '/' })
      }
      return { ok: true, user: { id: 0, fullName: email, role: demo.role, assignedDistrictId: demo.assignedDistrictId ?? null } }
    }
    // If lookup succeeded but user not found, allow demo fallback only if there are no admins yet (first-run/dev bootstrap)
    if (!user) {
      try {
        const count = await prisma.adminUser.count()
        if (count === 0) {
          const fallback: Record<string, { password: string; role: 'admin' | 'superadmin'; assignedDistrictId?: number | null }> = {
            'superadmin@example.com': { password: 'superadmin123', role: 'superadmin' },
            'admin@example.com': { password: 'admin123', role: 'admin', assignedDistrictId: null },
            'superadmin': { password: 'superadmin123', role: 'superadmin' },
            'admin': { password: 'admin123', role: 'admin', assignedDistrictId: null },
          }
          const demo = fallback[email]
          if (demo && demo.password === password) {
            setCookie(event, 'role', demo.role, { httpOnly: false, sameSite: 'lax', path: '/' })
            if (demo.role === 'admin' && demo.assignedDistrictId) {
              setCookie(event, 'adminDistrictId', String(demo.assignedDistrictId), { httpOnly: false, sameSite: 'lax', path: '/' })
            } else {
              deleteCookie(event, 'adminDistrictId', { path: '/' })
            }
            return { ok: true, user: { id: 0, fullName: email, role: demo.role, assignedDistrictId: demo.assignedDistrictId ?? null } }
          }
        }
      } catch (e) {
        // ignore count errors
      }
    }
    // If lookup succeeded but user not found, reject
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const isValid = user.passwordHash === sha256(password)
    if (!isValid) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    // Set cookies
    setCookie(event, 'role', user.role === 'superadmin' ? 'superadmin' : 'admin', { httpOnly: false, sameSite: 'lax', path: '/' })
    if (user.assignedDistrictId) {
      setCookie(event, 'adminDistrictId', String(user.assignedDistrictId), { httpOnly: false, sameSite: 'lax', path: '/' })
    } else {
      deleteCookie(event, 'adminDistrictId', { path: '/' })
    }

    return { ok: true, user: { id: user.id, fullName: user.fullName, role: user.role, assignedDistrictId: user.assignedDistrictId } }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Admin login failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Login failed' })
  }
})

