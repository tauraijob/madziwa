import { PrismaClient } from '@prisma/client'
import puppeteer from 'puppeteer'
import JSZip from 'jszip'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { assessmentIds } = body

    if (!assessmentIds || !Array.isArray(assessmentIds) || assessmentIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Assessment IDs are required'
      })
    }

    // Get assessments with related data
    const assessments = await prisma.assessment.findMany({
      where: {
        id: {
          in: assessmentIds.map(id => parseInt(id))
        }
      },
      include: {
        student: true,
        supervisor: true
      }
    })

    if (assessments.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No assessments found'
      })
    }

    // Create ZIP file
    const zip = new JSZip()
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ],
      timeout: 30000
    })

    try {
      // Generate PDF for each assessment
      for (const assessment of assessments) {
        // Calculate total mark
        const totalMark = assessment.preparationMark + 
                         assessment.lessonPlanningMark + 
                         assessment.environmentMark + 
                         assessment.documentsMark + 
                         assessment.introductionMark + 
                         assessment.developmentMark + 
                         assessment.conclusionMark + 
                         assessment.personalDimensionsMark + 
                         (assessment.communityMark || 0)

        // Generate HTML content for PDF
        const htmlContent = generateAssessmentHTML(assessment, totalMark)

        // Generate PDF
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
        
        const pdf = await page.pdf({
          format: 'A4',
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          printBackground: true
        })

        await page.close()

        // Add PDF to ZIP
        const fileName = `assessment-${assessment.student.fullName.replace(/[^a-zA-Z0-9]/g, '_')}-${assessment.subject.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        zip.file(fileName, pdf)
      }
    } finally {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Set response headers
    setHeader(event, 'Content-Type', 'application/zip')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessments-${new Date().toISOString().split('T')[0]}.zip"`)

    return zipBuffer
  } catch (error) {
    console.error('Error generating ZIP:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate ZIP file'
    })
  }
})

function generateAssessmentHTML(assessment: any, totalMark: number) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+ (Excellent)'
    if (score >= 80) return 'A (Very Good)'
    if (score >= 70) return 'B (Good)'
    if (score >= 60) return 'C (Satisfactory)'
    return 'D (Needs Improvement)'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Assessment Report - ${assessment.student.fullName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h2 {
          color: #2563eb;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-item {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        .info-item label {
          font-weight: bold;
          color: #374151;
          display: block;
          margin-bottom: 5px;
        }
        .info-item p {
          margin: 0;
          color: #111827;
        }
        .score-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .score-table th,
        .score-table td {
          border: 1px solid #d1d5db;
          padding: 12px;
          text-align: left;
        }
        .score-table th {
          background: #f3f4f6;
          font-weight: bold;
          color: #374151;
        }
        .score-table tr:nth-child(even) {
          background: #f9fafb;
        }
        .total-score {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 30px 0;
        }
        .total-score h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .total-score .score {
          font-size: 36px;
          font-weight: bold;
          margin: 10px 0;
        }
        .total-score .grade {
          font-size: 18px;
          opacity: 0.9;
        }
        .comment-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .comment-section h3 {
          color: #2563eb;
          margin-top: 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Madziwa College</h1>
        <p>Teaching Practice Assessment Report</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Student Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Full Name:</label>
            <p>${assessment.student.fullName}</p>
          </div>
          <div class="info-item">
            <label>Candidate Number:</label>
            <p>${assessment.student.candidateNo}</p>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <p>${assessment.student.email}</p>
          </div>
          <div class="info-item">
            <label>School:</label>
            <p>${assessment.student.schoolName}</p>
          </div>
          <div class="info-item">
            <label>Class:</label>
            <p>${assessment.student.className}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Supervisor Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Full Name:</label>
            <p>${assessment.supervisor.fullName}</p>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <p>${assessment.supervisor.email}</p>
          </div>
          <div class="info-item">
            <label>Phone Number:</label>
            <p>${assessment.supervisor.phoneNumber}</p>
          </div>
          <div class="info-item">
            <label>National ID:</label>
            <p>${assessment.supervisor.nationalId}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Assessment Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Subject:</label>
            <p>${assessment.subject}</p>
          </div>
          <div class="info-item">
            <label>Topic:</label>
            <p>${assessment.topic}</p>
          </div>
          <div class="info-item">
            <label>Assessment Date:</label>
            <p>${formatDate(assessment.assessmentDate)}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Scoring Breakdown</h2>
        <table class="score-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Score</th>
              <th>Maximum</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Preparation & Scheming</td>
              <td>${assessment.preparationMark}</td>
              <td>20</td>
              <td>${Math.round(assessment.preparationMark / 20 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Planning</td>
              <td>${assessment.lessonPlanningMark}</td>
              <td>20</td>
              <td>${Math.round(assessment.lessonPlanningMark / 20 * 100)}%</td>
            </tr>
            <tr>
              <td>Learning Environment & Management</td>
              <td>${assessment.environmentMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.environmentMark / 10 * 100)}%</td>
            </tr>
            <tr>
              <td>Other Work-Related Learning Documents</td>
              <td>${assessment.documentsMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.documentsMark / 10 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Presentation: Introduction</td>
              <td>${assessment.introductionMark}</td>
              <td>3</td>
              <td>${Math.round(assessment.introductionMark / 3 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Presentation: Development</td>
              <td>${assessment.developmentMark}</td>
              <td>30</td>
              <td>${Math.round(assessment.developmentMark / 30 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Presentation: Conclusion</td>
              <td>${assessment.conclusionMark}</td>
              <td>3</td>
              <td>${Math.round(assessment.conclusionMark / 3 * 100)}%</td>
            </tr>
            <tr>
              <td>Personal Dimensions</td>
              <td>${assessment.personalDimensionsMark}</td>
              <td>4</td>
              <td>${Math.round(assessment.personalDimensionsMark / 4 * 100)}%</td>
            </tr>
            <tr>
              <td>Community Engagement (Education 5.0)</td>
              <td>${assessment.communityMark || 0}</td>
              <td>20</td>
              <td>${Math.round(((assessment.communityMark || 0) / 20) * 100)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-score">
        <h3>Total Score</h3>
        <div class="score">${totalMark}/100</div>
        <div class="grade">${getGrade(totalMark)}</div>
      </div>

      <div class="comment-section">
        <h3>Overall Comment</h3>
        <p>${assessment.overallComment}</p>
      </div>

      <div class="footer">
        <p>This report was generated by the Madziwa College TP Assessment Platform</p>
        <p>Contact: +27 61 629 1608 | Email: info@madziwacollege.edu.zw</p>
      </div>
    </body>
    </html>
  `
} 