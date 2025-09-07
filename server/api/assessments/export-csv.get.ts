import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    // Disallow admins from using downloads (view-only)
    if (role === 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Admins are view-only. Downloads disabled.' })
    }
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    // role === 'superadmin' downloads all; admins already blocked above

    const assessments = await prisma.assessment.findMany({
      where,
      include: { student: { include: { district: true } }, supervisor: true },
      orderBy: { createdAt: 'desc' }
    })

    const headers = [
      'Student Full Name', 'Candidate Number', 'District', 'School', 'Class', 'Sex', 'Email', 'Phone',
      'Subject', 'Topic', 'Assessment Date',
      'Preparation Mark', 'Preparation Comment',
      'Lesson Planning Mark', 'Lesson Planning Comment',
      'Environment Mark', 'Environment Comment',
      'Documents Mark', 'Documents Comment',
      'Introduction Mark', 'Introduction Comment',
      'Development Mark', 'Development Comment',
      'Conclusion Mark', 'Conclusion Comment',
      'Personal Dimensions Mark', 'Personal Dimensions Comment',
      'Community Mark', 'Community Comment',
      'Overall Comment', 'Total Mark'
    ]

    const rows = assessments.map(a => {
      const total = a.preparationMark + a.lessonPlanningMark + a.environmentMark + a.documentsMark + a.introductionMark + a.developmentMark + a.conclusionMark + a.personalDimensionsMark + (a.communityMark || 0)
      return [
        a.student.fullName,
        a.student.candidateNo,
        a.student.district?.name || '',
        a.student.schoolName,
        a.student.className,
        a.student.sex,
        a.student.email,
        a.student.phoneNumber || '',
        a.subject,
        a.topic,
        a.assessmentDate.toISOString().split('T')[0],
        a.preparationMark, a.preparationComment,
        a.lessonPlanningMark, a.lessonPlanningComment,
        a.environmentMark, a.environmentComment,
        a.documentsMark, a.documentsComment,
        a.introductionMark, a.introductionComment,
        a.developmentMark, a.developmentComment,
        a.conclusionMark, a.conclusionComment,
        a.personalDimensionsMark, a.personalDimensionsComment,
        a.communityMark || 0, a.communityComment || '',
        a.overallComment,
        total
      ]
    })

    const csv = [headers.join(','), ...rows.map(r => r.map(v => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))].join('\n')

    setHeader(event, 'Content-Type', 'text/csv')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessments-${new Date().toISOString().split('T')[0]}.csv"`)
    return csv
  } catch (error) {
    console.error('Export CSV failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to export CSV' })
  }
})

