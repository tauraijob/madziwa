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

    const assessmentsWithTotal = assessments.map(assessment => {
      let totalMark
      if (assessment.formType === 'ecd') {
        // For ECD: preparation + lessonPlanning (mapped from lessonFacilitation) + personalDimensions (mapped from deportment) + documents (mapped from records) + environment + community + conclusion (mapped from remainingPillars)
        totalMark = (assessment.preparationMark || 0) + 
                   (assessment.lessonPlanningMark || 0) + 
                   (assessment.personalDimensionsMark || 0) + 
                   (assessment.documentsMark || 0) + 
                   (assessment.environmentMark || 0) + 
                   (assessment.communityMark || 0) + 
                   (assessment.conclusionMark || 0)
      } else if (assessment.formType === 'junior') {
        // For Junior: preparation + lessonPlanning + personalDimensions (mapped from deportment) + documents + environment + community + conclusion (mapped from remainingPillars)
        totalMark = (assessment.preparationMark || 0) + 
                   (assessment.lessonPlanningMark || 0) + 
                   (assessment.personalDimensionsMark || 0) + 
                   (assessment.documentsMark || 0) + 
                   (assessment.environmentMark || 0) + 
                   (assessment.communityMark || 0) + 
                   (assessment.conclusionMark || 0)
      } else {
        // For other assessment types, use standard calculation
        totalMark = (assessment.preparationMark || 0) + 
                   (assessment.lessonPlanningMark || 0) + 
                   (assessment.environmentMark || 0) + 
                   (assessment.documentsMark || 0) + 
                   (assessment.introductionMark || 0) + 
                   (assessment.developmentMark || 0) + 
                   (assessment.conclusionMark || 0) + 
                   (assessment.personalDimensionsMark || 0) + 
                   (assessment.communityMark || 0)
      }
      
      return {
        ...assessment,
        totalMark: Math.min(totalMark, 100) // Cap at 100
      }
    })

    return { assessments: assessmentsWithTotal }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Error fetching supervisor assessments:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch assessments' })
  }
})

