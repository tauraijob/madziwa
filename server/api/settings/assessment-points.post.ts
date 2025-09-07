import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may update settings' })
    }

    const body = await readBody(event)
    const required = ['preparationMax','lessonPlanningMax','environmentMax','documentsMax','introductionMax','developmentMax','conclusionMax','personalDimensionsMax']
    for (const k of required) {
      if (typeof body[k] !== 'number') throw createError({ statusCode: 400, statusMessage: `Invalid ${k}` })
    }

    const setting = await prisma.systemSetting.upsert({
      where: { key: 'assessment_points' },
      update: { value: body },
      create: { key: 'assessment_points', value: body },
    })
    return { ok: true, settings: setting.value }
  } catch (e) {
    if ((e as any)?.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Failed to save settings' })
  }
})

