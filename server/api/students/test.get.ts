import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get total count of students
    const totalStudents = await prisma.student.count()
    
    // Get first 5 students as sample
    const sampleStudents = await prisma.student.findMany({
      take: 5,
      include: { district: true },
      orderBy: { fullName: 'asc' }
    })
    
    return {
      totalStudents,
      sampleStudents,
      message: 'Database connection working'
    }
  } catch (error) {
    console.error('Error testing students:', error)
    return {
      error: error.message,
      totalStudents: 0,
      sampleStudents: []
    }
  }
})

