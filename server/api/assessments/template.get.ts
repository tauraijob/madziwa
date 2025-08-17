import * as XLSX from 'xlsx/xlsx.mjs'

export default defineEventHandler(async (event) => {
  // Define columns and sample row
  const headers = [
    'fullName','sex','candidateNo','email','schoolName','className',
    'supervisorFullName','supervisorEmail','supervisorPhoneNumber','supervisorNationalId',
    'assessmentDate','subject','topic','formType',
    'preparationMark','preparationComment',
    'lessonPlanningMark','lessonPlanningComment',
    'environmentMark','environmentComment',
    'documentsMark','documentsComment',
    'introductionMark','introductionComment',
    'developmentMark','developmentComment',
    'conclusionMark','conclusionComment',
    'personalDimensionsMark','personalDimensionsComment',
    'communityMark','communityComment',
    'overallComment',
  ]

  const sample = [{
    fullName: 'Jane Doe', sex: 'Female', candidateNo: 'CND1234', email: 'jane@example.com', schoolName: 'Madziwa High', className: 'Form 2',
    supervisorFullName: 'John Supervisor', supervisorEmail: 'jsup@example.com', supervisorPhoneNumber: '+263...', supervisorNationalId: '12-345678 Z12',
    assessmentDate: '2025-08-01', subject: 'Mathematics', topic: 'Algebra', formType: 'junior',
    preparationMark: 18, preparationComment: 'Well prepared',
    lessonPlanningMark: 17, lessonPlanningComment: 'Good plan',
    environmentMark: 8, environmentComment: 'Orderly class',
    documentsMark: 9, documentsComment: 'Complete',
    introductionMark: 3, introductionComment: 'Clear intro',
    developmentMark: 25, developmentComment: 'Strong delivery',
    conclusionMark: 3, conclusionComment: 'Good wrap-up',
    personalDimensionsMark: 4, personalDimensionsComment: 'Excellent',
    communityMark: 10, communityComment: 'Project work',
    overallComment: 'Very good lesson'
  }]

  const ws = XLSX.utils.json_to_sheet(sample, { header: headers })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Assessments')
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="assessment-template.xlsx"')
  return buffer
})

