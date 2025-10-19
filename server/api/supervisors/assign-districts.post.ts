import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect()
    
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may assign supervisor districts' })
    }

    const body = await readBody(event)
    const { supervisorId, districtIds } = body

    if (!supervisorId || !Array.isArray(districtIds)) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'supervisorId and districtIds array required' 
      })
    }

    const supervisor = await prisma.supervisor.findUnique({
      where: { id: parseInt(String(supervisorId)) },
      include: { 
        district: true
      }
    })

    if (!supervisor) {
      throw createError({ statusCode: 404, statusMessage: 'Supervisor not found' })
    }

    // Remove existing district assignments
    await prisma.supervisorDistrict.deleteMany({
      where: { supervisorId: parseInt(String(supervisorId)) }
    })

    // Add new district assignments
    const assignments = districtIds.map((districtId: number) => ({
      supervisorId: parseInt(String(supervisorId)),
      districtId: parseInt(String(districtId))
    }))

    if (assignments.length > 0) {
      await prisma.supervisorDistrict.createMany({
        data: assignments
      })
    }

    // Update primary district (first one in the list)
    const primaryDistrictId = districtIds.length > 0 ? parseInt(String(districtIds[0])) : null
    await prisma.supervisor.update({
      where: { id: parseInt(String(supervisorId)) },
      data: { districtId: primaryDistrictId }
    })

    return { 
      message: 'Supervisor districts updated successfully',
      assignedDistricts: districtIds.length
    }
  } catch (error) {
    console.error('Error assigning supervisor districts:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to assign supervisor districts: ${error.message}` 
    })
  } finally {
    await prisma.$disconnect()
  }
})
