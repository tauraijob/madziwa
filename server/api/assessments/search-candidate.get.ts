import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = String(query.search || '').trim()
    
    if (!searchTerm) {
      throw createError({ statusCode: 400, statusMessage: 'Search term required' })
    }

    // Search for students by name or candidate number
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { fullName: { contains: searchTerm, mode: 'insensitive' } },
          { candidateNo: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        district: true,
        assessments: {
          include: {
            supervisor: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Also search for assessments directly
    const assessments = await prisma.assessment.findMany({
      where: {
        OR: [
          { student: { fullName: { contains: searchTerm, mode: 'insensitive' } } },
          { student: { candidateNo: { contains: searchTerm, mode: 'insensitive' } } }
        ]
      },
      include: {
        student: { include: { district: true } },
        supervisor: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      students: students.map(s => ({
        id: s.id,
        fullName: s.fullName,
        candidateNo: s.candidateNo,
        district: s.district?.name,
        schoolName: s.schoolName,
        className: s.className,
        assessmentCount: s.assessments.length,
        assessments: s.assessments.map(a => ({
          id: a.id,
          formType: a.formType,
          subject: a.subject,
          topic: a.topic,
          assessmentDate: a.assessmentDate,
          totalMarks: (a.preparationMark || 0) + (a.lessonPlanningMark || 0) + (a.personalDimensionsMark || 0) + (a.documentsMark || 0) + (a.environmentMark || 0) + (a.developmentMark || 0) + (a.communityMark || 0) + (a.introductionMark || 0) + (a.conclusionMark || 0) + (a.contentQualityMark || 0) + (a.pedagogicalValueMark || 0) + (a.designLayoutMark || 0) + (a.innovationCreativityMark || 0) + (a.educationComplianceMark || 0)
        }))
      })),
      assessments: assessments.map(a => ({
        id: a.id,
        formType: a.formType,
        subject: a.subject,
        topic: a.topic,
        assessmentDate: a.assessmentDate,
        studentName: a.student.fullName,
        candidateNo: a.student.candidateNo,
        district: a.student.district?.name,
        totalMarks: (a.preparationMark || 0) + (a.lessonPlanningMark || 0) + (a.personalDimensionsMark || 0) + (a.documentsMark || 0) + (a.environmentMark || 0) + (a.developmentMark || 0) + (a.communityMark || 0) + (a.introductionMark || 0) + (a.conclusionMark || 0) + (a.contentQualityMark || 0) + (a.pedagogicalValueMark || 0) + (a.designLayoutMark || 0) + (a.innovationCreativityMark || 0) + (a.educationComplianceMark || 0)
      }))
    }
  } catch (error) {
    console.error('Search candidate failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Search failed' })
  }
})
