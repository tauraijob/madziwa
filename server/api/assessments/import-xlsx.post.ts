import { PrismaClient } from '@prisma/client'
import type { H3Event } from 'h3'
import * as XLSX from 'xlsx/xlsx.mjs'

const prisma = new PrismaClient()

type ImportRow = Record<string, any>

const MAX = {
  preparationMark: 20,
  lessonPlanningMark: 20,
  environmentMark: 10,
  documentsMark: 10,
  introductionMark: 3,
  developmentMark: 30,
  conclusionMark: 3,
  personalDimensionsMark: 4,
  communityMark: 20,
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

  const base = {
    assessmentDate,
    subject: String(row.subject || '').trim(),
    topic: String(row.topic || '').trim(),
    formType: String(row.formType || 'junior'),
    overallComment: String(row.overallComment || '').trim(),
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
  }
  if (!base.subject) throw new Error('subject required')
  return base
}

async function handleRow(row: ImportRow, currentSupervisorId: number) {
  // Required identifiers
  if (!row.fullName || !row.candidateNo) throw new Error('Student fullName and candidateNo are required')
  // Supervisor fields in the sheet are ignored; we attach to the logged-in supervisor
  const student = await upsertStudent(row)
  const data = mapAssessmentData(row)

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
    return { status: 'updated', student: student.candidateNo, subject: data.subject }
  }

  await prisma.assessment.create({
    data: { ...data, supervisorId: currentSupervisorId, studentId: student.id },
  })
  return { status: 'created', student: student.candidateNo, subject: data.subject }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Only supervisors can upload completed assessment spreadsheets
    const role = getCookie(event, 'role')
    if (role !== 'supervisor') {
      throw createError({ statusCode: 401, statusMessage: 'Only supervisors may import assessments' })
    }

    const supervisorIdCookie = getCookie(event, 'supervisorId')
    const currentSupervisorId = parseInt(String(supervisorIdCookie || '0'))
    if (!currentSupervisorId) {
      throw createError({ statusCode: 401, statusMessage: 'Missing supervisor session' })
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
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        const res = await handleRow(row, currentSupervisorId)
        results.push({ row: i + 2, ...res }) // +2 accounts for 1-based index and header row
      } catch (err: any) {
        results.push({ row: i + 2, status: 'error', error: err?.message || String(err) })
      }
    }

    const summary = {
      total: rows.length,
      created: results.filter(r => r.status === 'created').length,
      updated: results.filter(r => r.status === 'updated').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    }

    return summary
  } catch (error) {
    console.error('Error importing XLSX:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to import Excel file' })
  }
})

