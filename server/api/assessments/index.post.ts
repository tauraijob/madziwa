import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.studentId || !body.supervisorId || !body.subject || !body.topic) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: studentId, supervisorId, subject, topic'
      })
    }

    // Create the assessment
    const assessment = await prisma.assessment.create({
      data: {
        assessmentDate: new Date(body.assessmentDate || new Date()),
        subject: body.subject,
        topic: body.topic,
        preparationMark: parseInt(body.preparationMark) || 0,
        preparationComment: body.preparationComment || '',
        lessonPlanningMark: parseInt(body.lessonPlanningMark) || 0,
        lessonPlanningComment: body.lessonPlanningComment || '',
        environmentMark: parseInt(body.environmentMark) || 0,
        environmentComment: body.environmentComment || '',
        documentsMark: parseInt(body.documentsMark) || 0,
        documentsComment: body.documentsComment || '',
        introductionMark: parseInt(body.introductionMark) || 0,
        introductionComment: body.introductionComment || '',
        developmentMark: parseInt(body.developmentMark) || 0,
        developmentComment: body.developmentComment || '',
        conclusionMark: parseInt(body.conclusionMark) || 0,
        conclusionComment: body.conclusionComment || '',
        personalDimensionsMark: parseInt(body.personalDimensionsMark) || 0,
        personalDimensionsComment: body.personalDimensionsComment || '',
        // Community engagement
        communityMark: parseInt(body.communityMark) || 0,
        communityComment: body.communityComment || '',
        // Form type
        formType: (body.formType === 'ecd' ? 'ecd' : 'junior'),
        overallComment: body.overallComment || '',
        supervisorId: parseInt(body.supervisorId),
        studentId: parseInt(body.studentId)
      },
      include: {
        student: true,
        supervisor: true
      }
    })

    return {
      message: 'Assessment created successfully',
      assessment
    }
  } catch (error) {
    console.error('Error creating assessment:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create assessment'
    })
  }
}) 