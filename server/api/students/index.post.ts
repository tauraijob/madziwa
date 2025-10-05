import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.fullName || !body.sex || !body.candidateNo || !body.email || !body.schoolName || !body.className) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: fullName, sex, candidateNo, email, schoolName, className'
      })
    }

    // Reuse existing student by unique candidateNo if present
    const existing = await prisma.student.findUnique({ where: { candidateNo: body.candidateNo } })
    let student
    if (existing) {
      // Optionally update basic fields from payload (non-destructive)
      student = await prisma.student.update({
        where: { id: existing.id },
        data: {
          fullName: body.fullName || existing.fullName,
          sex: body.sex || existing.sex,
          email: body.email || existing.email,
          schoolName: body.schoolName || existing.schoolName,
          className: body.className || existing.className,
          phoneNumber: String(body.phoneNumber || existing.phoneNumber || ''),
          districtId: body.districtId ? parseInt(String(body.districtId)) : existing.districtId || undefined,
        }
      })
    } else {
      // Create the student
      student = await prisma.student.create({
        data: {
          fullName: body.fullName,
          sex: body.sex,
          candidateNo: body.candidateNo,
          email: body.email,
          schoolName: body.schoolName,
          className: body.className,
          phoneNumber: String(body.phoneNumber || ''),
          districtId: body.districtId ? parseInt(String(body.districtId)) : undefined,
        }
      })
    }

    return {
      message: 'Student created successfully',
      student
    }
  } catch (error) {
    console.error('Error creating student:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create student'
    })
  }
}) 