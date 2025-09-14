import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin can create supervisors
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may create supervisors' })
    }

    const body = await readBody(event)
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.phoneNumber || !body.nationalId || !body.pin || !body.districtId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: fullName, email, phoneNumber, nationalId, pin, districtId'
      })
    }

    const sha256 = (input: string) => crypto.createHash('sha256').update(input).digest('hex')

    // Create the supervisor
    const supervisor = await prisma.supervisor.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        passwordHash: sha256(String(body.pin)),
        pinHash: sha256(String(body.pin)),
        phoneNumber: body.phoneNumber,
        nationalId: body.nationalId,
        districtId: parseInt(String(body.districtId))
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