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
      if (assessment.formType === 'ecd' || assessment.formType === 'junior' || !assessment.formType) {
        // For ECD/Junior, use clamped values to prevent exceeding maximums
        totalMark = Math.min(assessment.preparationMark || 0, 15) + 
                   Math.min(assessment.lessonPlanningMark || 0, 15) + 
                   Math.min(assessment.environmentMark || 0, 10) + 
                   Math.min(assessment.documentsMark || 0, 15) + 
                   Math.min(assessment.introductionMark || 0, 5) + 
                   Math.min(assessment.developmentMark || 0, 30) + 
                   Math.min(assessment.conclusionMark || 0, 10)
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

