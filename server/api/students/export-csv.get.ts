import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    if (role === 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Admins are view-only. Downloads disabled.' })
    }
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    // superadmin downloads all; admins blocked above

    const students = await prisma.student.findMany({
      where,
      include: { assessments: true, district: true },
      orderBy: { fullName: 'asc' },
    })

    const headers = ['Full Name','Sex','Candidate No','Phone','Email','District','School','Class']
    const rows = students.map(s => [
      s.fullName,
      s.sex,
      s.candidateNo,
      s.phoneNumber || '',
      s.email,
      s.district?.name || '',
      s.schoolName,
      s.className,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))].join('\n')

    setHeader(event, 'Content-Type', 'text/csv')
    setHeader(event, 'Content-Disposition', `attachment; filename="students-${new Date().toISOString().split('T')[0]}.csv"`)
    return csv
  } catch (e) {
    console.error('Export students CSV failed:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to export students CSV' })
  }
})

