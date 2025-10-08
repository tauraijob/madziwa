import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin may access this data
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may access this data' })
    }

    // Count total students in the system
    const totalStudents = await prisma.student.count()

    // For now, we'll assume all students were imported via CSV since there's no other way to add them
    // In the future, we could add a field to track the import method
    const csvImportedStudents = totalStudents

    return {
      csvImportedStudents,
      totalStudents
    }
  } catch (error) {
    console.error('Error fetching CSV imported students count:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch CSV imported students count'
    })
  }
})
