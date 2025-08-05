import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get all assessments with related data
    const assessments = await prisma.assessment.findMany({
      include: {
        student: true,
        supervisor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const totalAssessments = assessments.length
    const totalStudents = new Set(assessments.map(a => a.studentId)).size
    const totalSupervisors = new Set(assessments.map(a => a.supervisorId)).size
    const averageScore = totalAssessments > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.totalMark, 0) / totalAssessments)
      : 0

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
                 assessment.personalDimensionsMark
    }))

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