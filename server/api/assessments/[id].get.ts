import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may view assessment details' })
    }

    const idParam = getRouterParam(event, 'id')
    const id = parseInt(String(idParam || '0'))
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid assessment id' })

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { student: true, supervisor: true },
    })
    if (!assessment) throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })

    // Add totalMark with proper clamping for consistency
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
    
    totalMark = Math.min(totalMark, 100) // Cap at 100

    return { assessment: { ...assessment, totalMark } }
  } catch (e) {
    if ((e as any)?.statusCode) throw e
    console.error('Get assessment failed:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to get assessment' })
  }
})

