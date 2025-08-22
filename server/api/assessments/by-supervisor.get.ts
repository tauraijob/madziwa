import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    if (role !== 'supervisor' || !supervisorIdCookie) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const supervisorId = parseInt(supervisorIdCookie)

    const assessments = await prisma.assessment.findMany({
      where: { supervisorId },
      include: { student: true, supervisor: true },
      orderBy: { createdAt: 'desc' },
    })

    const assessmentsWithTotal = assessments.map(a => ({
      ...a,
      totalMark: a.preparationMark + a.lessonPlanningMark + a.environmentMark + a.documentsMark + a.introductionMark + a.developmentMark + a.conclusionMark + a.personalDimensionsMark + (a.communityMark || 0)
    }))

    return { assessments: assessmentsWithTotal }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Error fetching supervisor assessments:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch assessments' })
  }
})

