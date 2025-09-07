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

    // Create the student
    const student = await prisma.student.create({
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