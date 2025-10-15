import * as XLSX from 'xlsx/xlsx.mjs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const assessmentType = query.type as string || 'junior' // Default to junior

  // Define base columns that are common to all assessment types
  const baseHeaders = [
    'fullName','sex','candidateNo','email','schoolName','className',
    'supervisorFullName','supervisorEmail','supervisorPhoneNumber','supervisorNationalId',
    'assessmentDate','subject','topic','formType','selectedResearchCategory',
    'researchCategory1','researchCategory2','researchCategory3'
  ]

  // Define assessment type specific headers
  let typeSpecificHeaders: string[] = []
  let sampleData: any = {}

  if (assessmentType === 'ecd') {
    typeSpecificHeaders = [
      'preparationMark','preparationComment',
      'lessonFacilitationMark','lessonFacilitationComment',
      'deportmentMark','deportmentComment',
      'recordsMark','recordsComment',
      'environmentMark','environmentComment',
      'communityMark','communityComment',
      'remainingPillarsMark','remainingPillarsComment'
    ]
    sampleData = {
      preparationMark: 12, preparationComment: 'Well prepared',
      lessonFacilitationMark: 13, lessonFacilitationComment: 'Good facilitation',
      deportmentMark: 4, deportmentComment: 'Professional',
      recordsMark: 14, recordsComment: 'Complete records',
      environmentMark: 8, environmentComment: 'Orderly class',
      communityMark: 25, communityComment: 'Good community engagement',
      remainingPillarsMark: 8, remainingPillarsComment: 'Research & Innovation, Research & Industrialisation'
    }
  } else if (assessmentType === 'secondary') {
    typeSpecificHeaders = [
      'preparationMark','preparationComment',
      'lessonPlanningMark','lessonPlanningComment',
      'environmentMark','environmentComment',
      'documentsMark','documentsComment',
      'introductionMark','introductionComment',
      'developmentMark','developmentComment',
      'conclusionMark','conclusionComment',
      'personalDimensionsMark','personalDimensionsComment',
      'communityMark','communityComment',
      'remainingPillarsMark','remainingPillarsComment'
    ]
    sampleData = {
      preparationMark: 15, preparationComment: 'Well prepared',
      lessonPlanningMark: 17, lessonPlanningComment: 'Good lesson plan',
      environmentMark: 8, environmentComment: 'Orderly class',
      documentsMark: 9, documentsComment: 'Complete documents',
      introductionMark: 3, introductionComment: 'Clear introduction',
      developmentMark: 25, developmentComment: 'Strong delivery',
      conclusionMark: 3, conclusionComment: 'Good wrap-up',
      personalDimensionsMark: 4, personalDimensionsComment: 'Excellent',
      communityMark: 25, communityComment: 'Good community engagement',
      remainingPillarsMark: 8, remainingPillarsComment: 'Research & Innovation, Research & Industrialisation'
    }
  } else if (assessmentType === 'isen') {
    typeSpecificHeaders = [
      'preparationMark','preparationComment',
      'lessonPlanningMark','lessonPlanningComment',
      'environmentMark','environmentComment',
      'documentsMark','documentsComment',
      'introductionMark','introductionComment',
      'developmentMark','developmentComment',
      'conclusionMark','conclusionComment',
      'personalDimensionsMark','personalDimensionsComment',
      'communityMark','communityComment',
      'remainingPillarsMark','remainingPillarsComment'
    ]
    sampleData = {
      preparationMark: 15, preparationComment: 'Well prepared',
      lessonPlanningMark: 17, lessonPlanningComment: 'Good lesson plan',
      environmentMark: 8, environmentComment: 'Orderly class',
      documentsMark: 9, documentsComment: 'Complete documents',
      introductionMark: 3, introductionComment: 'Clear introduction',
      developmentMark: 25, developmentComment: 'Strong delivery',
      conclusionMark: 3, conclusionComment: 'Good wrap-up',
      personalDimensionsMark: 4, personalDimensionsComment: 'Excellent',
      communityMark: 25, communityComment: 'Good community engagement',
      remainingPillarsMark: 8, remainingPillarsComment: 'Research & Innovation, Research & Industrialisation'
    }
  } else if (assessmentType === 'materials') {
    typeSpecificHeaders = [
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
      'materialsTotalMark','materialsTotalPercentage'
    ]
    sampleData = {
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
      materialsTotalMark: 88, materialsTotalPercentage: 88
    }
  } else {
    // Default to junior/primary assessment
    typeSpecificHeaders = [
      'preparationMark','preparationComment',
      'lessonPlanningMark','lessonPlanningComment',
      'environmentMark','environmentComment',
      'documentsMark','documentsComment',
      'introductionMark','introductionComment',
      'developmentMark','developmentComment',
      'conclusionMark','conclusionComment',
      'personalDimensionsMark','personalDimensionsComment',
      'communityMark','communityComment',
      'remainingPillarsMark','remainingPillarsComment'
    ]
    sampleData = {
      preparationMark: 15, preparationComment: 'Well prepared',
      lessonPlanningMark: 17, lessonPlanningComment: 'Good lesson plan',
      environmentMark: 8, environmentComment: 'Orderly class',
      documentsMark: 9, documentsComment: 'Complete documents',
      introductionMark: 3, introductionComment: 'Clear introduction',
      developmentMark: 25, developmentComment: 'Strong delivery',
      conclusionMark: 3, conclusionComment: 'Good wrap-up',
      personalDimensionsMark: 4, personalDimensionsComment: 'Excellent',
      communityMark: 25, communityComment: 'Good community engagement',
      remainingPillarsMark: 8, remainingPillarsComment: 'Research & Innovation, Research & Industrialisation'
    }
  }

  // Combine base headers with type-specific headers
  const headers = [...baseHeaders, ...typeSpecificHeaders, 'supervisorDesignation', 'overallComment']

  // Create sample data based on assessment type
  const sample = [{
    fullName: 'Jane Doe', 
    sex: 'Female', 
    candidateNo: 'CND1234', 
    email: 'jane@example.com', 
    schoolName: 'Madziwa High', 
    className: 'Form 2',
    supervisorFullName: 'John Supervisor', 
    supervisorEmail: 'jsup@example.com', 
    supervisorPhoneNumber: '+263...', 
    supervisorNationalId: '12-345678 Z12',
    assessmentDate: '2025-08-01', 
    subject: 'Mathematics', 
    topic: 'Algebra', 
    formType: assessmentType,
    selectedResearchCategory: 'community_service',
    researchCategory1: 'Research-based Community Service',
    researchCategory2: 'Research & Innovation', 
    researchCategory3: 'Research & Industrialisation',
    ...sampleData,
    supervisorDesignation: 'Senior Lecturer',
    overallComment: `Excellent ${assessmentType} assessment work`
  }]

  const ws = XLSX.utils.json_to_sheet(sample, { header: headers })
  
  // Add data validation for research categories
  const researchCategories = [
    'Research-based Community Service',
    'Research & Innovation', 
    'Research & Industrialisation'
  ]
  
  // Find column indices for research category columns
  const researchCategory1Col = headers.indexOf('researchCategory1')
  const researchCategory2Col = headers.indexOf('researchCategory2') 
  const researchCategory3Col = headers.indexOf('researchCategory3')
  const selectedResearchCategoryCol = headers.indexOf('selectedResearchCategory')
  
  // Add data validation for research category selection
  if (researchCategory1Col !== -1) {
    ws['!dataValidation'] = ws['!dataValidation'] || []
    ws['!dataValidation'].push({
      ref: `B2:B1000`, // Column B (researchCategory1)
      type: 'list',
      formula1: `"${researchCategories.join(',')}"`
    })
  }
  
  if (researchCategory2Col !== -1) {
    ws['!dataValidation'].push({
      ref: `C2:C1000`, // Column C (researchCategory2) 
      type: 'list',
      formula1: `"${researchCategories.join(',')}"`
    })
  }
  
  if (researchCategory3Col !== -1) {
    ws['!dataValidation'].push({
      ref: `D2:D1000`, // Column D (researchCategory3)
      type: 'list', 
      formula1: `"${researchCategories.join(',')}"`
    })
  }
  
  if (selectedResearchCategoryCol !== -1) {
    ws['!dataValidation'].push({
      ref: `E2:E1000`, // Column E (selectedResearchCategory)
      type: 'list',
      formula1: `"${researchCategories.join(',')}"`
    })
  }
  
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Assessments')
  
  // Add instructions sheet
  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ['Assessment Template Instructions'],
    [''],
    ['Research Categories Selection:'],
    ['1. Select one category from the dropdown in the "selectedResearchCategory" column'],
    ['2. The remaining two categories will appear in the "remaining pillars" section'],
    ['3. Available categories:'],
    ['   - Research-based Community Service'],
    ['   - Research & Innovation'],
    ['   - Research & Industrialisation'],
    [''],
    ['Assessment Type Specific Criteria:'],
    ['- ECD: Preparation, Lesson Facilitation, Deportment, Records, Environment, Community, Remaining Pillars'],
    ['- Secondary/ISEN: Preparation, Lesson Planning, Environment, Documents, Introduction, Development, Conclusion, Personal Dimensions, Community, Remaining Pillars'],
    ['- Materials Development: Content, Pedagogical, Design, Innovation, Education categories'],
    [''],
    ['Instructions:'],
    ['1. Fill in student and supervisor information'],
    ['2. Select the appropriate research category'],
    ['3. Complete all assessment criteria with marks and comments'],
    ['4. Save and upload the completed template']
  ])
  
  XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions')
  
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', `attachment; filename="assessment-template-${assessmentType}.xlsx"`)
  return buffer
})

