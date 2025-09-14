import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin' && role !== 'supervisor') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    const supervisorId = supervisorIdCookie ? parseInt(String(supervisorIdCookie)) : null

    const where: any = {}
    if (role === 'admin' && adminDistrictId) {
      where.districtId = adminDistrictId
    } else if (role === 'supervisor' && supervisorId) {
      const sup = await prisma.supervisor.findUnique({ where: { id: supervisorId } })
      if (sup?.districtId) where.districtId = sup.districtId
      else where.id = -1
    }

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

