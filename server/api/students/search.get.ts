import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Test database connection first
    await prisma.$connect()
    
    const query = getQuery(event) as { candidateNo?: string; surname?: string }

    const where: any = {}

    if (query.candidateNo && query.candidateNo.trim() !== '') {
      const srn = query.candidateNo.trim()
      // Allow partial/contains match so users can paste parts of SRN
      // Use mode: 'insensitive' for case-insensitive search
      where.candidateNo = { contains: srn }
    }

    if (query.surname && query.surname.trim() !== '') {
      const surname = query.surname.trim()
      where.fullName = { contains: surname }
    }

    // District scoping for admins and supervisors
    const role = getCookie(event, 'role')
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    const supervisorId = supervisorIdCookie ? parseInt(String(supervisorIdCookie)) : null
    
    // Debug logging
    console.log('Search request:', { 
      role, 
      adminDistrictId, 
      supervisorId, 
      query: { candidateNo: query.candidateNo, surname: query.surname },
      where: { ...where }
    })
    
    if (role === 'admin' && adminDistrictId) {
      where.districtId = adminDistrictId
    } else if (role === 'supervisor' && supervisorId) {
      const sup = await prisma.supervisor.findUnique({ where: { id: supervisorId } })
      console.log('Supervisor lookup:', { supervisorId, supervisor: sup })
      if (sup?.districtId) {
        where.districtId = sup.districtId
        console.log('Supervisor has district:', sup.districtId)
      } else {
        // Supervisor without district should see no students (consistent with index endpoint)
        where.id = -1
        console.log('Supervisor without district - setting id = -1')
      }
    }

    // If no filters provided, return empty list to avoid dumping all students
    if (!where.candidateNo && !where.fullName) {
      console.log('No search filters provided, returning empty results')
      return { students: [] }
    }

    console.log('Final where clause:', where)
    const students = await prisma.student.findMany({ where, include: { district: true }, orderBy: { fullName: 'asc' } })
    console.log('Found students:', students.length)

    return { students }
  } catch (error) {
    console.error('Error searching students:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to search students: ${error.message}` 
    })
  } finally {
    await prisma.$disconnect()
  }
})