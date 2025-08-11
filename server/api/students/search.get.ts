import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as { candidateNo?: string; surname?: string }

    const where: any = {}

    if (query.candidateNo && query.candidateNo.trim() !== '') {
      where.candidateNo = query.candidateNo.trim()
    }

    if (query.surname && query.surname.trim() !== '') {
      where.fullName = { contains: query.surname.trim(), mode: 'insensitive' as const }
    }

    // If no filters provided, return empty list to avoid dumping all students
    if (!where.candidateNo && !where.fullName) {
      return { students: [] }
    }

    const students = await prisma.student.findMany({ where, orderBy: { fullName: 'asc' } })

    return { students }
  } catch (error) {
    console.error('Error searching students:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to search students' })
  }
})