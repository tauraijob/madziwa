import * as XLSX from 'xlsx/xlsx.mjs'

export default defineEventHandler(async (event) => {
  // Define columns and sample row
  const headers = [
    'fullName','sex','candidateNo','email','schoolName','className',
    'supervisorFullName','supervisorEmail','supervisorPhoneNumber','supervisorNationalId',
    'assessmentDate','subject','topic','formType',
    // ECD/Junior/Secondary/ISEN fields
    'preparationMark','preparationComment',
    'lessonFacilitationMark','lessonFacilitationComment',
    'deportmentMark','deportmentComment',
    'recordsMark','recordsComment',
    'environmentMark','environmentComment',
    'communityMark','communityComment',
    'remainingPillarsMark','remainingPillarsComment',
    // Secondary/ISEN specific fields
    'lessonPlanningMark','lessonPlanningComment',
    'documentsMark','documentsComment',
    'introductionMark','introductionComment',
    'developmentMark','developmentComment',
    'conclusionMark','conclusionComment',
    'personalDimensionsMark','personalDimensionsComment',
    // Materials Development fields
    'contentRelevanceMark','contentRelevanceComment',
    'contentOrganizationMark','contentOrganizationComment',
    'contentTotalMark','contentComment',
    'pedagogicalAlignmentMark','pedagogicalAlignmentComment',
    'pedagogicalEngagementMark','pedagogicalEngagementComment',
    'pedagogicalConnectionMark','pedagogicalConnectionComment',
    'pedagogicalInclusiveMark','pedagogicalInclusiveComment',
    'pedagogicalTotalMark','pedagogicalComment',
    'designVisualMark','designVisualComment',
    'designNavigationMark','designNavigationComment',
    'designQualityMark','designQualityComment',
    'designConsistencyMark','designConsistencyComment',
    'designTotalMark','designComment',
    'innovationOriginalityMark','innovationOriginalityComment',
    'innovationTechnologyMark','innovationTechnologyComment',
    'innovationTotalMark','innovationComment',
    'educationLocalMark','educationLocalComment',
    'educationHeritageMark','educationHeritageComment',
    'educationProblemMark','educationProblemComment',
    'educationCommercialMark','educationCommercialComment',
    'educationTotalMark','educationComment',
    'materialsTotalMark','materialsTotalPercentage',
    'supervisorDesignation',
    'overallComment',
  ]

  const sample = [{
    fullName: 'Jane Doe', sex: 'Female', candidateNo: 'CND1234', email: 'jane@example.com', schoolName: 'Madziwa High', className: 'Form 2',
    supervisorFullName: 'John Supervisor', supervisorEmail: 'jsup@example.com', supervisorPhoneNumber: '+263...', supervisorNationalId: '12-345678 Z12',
    assessmentDate: '2025-08-01', subject: 'Mathematics', topic: 'Algebra', formType: 'junior',
    // ECD/Junior fields
    preparationMark: 12, preparationComment: 'Well prepared',
    lessonFacilitationMark: 13, lessonFacilitationComment: 'Good facilitation',
    deportmentMark: 4, deportmentComment: 'Professional',
    recordsMark: 14, recordsComment: 'Complete records',
    environmentMark: 8, environmentComment: 'Orderly class',
    communityMark: 25, communityComment: 'Good community engagement',
    remainingPillarsMark: 8, remainingPillarsComment: 'Other pillars covered',
    // Secondary/ISEN fields
    lessonPlanningMark: 17, lessonPlanningComment: 'Good plan',
    documentsMark: 9, documentsComment: 'Complete',
    introductionMark: 3, introductionComment: 'Clear intro',
    developmentMark: 25, developmentComment: 'Strong delivery',
    conclusionMark: 3, conclusionComment: 'Good wrap-up',
    personalDimensionsMark: 4, personalDimensionsComment: 'Excellent',
    // Materials Development fields
    contentRelevanceMark: 8, contentRelevanceComment: 'Highly relevant',
    contentOrganizationMark: 9, contentOrganizationComment: 'Well organized',
    contentTotalMark: 17, contentComment: 'Strong content',
    pedagogicalAlignmentMark: 4, pedagogicalAlignmentComment: 'Well aligned',
    pedagogicalEngagementMark: 5, pedagogicalEngagementComment: 'Highly engaging',
    pedagogicalConnectionMark: 4, pedagogicalConnectionComment: 'Good connections',
    pedagogicalInclusiveMark: 5, pedagogicalInclusiveComment: 'Inclusive design',
    pedagogicalTotalMark: 18, pedagogicalComment: 'Excellent pedagogy',
    designVisualMark: 4, designVisualComment: 'Good visuals',
    designNavigationMark: 5, designNavigationComment: 'Easy navigation',
    designQualityMark: 4, designQualityComment: 'High quality',
    designConsistencyMark: 5, designConsistencyComment: 'Consistent design',
    designTotalMark: 18, designComment: 'Great design',
    innovationOriginalityMark: 8, innovationOriginalityComment: 'Very original',
    innovationTechnologyMark: 9, innovationTechnologyComment: 'Good tech use',
    innovationTotalMark: 17, innovationComment: 'Innovative approach',
    educationLocalMark: 4, educationLocalComment: 'Local relevance',
    educationHeritageMark: 5, educationHeritageComment: 'Cultural heritage',
    educationProblemMark: 4, educationProblemComment: 'Problem solving',
    educationCommercialMark: 5, educationCommercialComment: 'Commercial viability',
    educationTotalMark: 18, educationComment: 'Education 5.0 compliant',
    materialsTotalMark: 88, materialsTotalPercentage: 88,
    supervisorDesignation: 'Senior Lecturer',
    overallComment: 'Excellent materials development work'
  }]

  const ws = XLSX.utils.json_to_sheet(sample, { header: headers })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Assessments')
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="assessment-template.xlsx"')
  return buffer
})

