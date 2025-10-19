import { PrismaClient } from '@prisma/client'
import type { H3Event } from 'h3'
import { createError, getCookie, readMultipartFormData, defineEventHandler } from 'h3'
import * as XLSX from 'xlsx/xlsx.mjs'

const prisma = new PrismaClient()

type ImportRow = Record<string, any>

const MAX = {
  // ECD/Junior fields
  preparationMark: 15,
  lessonFacilitationMark: 15,
  deportmentMark: 5,
  recordsMark: 15,
  environmentMark: 10,
  communityMark: 30,
  remainingPillarsMark: 10,
  // Secondary/ISEN fields
  lessonPlanningMark: 20,
  documentsMark: 10,
  introductionMark: 3,
  developmentMark: 30,
  conclusionMark: 3,
  personalDimensionsMark: 4,
  // Materials Development fields
  contentRelevanceMark: 10,
  contentOrganizationMark: 10,
  contentTotalMark: 20,
  pedagogicalAlignmentMark: 5,
  pedagogicalEngagementMark: 5,
  pedagogicalConnectionMark: 5,
  pedagogicalInclusiveMark: 5,
  pedagogicalTotalMark: 20,
  designVisualMark: 5,
  designNavigationMark: 5,
  designQualityMark: 5,
  designConsistencyMark: 5,
  designTotalMark: 20,
  innovationOriginalityMark: 10,
  innovationTechnologyMark: 10,
  innovationTotalMark: 20,
  educationLocalMark: 5,
  educationHeritageMark: 5,
  educationProblemMark: 5,
  educationCommercialMark: 5,
  educationTotalMark: 20,
  materialsTotalMark: 100,
  materialsTotalPercentage: 100,
}

function clampNumber(value: any, max: number): number {
  const n = Number(value)
  if (Number.isNaN(n) || n < 0) return 0
  return Math.min(Math.round(n), max)
}

function parseDate(input: any): Date | null {
  if (!input) return null
  if (input instanceof Date) return input
  // Excel might give numbers (serials) or strings
  const asNumber = Number(input)
  if (!Number.isNaN(asNumber) && asNumber > 25569) {
    // Excel serial date to JS Date
    const utcDays = Math.floor(asNumber - 25569)
    return new Date(utcDays * 86400 * 1000)
  }
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
}

function validateMark(value: any, fieldName: string, maxValue: number): { isValid: boolean; error?: string; correctedValue?: number } {
  const num = Number(value)
  
  // Check if value is a valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName}: "${value}" is not a valid number. Please enter a numeric value.`
    }
  }
  
  // Check if value is negative
  if (num < 0) {
    return {
      isValid: false,
      error: `${fieldName}: "${num}" is negative. Marks cannot be negative. Please enter a value between 0 and ${maxValue}.`
    }
  }
  
  // Check if value exceeds maximum
  if (num > maxValue) {
    return {
      isValid: false,
      error: `${fieldName}: "${num}" exceeds the maximum allowed value of ${maxValue}. Please enter a value between 0 and ${maxValue}.`,
      correctedValue: maxValue
    }
  }
  
  // Check if value is a whole number (no decimals)
  if (num % 1 !== 0) {
    return {
      isValid: false,
      error: `${fieldName}: "${num}" contains decimals. Please enter a whole number between 0 and ${maxValue}.`,
      correctedValue: Math.round(num)
    }
  }
  
  return { isValid: true }
}

