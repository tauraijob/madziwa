import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)
    const id = parseInt(String(body.id || '0'))
    if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

    const data: any = {}
    if (body.fullName !== undefined) data.fullName = String(body.fullName)
    if (body.sex !== undefined) data.sex = String(body.sex)
    if (body.candidateNo !== undefined) data.candidateNo = String(body.candidateNo)
    if (body.email !== undefined) data.email = String(body.email)
    if (body.schoolName !== undefined) data.schoolName = String(body.schoolName)
    if (body.className !== undefined) data.className = String(body.className)
    if (body.phoneNumber !== undefined) data.phoneNumber = String(body.phoneNumber)
    if (body.districtId !== undefined) data.districtId = body.districtId ? parseInt(String(body.districtId)) : null

    const student = await prisma.student.update({ where: { id }, data })
    return { ok: true, student }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Update student failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update student' })
  }
})

