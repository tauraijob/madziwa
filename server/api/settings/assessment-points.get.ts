import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin' && role !== 'supervisor') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const setting = await prisma.systemSetting.findUnique({ where: { key: 'assessment_points' } })
    const def = { preparationMax: 20, lessonPlanningMax: 20, environmentMax: 10, documentsMax: 10, introductionMax: 3, developmentMax: 30, conclusionMax: 3, personalDimensionsMax: 4 }
    return { settings: setting?.value || def }
  } catch (e) {
    if ((e as any)?.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Failed to load settings' })
  }
})

