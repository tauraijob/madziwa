import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to calculate grade based on percentage
function calculateGrade(percentage: number): string {
  if (percentage >= 80) return '1'
  if (percentage >= 70) return '2.1'
  if (percentage >= 60) return '2.2'
  if (percentage >= 50) return '3'
  return 'F'
}

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    // For admin users, filter by their assigned district
    if (role === 'admin' && adminDistrictId) {
      where.student = { districtId: adminDistrictId }
    }
    // For superadmin, download all assessments

    const assessments = await prisma.assessment.findMany({
      where,
      include: { student: { include: { district: true } }, supervisor: true },
      orderBy: { createdAt: 'desc' }
    })

    // Debug logging
    console.log(`Total assessments found: ${assessments.length}`)
    console.log('Form types found:', [...new Set(assessments.map(a => a.formType || 'null'))])
    console.log('Sample assessments:', assessments.slice(0, 3).map(a => ({
      id: a.id,
      studentName: a.student.fullName,
      formType: a.formType,
      totalMarks: (a.preparationMark || 0) + (a.lessonPlanningMark || 0) + (a.personalDimensionsMark || 0) + (a.documentsMark || 0) + (a.environmentMark || 0) + (a.developmentMark || 0) + (a.communityMark || 0) + (a.introductionMark || 0) + (a.conclusionMark || 0) + (a.contentQualityMark || 0) + (a.pedagogicalValueMark || 0) + (a.designLayoutMark || 0) + (a.innovationCreativityMark || 0) + (a.educationComplianceMark || 0)
    })))

    // Separate assessments by type
    const ecdAssessments = assessments.filter(a => a.formType === 'ecd')
    const juniorAssessments = assessments.filter(a => a.formType === 'junior')
    const materialsAssessments = assessments.filter(a => a.formType === 'materials')
    const otherAssessments = assessments.filter(a => !['ecd', 'junior', 'materials'].includes(a.formType || ''))

    console.log(`ECD assessments: ${ecdAssessments.length}`)
    console.log(`Junior assessments: ${juniorAssessments.length}`)
    console.log(`Materials assessments: ${materialsAssessments.length}`)
    console.log(`Other assessments: ${otherAssessments.length}`)

    // Generate CSV for each assessment type
    const csvData = []

    // ECD Assessments CSV
    if (ecdAssessments.length > 0) {
      const ecdHeaders = [
        'Student Full Name', 'Candidate Number', 'District', 'School', 'Class', 'Sex', 'Email', 'Phone',
        'Subject', 'Topic', 'Assessment Date', 'Selected Category', 'Remaining 2 Pillars',
        'Preparation Mark (15)', 'Preparation Comment',
        'Lesson Facilitation Mark (15)', 'Lesson Facilitation Comment',
        'Deportment Mark (5)', 'Deportment Comment',
        'Records Management Mark (15)', 'Records Management Comment',
        'Teaching and Learning Environment Mark (10)', 'Teaching and Learning Environment Comment',
        'Selectable 3 Categories Mark (30)', 'Selectable 3 Categories Comment',
        'Remaining 2 Pillars Mark (10)', 'Remaining 2 Pillars Comment',
        'Overall Comment', 'Total Mark', 'Percentage', 'Grade'
      ]

      const ecdRows = ecdAssessments.map(a => {
        // Calculate total mark for ECD (max 100)
        const totalMark = (a.preparationMark || 0) + 
                         (a.lessonPlanningMark || 0) + 
                         (a.personalDimensionsMark || 0) + 
                         (a.documentsMark || 0) + 
                         (a.environmentMark || 0) + 
                         (a.developmentMark || 0) + 
                         (a.communityMark || 0)
        
        const percentage = Math.round((totalMark / 100) * 100)
        const grade = calculateGrade(percentage)
        
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
          a.selectedCategory || '',
          a.remainingPillars || '',
          a.preparationMark || '', a.preparationComment || '',
          a.lessonPlanningMark || '', a.lessonPlanningComment || '',
          a.personalDimensionsMark || '', a.personalDimensionsComment || '',
          a.documentsMark || '', a.documentsComment || '',
          a.environmentMark || '', a.environmentComment || '',
          a.developmentMark || '', a.developmentComment || '',
          a.communityMark || '', a.communityComment || '',
          a.overallComment || '',
          totalMark,
          percentage + '%',
          grade
        ]
      })

      const ecdCsv = [ecdHeaders.join(','), ...ecdRows.map(r => r.map(v => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }).join(','))].join('\n')

      csvData.push({ type: 'ECD', data: ecdCsv })
    }

    // Junior Assessments CSV
    if (juniorAssessments.length > 0) {
      const juniorHeaders = [
        'Student Full Name', 'Candidate Number', 'District', 'School', 'Class', 'Sex', 'Email', 'Phone',
        'Subject', 'Topic', 'Assessment Date', 'Selected Category', 'Remaining 2 Pillars',
        'Preparation Mark (15)', 'Preparation Comment',
        'Lesson Facilitation Mark (15)', 'Lesson Facilitation Comment',
        'Deportment Mark (5)', 'Deportment Comment',
        'Records Management Mark (15)', 'Records Management Comment',
        'Teaching and Learning Environment Mark (10)', 'Teaching and Learning Environment Comment',
        'Selectable 3 Categories Mark (30)', 'Selectable 3 Categories Comment',
        'Remaining 2 Pillars Mark (10)', 'Remaining 2 Pillars Comment',
        'Overall Comment', 'Total Mark', 'Percentage', 'Grade'
      ]

      const juniorRows = juniorAssessments.map(a => {
        // Calculate total mark for Junior (max 100)
        const totalMark = (a.preparationMark || 0) + 
                         (a.lessonPlanningMark || 0) + 
                         (a.personalDimensionsMark || 0) + 
                         (a.documentsMark || 0) + 
                         (a.environmentMark || 0) + 
                         (a.developmentMark || 0) + 
                         (a.communityMark || 0)
        
        const percentage = Math.round((totalMark / 100) * 100)
        const grade = calculateGrade(percentage)
        
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
          a.selectedCategory || '',
          a.remainingPillars || '',
          a.preparationMark || '', a.preparationComment || '',
          a.lessonPlanningMark || '', a.lessonPlanningComment || '',
          a.personalDimensionsMark || '', a.personalDimensionsComment || '',
          a.documentsMark || '', a.documentsComment || '',
          a.environmentMark || '', a.environmentComment || '',
          a.developmentMark || '', a.developmentComment || '',
          a.communityMark || '', a.communityComment || '',
          a.overallComment || '',
          totalMark,
          percentage + '%',
          grade
        ]
      })

      const juniorCsv = [juniorHeaders.join(','), ...juniorRows.map(r => r.map(v => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }).join(','))].join('\n')

      csvData.push({ type: 'Junior', data: juniorCsv })
    }

    // Materials Development Assessments CSV
    if (materialsAssessments.length > 0) {
      const materialsHeaders = [
        'Student Full Name', 'Candidate Number', 'District', 'School', 'Class', 'Sex', 'Email', 'Phone',
        'Subject', 'Topic', 'Assessment Date',
        'Content Quality Mark (20)', 'Content Quality Comment',
        'Content Relevance Mark (10)', 'Content Relevance Comment',
        'Content Organization Mark (10)', 'Content Organization Comment',
        'Pedagogical Value Mark (20)', 'Pedagogical Value Comment',
        'Pedagogical Alignment Mark (5)', 'Pedagogical Alignment Comment',
        'Pedagogical Engagement Mark (5)', 'Pedagogical Engagement Comment',
        'Pedagogical Connection Mark (5)', 'Pedagogical Connection Comment',
        'Pedagogical Inclusive Mark (5)', 'Pedagogical Inclusive Comment',
        'Design & Layout Mark (20)', 'Design & Layout Comment',
        'Visual Appeal Mark (5)', 'Visual Appeal Comment',
        'Navigation Mark (5)', 'Navigation Comment',
        'Quality Presentation Mark (5)', 'Quality Presentation Comment',
        'Consistency Design Mark (5)', 'Consistency Design Comment',
        'Innovation & Creativity Mark (20)', 'Innovation & Creativity Comment',
        'Originality Mark (10)', 'Originality Comment',
        'Technology Use Mark (10)', 'Technology Use Comment',
        'Education 5.0 Compliance Mark (20)', 'Education 5.0 Compliance Comment',
        'Local Content Mark (5)', 'Local Content Comment',
        'Cultural Heritage Mark (5)', 'Cultural Heritage Comment',
        'Problem Solving Mark (5)', 'Problem Solving Comment',
        'Commercial Viability Mark (5)', 'Commercial Viability Comment',
        'Overall Comment', 'Total Mark', 'Percentage', 'Grade'
      ]

      const materialsRows = materialsAssessments.map(a => {
        // Calculate total mark for Materials Development (max 100)
        const totalMark = (a.contentQualityMark || 0) + 
                         (a.pedagogicalValueMark || 0) + 
                         (a.designLayoutMark || 0) + 
                         (a.innovationCreativityMark || 0) + 
                         (a.educationComplianceMark || 0)
        
        const percentage = Math.round((totalMark / 100) * 100)
        const grade = calculateGrade(percentage)
        
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
          a.contentQualityMark || '', a.contentQualityComment || '',
          a.contentRelevanceMark || '', a.contentRelevanceComment || '',
          a.contentOrganizationMark || '', a.contentOrganizationComment || '',
          a.pedagogicalValueMark || '', a.pedagogicalValueComment || '',
          a.pedagogicalAlignmentMark || '', a.pedagogicalAlignmentComment || '',
          a.pedagogicalEngagementMark || '', a.pedagogicalEngagementComment || '',
          a.pedagogicalConnectionMark || '', a.pedagogicalConnectionComment || '',
          a.pedagogicalInclusiveMark || '', a.pedagogicalInclusiveComment || '',
          a.designLayoutMark || '', a.designLayoutComment || '',
          a.visualAppealMark || '', a.visualAppealComment || '',
          a.navigationMark || '', a.navigationComment || '',
          a.qualityPresentationMark || '', a.qualityPresentationComment || '',
          a.consistencyDesignMark || '', a.consistencyDesignComment || '',
          a.innovationCreativityMark || '', a.innovationCreativityComment || '',
          a.originalityMark || '', a.originalityComment || '',
          a.technologyUseMark || '', a.technologyUseComment || '',
          a.educationComplianceMark || '', a.educationComplianceComment || '',
          a.localContentMark || '', a.localContentComment || '',
          a.culturalHeritageMark || '', a.culturalHeritageComment || '',
          a.problemSolvingMark || '', a.problemSolvingComment || '',
          a.commercialViabilityMark || '', a.commercialViabilityComment || '',
          a.overallComment || '',
          totalMark,
          percentage + '%',
          grade
        ]
      })

      const materialsCsv = [materialsHeaders.join(','), ...materialsRows.map(r => r.map(v => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }).join(','))].join('\n')

      csvData.push({ type: 'Materials', data: materialsCsv })
    }

    // Other Assessments CSV (catch-all for any formType not covered above)
    if (otherAssessments.length > 0) {
      const otherHeaders = [
        'Student Name', 'Candidate Number', 'District', 'School', 'Class', 'Sex', 'Email', 'Phone',
        'Subject', 'Topic', 'Assessment Date', 'Form Type',
        'Preparation Mark', 'Preparation Comment',
        'Lesson Planning Mark', 'Lesson Planning Comment',
        'Personal Dimensions Mark', 'Personal Dimensions Comment',
        'Documents Mark', 'Documents Comment',
        'Environment Mark', 'Environment Comment',
        'Introduction Mark', 'Introduction Comment',
        'Development Mark', 'Development Comment',
        'Conclusion Mark', 'Conclusion Comment',
        'Community Mark', 'Community Comment',
        'Content Quality Mark', 'Content Quality Comment',
        'Pedagogical Value Mark', 'Pedagogical Value Comment',
        'Design Layout Mark', 'Design Layout Comment',
        'Innovation Creativity Mark', 'Innovation Creativity Comment',
        'Education Compliance Mark', 'Education Compliance Comment',
        'Selected Category', 'Remaining Pillars',
        'Overall Comment', 'Total Mark', 'Percentage', 'Grade'
      ]

      const otherRows = otherAssessments.map(a => {
        // Calculate total mark for other assessments (comprehensive calculation)
        const totalMark = (a.preparationMark || 0) + 
                         (a.lessonPlanningMark || 0) + 
                         (a.personalDimensionsMark || 0) + 
                         (a.documentsMark || 0) + 
                         (a.environmentMark || 0) + 
                         (a.introductionMark || 0) + 
                         (a.developmentMark || 0) + 
                         (a.conclusionMark || 0) + 
                         (a.communityMark || 0) + 
                         (a.contentQualityMark || 0) + 
                         (a.pedagogicalValueMark || 0) + 
                         (a.designLayoutMark || 0) + 
                         (a.innovationCreativityMark || 0) + 
                         (a.educationComplianceMark || 0)
        
        const percentage = Math.round((totalMark / 100) * 100)
        const grade = calculateGrade(percentage)
        
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
          a.formType || 'Unknown',
          a.preparationMark || '', a.preparationComment || '',
          a.lessonPlanningMark || '', a.lessonPlanningComment || '',
          a.personalDimensionsMark || '', a.personalDimensionsComment || '',
          a.documentsMark || '', a.documentsComment || '',
          a.environmentMark || '', a.environmentComment || '',
          a.introductionMark || '', a.introductionComment || '',
          a.developmentMark || '', a.developmentComment || '',
          a.conclusionMark || '', a.conclusionComment || '',
          a.communityMark || '', a.communityComment || '',
          a.contentQualityMark || '', a.contentQualityComment || '',
          a.pedagogicalValueMark || '', a.pedagogicalValueComment || '',
          a.designLayoutMark || '', a.designLayoutComment || '',
          a.innovationCreativityMark || '', a.innovationCreativityComment || '',
          a.educationComplianceMark || '', a.educationComplianceComment || '',
          a.selectedCategory || '', a.remainingPillars || '',
          a.overallComment || '',
          totalMark,
          percentage + '%',
          grade
        ]
      })

      const otherCsv = [otherHeaders.join(','), ...otherRows.map(r => r.map(v => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }).join(','))].join('\n')

      csvData.push({ type: 'Other', data: otherCsv })
    }

    // Return the CSV data as JSON for the frontend to handle
    return { csvData }
  } catch (error) {
    console.error('Export CSV failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to export CSV' })
  }
})

