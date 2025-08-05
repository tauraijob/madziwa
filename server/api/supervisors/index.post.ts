import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.phoneNumber || !body.nationalId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: fullName, email, phoneNumber, nationalId'
      })
    }

    // Create the supervisor
    const supervisor = await prisma.supervisor.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        nationalId: body.nationalId
      }
    })

    return {
      message: 'Supervisor created successfully',
      supervisor
    }
  } catch (error) {
    console.error('Error creating supervisor:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create supervisor'
    })
  }
}) 