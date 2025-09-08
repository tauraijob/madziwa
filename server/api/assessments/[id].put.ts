import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may update assessments' })
    }

    const idParam = getRouterParam(event, 'id')
    const id = parseInt(String(idParam || '0'))
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid assessment id' })

    const body = await readBody(event)

    const data: any = {}
    const int = (v: any) => Number.isFinite(parseInt(v)) ? parseInt(v) : undefined
    const str = (v: any) => (v === undefined ? undefined : String(v))

    data.assessmentDate = body.assessmentDate ? new Date(body.assessmentDate) : undefined
    data.subject = str(body.subject)
    data.topic = str(body.topic)
    data.formType = body.formType === 'ecd' ? 'ecd' : (body.formType === 'junior' ? 'junior' : undefined)
    data.overallComment = str(body.overallComment)
    data.preparationMark = int(body.preparationMark)
    data.preparationComment = str(body.preparationComment)
    data.lessonPlanningMark = int(body.lessonPlanningMark)
    data.lessonPlanningComment = str(body.lessonPlanningComment)
    data.environmentMark = int(body.environmentMark)
    data.environmentComment = str(body.environmentComment)
    data.documentsMark = int(body.documentsMark)
    data.documentsComment = str(body.documentsComment)
    data.introductionMark = int(body.introductionMark)
    data.introductionComment = str(body.introductionComment)
    data.developmentMark = int(body.developmentMark)
    data.developmentComment = str(body.developmentComment)
    data.conclusionMark = int(body.conclusionMark)
    data.conclusionComment = str(body.conclusionComment)
    data.personalDimensionsMark = int(body.personalDimensionsMark)
    data.personalDimensionsComment = str(body.personalDimensionsComment)
    data.communityMark = int(body.communityMark)
    data.communityComment = str(body.communityComment)

    const updated = await prisma.assessment.update({ where: { id }, data, include: { student: true, supervisor: true } })
    return { ok: true, assessment: updated }
  } catch (e) {
    if ((e as any)?.statusCode) throw e
    console.error('Update assessment failed:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update assessment' })
  }
})

