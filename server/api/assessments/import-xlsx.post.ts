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

function simplifyKey(key: string): string {
  return String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function normalizeRow(row: ImportRow): ImportRow {
  const canonical: Record<string, string> = {
    fullname: 'fullName',
    sex: 'sex',
    candidateno: 'candidateNo',
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
  const data = {
    fullName: String(row.fullName || '').trim(),
    sex: String(row.sex || '').trim(),
    candidateNo,
    email: String(row.email || '').trim(),
    schoolName: String(row.schoolName || '').trim(),
    className: String(row.className || '').trim(),
  }

  let stu = await prisma.student.findUnique({ where: { candidateNo } })
  if (!stu) {
    stu = await prisma.student.create({ data })
  } else {
    stu = await prisma.student.update({ where: { id: stu.id }, data })
  }
  return stu
}

function mapAssessmentData(row: ImportRow) {
  const assessmentDate = parseDate(row.assessmentDate)
  if (!assessmentDate) throw new Error('Invalid assessmentDate')

  // Only include fields that actually exist in the database schema
  const base = {
    assessmentDate,
    subject: String(row.subject || '').trim(),
    topic: String(row.topic || '').trim(),
    formType: String(row.formType || 'junior'),
    overallComment: String(row.overallComment || '').trim(),
    // Only the fields that exist in the database
    preparationMark: clampNumber(row.preparationMark, MAX.preparationMark),
    preparationComment: String(row.preparationComment || '').trim(),
    lessonPlanningMark: clampNumber(row.lessonPlanningMark, MAX.lessonPlanningMark),
    lessonPlanningComment: String(row.lessonPlanningComment || '').trim(),
    environmentMark: clampNumber(row.environmentMark, MAX.environmentMark),
    environmentComment: String(row.environmentComment || '').trim(),
    documentsMark: clampNumber(row.documentsMark, MAX.documentsMark),
    documentsComment: String(row.documentsComment || '').trim(),
    introductionMark: clampNumber(row.introductionMark, MAX.introductionMark),
    introductionComment: String(row.introductionComment || '').trim(),
    developmentMark: clampNumber(row.developmentMark, MAX.developmentMark),
    developmentComment: String(row.developmentComment || '').trim(),
    conclusionMark: clampNumber(row.conclusionMark, MAX.conclusionMark),
    conclusionComment: String(row.conclusionComment || '').trim(),
    personalDimensionsMark: clampNumber(row.personalDimensionsMark, MAX.personalDimensionsMark),
    personalDimensionsComment: String(row.personalDimensionsComment || '').trim(),
    communityMark: clampNumber(row.communityMark, MAX.communityMark),
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
  
  // Required identifiers
  if (!norm.fullName || !norm.candidateNo) {
    throw new Error('Student fullName and candidateNo are required')
  }
  
  // Validate student data
  if (!norm.sex) throw new Error('Student sex is required')
  if (!norm.email) throw new Error('Student email is required')
  if (!norm.schoolName) throw new Error('Student schoolName is required')
  if (!norm.className) throw new Error('Student className is required')
  
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

