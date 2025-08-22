import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin may delete assessments
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may delete assessments' })
    }

    const id = getRouterParam(event, 'id')
    
    // Check if assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: { id: parseInt(id) }
    })

    if (!assessment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Assessment not found'
      })
    }

    // Delete the assessment
    await prisma.assessment.delete({
      where: { id: parseInt(id) }
    })

    return {
      message: 'Assessment deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting assessment:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete assessment'
    })
  }
}) 