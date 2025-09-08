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

    // Add totalMark like list endpoint for consistency
    const totalMark = assessment.preparationMark + assessment.lessonPlanningMark + assessment.environmentMark + assessment.documentsMark + assessment.introductionMark + assessment.developmentMark + assessment.conclusionMark + assessment.personalDimensionsMark + (assessment.communityMark || 0)

    return { assessment: { ...assessment, totalMark } }
  } catch (e) {
    if ((e as any)?.statusCode) throw e
    console.error('Get assessment failed:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to get assessment' })
  }
})

