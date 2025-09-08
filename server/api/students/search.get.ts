import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as { candidateNo?: string; surname?: string }

    const where: any = {}

    if (query.candidateNo && query.candidateNo.trim() !== '') {
      const srn = query.candidateNo.trim()
      // Allow partial/contains match so users can paste parts of SRN
      where.candidateNo = { contains: srn }
    }

    if (query.surname && query.surname.trim() !== '') {
      where.fullName = { contains: query.surname.trim() }
    }

    // District scoping for admins
    const role = getCookie(event, 'role')
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null
    if (role === 'admin' && adminDistrictId) {
      where.districtId = adminDistrictId
    }

    // If no filters provided, return empty list to avoid dumping all students
    if (!where.candidateNo && !where.fullName) {
      return { students: [] }
    }

    const students = await prisma.student.findMany({ where, orderBy: { fullName: 'asc' } })

    return { students }
  } catch (error) {
    console.error('Error searching students:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to search students' })
  }
})