function simplifyKey(key: string): string {
  return String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function normalizeRow(row: ImportRow): ImportRow {
  const canonical: Record<string, string> = {
    fullname: 'fullName',
    sex: 'sex',
    candidateno: 'candidateNo',
    studentcandidate: 'candidateNo', // Map STUDENT CANDIDATE to candidateNo
    email: 'email',
    schoolname: 'schoolName',
    classname: 'className',
    supervisorfullname: 'supervisorFullName',
    supervisoremail: 'supervisorEmail',
    supervisorphonenumber: 'supervisorPhoneNumber',
    supervisornationalid: 'supervisorNationalId',
    assessmentdate: 'assessmentDate',
    subject: 'subject',
    topic: 'topic',
    formtype: 'formType',
    // Additional mappings for template headers
    'student candidate': 'candidateNo',
    'assessment date': 'assessmentDate',
    'selected category': 'selectedCategory',
    'remaining 2 pillars': 'remainingPillars',
    // ECD/Junior/Secondary/ISEN fields
    preparationmark: 'preparationMark',
    preparationcomment: 'preparationComment',
    lessonfacilitationmark: 'lessonFacilitationMark',
    lessonfacilitationcomment: 'lessonFacilitationComment',
    deportmentmark: 'deportmentMark',
    deportmentcomment: 'deportmentComment',
    recordsmark: 'recordsMark',
    recordscomment: 'recordsComment',
    environmentmark: 'environmentMark',
    environmentcomment: 'environmentComment',
    communitymark: 'communityMark',
    communitycomment: 'communityComment',
    remainingpillarsmark: 'remainingPillarsMark',
    remainingpillarscomment: 'remainingPillarsComment',
    // Secondary/ISEN specific fields
    lessonplanningmark: 'lessonPlanningMark',
    lessonplanningcomment: 'lessonPlanningComment',
    documentsmark: 'documentsMark',
    documentscomment: 'documentsComment',
    documentmark: 'documentsMark',
    documentcomment: 'documentsComment',
    introductionmark: 'introductionMark',
    introductioncomment: 'introductionComment',
    developmentmark: 'developmentMark',
    developmentcomment: 'developmentComment',
    conclusionmark: 'conclusionMark',
    conclusioncomment: 'conclusionComment',
    personaldimensionsmark: 'personalDimensionsMark',
    personaldimensionscomment: 'personalDimensionsComment',
    personalmark: 'personalDimensionsMark',
    personalcomment: 'personalDimensionsComment',
    // Materials Development fields
    contentrelevancemark: 'contentRelevanceMark',
    contentrelevancecomment: 'contentRelevanceComment',
    contentorganizationmark: 'contentOrganizationMark',
    contentorganizationcomment: 'contentOrganizationComment',
    contenttotalmark: 'contentTotalMark',
    contentcomment: 'contentComment',
    pedagogicalalignmentmark: 'pedagogicalAlignmentMark',
    pedagogicalalignmentcomment: 'pedagogicalAlignmentComment',
    pedagogicalengagementmark: 'pedagogicalEngagementMark',
    pedagogicalengagementcomment: 'pedagogicalEngagementComment',
    pedagogicalconnectionmark: 'pedagogicalConnectionMark',
    pedagogicalconnectioncomment: 'pedagogicalConnectionComment',
    pedagogicalinclusivemark: 'pedagogicalInclusiveMark',
    pedagogicalinclusivecomment: 'pedagogicalInclusiveComment',
    pedagogicaltotalmark: 'pedagogicalTotalMark',
    pedagogicalcomment: 'pedagogicalComment',
    designvisualmark: 'designVisualMark',
    designvisualcomment: 'designVisualComment',
    designnavigationmark: 'designNavigationMark',
    designnavigationcomment: 'designNavigationComment',
    designqualitymark: 'designQualityMark',
    designqualitycomment: 'designQualityComment',
    designconsistencymark: 'designConsistencyMark',
    designconsistencycomment: 'designConsistencyComment',
    designtotalmark: 'designTotalMark',
    designcomment: 'designComment',
    innovationoriginalitymark: 'innovationOriginalityMark',
    innovationoriginalitycomment: 'innovationOriginalityComment',
    innovationtechnologymark: 'innovationTechnologyMark',
    innovationtechnologycomment: 'innovationTechnologyComment',
    innovationtotalmark: 'innovationTotalMark',
    innovationcomment: 'innovationComment',
    educationlocalmark: 'educationLocalMark',
    educationlocalcomment: 'educationLocalComment',
    educationheritagemark: 'educationHeritageMark',
    educationheritagecomment: 'educationHeritageComment',
    educationproblemmark: 'educationProblemMark',
    educationproblemcomment: 'educationProblemComment',
    educationcommercialmark: 'educationCommercialMark',
    educationcommercialcomment: 'educationCommercialComment',
    educationtotalmark: 'educationTotalMark',
    educationcomment: 'educationComment',
    materialstotalmark: 'materialsTotalMark',
    materialstotalpercentage: 'materialsTotalPercentage',
    supervisordesignation: 'supervisorDesignation',
    selectedresearchcategory: 'selectedResearchCategory',
    researchcategory: 'selectedResearchCategory',
    selectedcategory: 'selectedCategory',
    remainingpillars: 'remainingPillars',
    overallcomment: 'overallComment',
  }

  const normalized: ImportRow = {}
  for (const [k, v] of Object.entries(row)) {
    const simp = simplifyKey(k)
    const target = canonical[simp]
    if (target) normalized[target] = v
    else normalized[k] = v
  }
  return normalized
}

async function upsertSupervisor(row: ImportRow) {
  const email = String(row.supervisorEmail || '').trim()
  const nationalId = String(row.supervisorNationalId || '').trim()
  const data = {
    fullName: String(row.supervisorFullName || '').trim(),
    email,
    phoneNumber: String(row.supervisorPhoneNumber || '').trim(),
    nationalId,
  }

  // Prefer email as unique id, fallback to nationalId
  let sup = email
    ? await prisma.supervisor.findUnique({ where: { email } })
    : nationalId
    ? await prisma.supervisor.findUnique({ where: { nationalId } })
    : null

  if (!sup) {
    sup = await prisma.supervisor.create({ data })
  } else {
    // Keep record fresh with latest details
    sup = await prisma.supervisor.update({ where: { id: sup.id }, data })
  }
  return sup
}

async function upsertStudent(row: ImportRow) {
  const candidateNo = String(row.candidateNo || '').trim()
  
  // Find existing student by candidate number
  let stu = await prisma.student.findUnique({ where: { candidateNo } })
  
  if (!stu) {
    // If student doesn't exist, create with minimal data (only candidate number)
    // Other details will need to be added manually through the student management interface
    const data = {
      fullName: String(row.fullName || '').trim() || `Student ${candidateNo}`, // Default name if not provided
      sex: String(row.sex || '').trim() || 'M', // Default to Male if not provided
      candidateNo,
      email: String(row.email || '').trim() || `${candidateNo}@example.com`, // Default email if not provided
      schoolName: String(row.schoolName || '').trim() || 'Unknown School', // Default school if not provided
      className: String(row.className || '').trim() || 'Unknown Class', // Default class if not provided
    }
    stu = await prisma.student.create({ data })
  } else {
    // If student exists, keep existing data (don't update from Excel)
    // The student details in the database are considered the source of truth
    console.log(`Student ${candidateNo} already exists, using existing data from database`)
  }
  return stu
}

function validateAllMarks(row: ImportRow): { errors: string[], correctedData: any } {
  const errors: string[] = []
  const correctedData: any = {}
  
  // Define all mark fields and their maximum values
  const markFields = [
    { field: 'preparationMark', max: MAX.preparationMark, name: 'Preparation Mark' },
    { field: 'lessonPlanningMark', max: MAX.lessonPlanningMark, name: 'Lesson Planning Mark' },
    { field: 'lessonFacilitationMark', max: MAX.lessonFacilitationMark, name: 'Lesson Facilitation Mark' },
    { field: 'deportmentMark', max: MAX.deportmentMark, name: 'Deportment Mark' },
    { field: 'recordsMark', max: MAX.recordsMark, name: 'Records Mark' },
    { field: 'environmentMark', max: MAX.environmentMark, name: 'Environment Mark' },
    { field: 'documentsMark', max: MAX.documentsMark, name: 'Documents Mark' },
    { field: 'introductionMark', max: MAX.introductionMark, name: 'Introduction Mark' },
    { field: 'developmentMark', max: MAX.developmentMark, name: 'Development Mark' },
    { field: 'conclusionMark', max: MAX.conclusionMark, name: 'Conclusion Mark' },
    { field: 'personalDimensionsMark', max: MAX.personalDimensionsMark, name: 'Personal Dimensions Mark' },
    { field: 'communityMark', max: MAX.communityMark, name: 'Community Mark' },
    { field: 'remainingPillarsMark', max: MAX.remainingPillarsMark, name: 'Remaining Pillars Mark' },
  ]
  
  // Validate each mark field
  markFields.forEach(({ field, max, name }) => {
    if (row[field] !== undefined && row[field] !== null && row[field] !== '') {
      const validation = validateMark(row[field], name, max)
      if (!validation.isValid) {
        errors.push(validation.error!)
        if (validation.correctedValue !== undefined) {
          correctedData[field] = validation.correctedValue
        }
      } else {
        correctedData[field] = row[field]
      }
    }
  })
  
  return { errors, correctedData }
}

function mapAssessmentData(row: ImportRow) {
  const assessmentDate = parseDate(row.assessmentDate)
  if (!assessmentDate) throw new Error('Invalid assessmentDate')

  // Validate all marks first
  const { errors, correctedData } = validateAllMarks(row)
  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join('\n')}`)
  }

  // Only include fields that actually exist in the database schema
  const base = {
    assessmentDate,
    subject: String(row.subject || '').trim(),
    topic: String(row.topic || '').trim(),
    formType: String(row.formType || 'junior'),
    overallComment: String(row.overallComment || '').trim(),
    selectedCategory: String(row.selectedCategory || '').trim(),
    remainingPillars: String(row.remainingPillars || '').trim(),
    // Use corrected data for marks (already validated)
    preparationMark: clampNumber(correctedData.preparationMark || row.preparationMark, MAX.preparationMark),
    preparationComment: String(row.preparationComment || '').trim(),
    lessonPlanningMark: clampNumber(correctedData.lessonPlanningMark || row.lessonPlanningMark, MAX.lessonPlanningMark),
    lessonPlanningComment: String(row.lessonPlanningComment || '').trim(),
    environmentMark: clampNumber(correctedData.environmentMark || row.environmentMark, MAX.environmentMark),
    environmentComment: String(row.environmentComment || '').trim(),
    documentsMark: clampNumber(correctedData.documentsMark || row.documentsMark, MAX.documentsMark),
    documentsComment: String(row.documentsComment || '').trim(),
    introductionMark: clampNumber(correctedData.introductionMark || row.introductionMark, MAX.introductionMark),
    introductionComment: String(row.introductionComment || '').trim(),
    developmentMark: clampNumber(correctedData.developmentMark || row.developmentMark, MAX.developmentMark),
    developmentComment: String(row.developmentComment || '').trim(),
    conclusionMark: clampNumber(correctedData.conclusionMark || row.conclusionMark, MAX.conclusionMark),
    conclusionComment: String(row.conclusionComment || '').trim(),
    personalDimensionsMark: clampNumber(correctedData.personalDimensionsMark || row.personalDimensionsMark, MAX.personalDimensionsMark),
    personalDimensionsComment: String(row.personalDimensionsComment || '').trim(),
    communityMark: clampNumber(correctedData.communityMark || row.communityMark, MAX.communityMark),
    communityComment: String(row.communityComment || '').trim(),
    selectedResearchCategory: String(row.selectedResearchCategory || '').trim(),
  }
  
  // Validate required fields
  if (!base.subject) throw new Error('Subject is required')
  if (!base.topic) throw new Error('Topic is required')
  
  return base
}

async function handleRow(row: ImportRow, currentSupervisorId: number) {
  const norm = normalizeRow(row)
  
  // Only candidate number is required from the Excel file
  if (!norm.candidateNo) {
    throw new Error('Student candidate number is required')
  }
  
  // Supervisor fields in the sheet are ignored; we attach to the logged-in supervisor
  const student = await upsertStudent(norm)
  const data = mapAssessmentData(norm)

  // Prevent obvious duplicates: same student + date + subject
  const existing = await prisma.assessment.findFirst({
    where: {
      studentId: student.id,
      subject: data.subject,
      assessmentDate: {
        gte: new Date(data.assessmentDate.getFullYear(), data.assessmentDate.getMonth(), data.assessmentDate.getDate()),
        lt: new Date(data.assessmentDate.getFullYear(), data.assessmentDate.getMonth(), data.assessmentDate.getDate() + 1),
      },
    },
  })

  if (existing) {
    await prisma.assessment.update({
      where: { id: existing.id },
      data: { ...data, supervisorId: currentSupervisorId, studentId: student.id },
    })
    return { status: 'updated', student: student.candidateNo, subject: data.subject, studentName: student.fullName }
  }

  await prisma.assessment.create({
    data: { ...data, supervisorId: currentSupervisorId, studentId: student.id },
  })
  return { status: 'created', student: student.candidateNo, subject: data.subject, studentName: student.fullName }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Check authentication - allow supervisors, admins, and superadmins
    const role = getCookie(event, 'role')
    if (!['supervisor', 'admin', 'superadmin'].includes(role)) {
      throw createError({ statusCode: 401, statusMessage: 'Authentication required to import assessments' })
    }

    let currentSupervisorId = 0
    
    if (role === 'supervisor') {
    const supervisorIdCookie = getCookie(event, 'supervisorId')
      currentSupervisorId = parseInt(String(supervisorIdCookie || '0'))
    if (!currentSupervisorId) {
      throw createError({ statusCode: 401, statusMessage: 'Missing supervisor session' })
      }
    } else {
      // For admins/superadmins, use the first available supervisor or create a system supervisor
      const firstSupervisor = await prisma.supervisor.findFirst()
      if (firstSupervisor) {
        currentSupervisorId = firstSupervisor.id
      } else {
        // Create a system supervisor for admin uploads
        const systemSupervisor = await prisma.supervisor.create({
          data: {
            fullName: 'System Administrator',
            email: 'system@madziwa.edu',
            nationalId: 'SYSTEM-ADMIN',
            phoneNumber: '0000000000'
          }
        })
        currentSupervisorId = systemSupervisor.id
      }
    }

    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    }

    const file = parts.find(p => p.name === 'file')
    if (!file || !file.data) {
      throw createError({ statusCode: 400, statusMessage: 'Missing file field' })
    }

    const workbook = XLSX.read(file.data, { type: 'buffer' })
    const sheetName = workbook.SheetNames.includes('Assessments') ? 'Assessments' : workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows: ImportRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    if (!rows.length) {
      throw createError({ statusCode: 400, statusMessage: 'No rows found in sheet' })
    }

    const results: any[] = []
    let created = 0, updated = 0, errors = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        const res = await handleRow(row, currentSupervisorId)
        results.push({ row: i + 2, ...res }) // +2 accounts for 1-based index and header row
        if (res.status === 'created') created++
        if (res.status === 'updated') updated++
      } catch (err: any) {
        errors++
        const errorMsg = err?.message || String(err)
        console.error(`Error processing row ${i + 2}:`, errorMsg)
        results.push({ row: i + 2, status: 'error', error: errorMsg })
      }
    }

    const summary = {
      total: rows.length,
      created,
      updated,
      errors,
      results,
      success: errors === 0,
      message: errors > 0 ? `Import completed with ${errors} errors. Check details below.` : 'Import completed successfully!'
    }

    return summary
  } catch (error) {
    console.error('Error importing XLSX:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to import Excel file' })
  }
})

