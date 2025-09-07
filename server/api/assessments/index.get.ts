import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Basic role check
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const query = getQuery(event) as { districtId?: string; studentId?: string }

    // District scoping for admins
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    if (role === 'admin' && adminDistrictId) {
      where.student = { districtId: adminDistrictId }
    } else if (role === 'superadmin' && query?.districtId) {
      const qId = parseInt(String(query.districtId))
      if (qId) where.student = { districtId: qId }
    }

    // Optional: filter by specific student
    if (query?.studentId) {
      const sid = parseInt(String(query.studentId))
      if (sid) where.studentId = sid
    }

    // Get assessments with related data
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        student: true,
        supervisor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Add totalMark to each assessment
    const assessmentsWithTotal = assessments.map(assessment => ({
      ...assessment,
      totalMark: assessment.preparationMark + 
                 assessment.lessonPlanningMark + 
                 assessment.environmentMark + 
                 assessment.documentsMark + 
                 assessment.introductionMark + 
                 assessment.developmentMark + 
                 assessment.conclusionMark + 
                 assessment.personalDimensionsMark +
                 (assessment.communityMark || 0)
    }))

    // Calculate statistics
    const totalAssessments = assessmentsWithTotal.length
    const totalStudents = new Set(assessmentsWithTotal.map(a => a.studentId)).size
    const totalSupervisors = new Set(assessmentsWithTotal.map(a => a.supervisorId)).size
    const averageScore = totalAssessments > 0 
      ? Math.round(assessmentsWithTotal.reduce((sum, a) => sum + a.totalMark, 0) / totalAssessments)
      : 0

    return {
      assessments: assessmentsWithTotal,
      statistics: {
        totalAssessments,
        totalStudents,
        totalSupervisors,
        averageScore
      }
    }
  } catch (error) {
    console.error('Error fetching assessments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch assessments'
    })
  }
}) 