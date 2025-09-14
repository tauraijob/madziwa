import { PrismaClient } from '@prisma/client'
import puppeteer from 'puppeteer'
import JSZip from 'jszip'
import { buildPuppeteerLaunchOptions } from '../../utils/resolveChromium'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    if (role === 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Admins are view-only. Downloads disabled.' })
    }
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    if (role === 'admin' && adminDistrictId) {
      where.student = { districtId: adminDistrictId }
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: { student: { include: { district: true } }, supervisor: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!assessments.length) {
      throw createError({ statusCode: 404, statusMessage: 'No assessments found' })
    }

    const browser = await puppeteer.launch(buildPuppeteerLaunchOptions())

    const zip = new JSZip()
    try {
      for (const a of assessments) {
        const total = a.preparationMark + a.lessonPlanningMark + a.environmentMark + a.documentsMark + a.introductionMark + a.developmentMark + a.conclusionMark + a.personalDimensionsMark + (a.communityMark || 0)
        const page = await browser.newPage()
        await page.emulateMediaType('screen')
        const html = `<!doctype html><html><body>
          <h1>${a.student.fullName} - ${a.subject}</h1>
          <p>${a.topic}</p>
          <p>SRN: ${a.student.candidateNo}</p>
          <p>District: ${a.student.district?.name || ''}</p>
          <p>School: ${a.student.schoolName} | Class: ${a.student.className}</p>
          <p>Total: ${total}</p>
        </body></html>`
        await page.setContent(html, { waitUntil: 'domcontentloaded' })
        const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' } })
        await page.close()
        const fileName = `assessment-${a.student.fullName.replace(/[^a-zA-Z0-9]/g, '_')}-${a.subject.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        zip.file(fileName, pdf)
      }
    } finally {
      try { await browser.close() } catch {}
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    setHeader(event, 'Content-Type', 'application/zip')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessments-${new Date().toISOString().split('T')[0]}.zip"`)
    return zipBuffer
  } catch (error) {
    console.error('Export PDF all failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to export PDFs' })
  }
})

