import { PrismaClient } from '@prisma/client'
import puppeteer from 'puppeteer'
import { buildPuppeteerLaunchOptions } from '../../../utils/resolveChromium'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (!role) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const id = getRouterParam(event, 'id')
    
    // Get assessment with related data
    const assessment = await prisma.assessment.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: true,
        supervisor: true
      }
    })

    if (!assessment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Assessment not found'
      })
    }

    // Authorization rules
    if (role === 'superadmin') {
      // allowed
    } else if (role === 'admin') {
      const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
      const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null
      if (!adminDistrictId || assessment.student.districtId !== adminDistrictId) {
        throw createError({ statusCode: 403, statusMessage: 'Not allowed' })
      }
    } else if (role === 'supervisor') {
      const supervisorIdCookie = getCookie(event, 'supervisorId')
      const supervisorId = supervisorIdCookie ? parseInt(String(supervisorIdCookie)) : null
      const assessmentSupervisorId = assessment.supervisor?.id ?? (assessment as any).supervisorId
      if (!supervisorId || assessmentSupervisorId !== supervisorId) {
        throw createError({ statusCode: 403, statusMessage: 'Not allowed' })
      }
    } else {
      throw createError({ statusCode: 403, statusMessage: 'Not allowed' })
    }

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

    // Generate PDF using Puppeteer with better error handling
    let browser
    let pdfBuffer: Buffer | Uint8Array | null = null
    try {
      browser = await puppeteer.launch(buildPuppeteerLaunchOptions())
      
      const page = await browser.newPage()
      await page.emulateMediaType('screen')
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })

      // Try once, then retry if target closed
      try {
        pdfBuffer = await page.pdf({
          format: 'A4',
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          printBackground: true,
          preferCSSPageSize: true
        })
      } catch (err) {
        // Retry with a new page
        try {
          const retryPage = await browser.newPage()
          await retryPage.emulateMediaType('screen')
          await retryPage.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
          pdfBuffer = await retryPage.pdf({
            format: 'A4',
            margin: {
              top: '20mm',
              right: '20mm',
              bottom: '20mm',
              left: '20mm'
            },
            printBackground: true,
            preferCSSPageSize: true
          })
          await retryPage.close()
        } catch (retryErr) {
          throw retryErr
        }
      }
    } finally {
      if (browser) {
        try {
          await browser.close()
        } catch (closeError) {
          console.error('Error closing browser:', closeError)
        }
      }
    }

    if (!pdfBuffer) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to generate PDF' })
    }

    // Set response headers and return
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessment-${assessment.student.fullName}-${assessment.subject}.pdf"`)

    return pdfBuffer
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate PDF'
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
          border-bottom: 3px solid #096540;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #096540;
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
          color: #096540;
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
          border-left: 4px solid #096540;
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
          background: linear-gradient(135deg, #096540, #0b7a55);
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
          color: #096540;
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
        ${assessment.formType ? `<p><strong>${
          assessment.formType === 'secondary' ? 'Secondary level teaching assessment' :
          assessment.formType === 'isen' ? 'Inclusion and Special Educational Needs' :
          assessment.formType === 'materials' ? 'Educational materials and resources assessment' :
          'ECD & Junior Levels'
        }</strong></p>` : ''}
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
            ${assessment.formType === 'materials' ? `
            <tr>
              <td>Content</td>
              <td>${assessment.preparationMark}</td>
              <td>20</td>
              <td>${Math.round((assessment.preparationMark / 20) * 100)}%</td>
            </tr>
            <tr>
              <td>Pedagogical Value</td>
              <td>${assessment.lessonPlanningMark}</td>
              <td>20</td>
              <td>${Math.round((assessment.lessonPlanningMark / 20) * 100)}%</td>
            </tr>
            <tr>
              <td>Design & Layout</td>
              <td>${assessment.environmentMark}</td>
              <td>20</td>
              <td>${Math.round((assessment.environmentMark / 20) * 100)}%</td>
            </tr>
            <tr>
              <td>Innovation & Creativity</td>
              <td>${assessment.documentsMark}</td>
              <td>20</td>
              <td>${Math.round((assessment.documentsMark / 20) * 100)}%</td>
            </tr>
            <tr>
              <td>Education 5.0 Compliance</td>
              <td>${assessment.introductionMark}</td>
              <td>20</td>
              <td>${Math.round((assessment.introductionMark / 20) * 100)}%</td>
            </tr>
            ` : (assessment.formType === 'ecd' || assessment.formType === 'junior' || !assessment.formType) ? `
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Preparation</td>
              <td>${assessment.preparationMark}</td>
              <td>15</td>
              <td>${Math.round(assessment.preparationMark / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Lesson Facilitation</td>
              <td>${assessment.lessonPlanningMark}</td>
              <td>15</td>
              <td>${Math.round(assessment.lessonPlanningMark / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Deportment</td>
              <td>${assessment.introductionMark}</td>
              <td>5</td>
              <td>${Math.round(assessment.introductionMark / 5 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Records Management</td>
              <td>${assessment.documentsMark}</td>
              <td>15</td>
              <td>${Math.round(assessment.documentsMark / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Teaching and Learning Environment</strong></td>
              <td>${assessment.environmentMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.environmentMark / 10 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-based Community Service/Research & Innovation/Research & Industrialisation</strong></td>
              <td>${assessment.developmentMark}</td>
              <td>30</td>
              <td>${Math.round(assessment.developmentMark / 30 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Remaining 2 Pillars</strong></td>
              <td>${assessment.conclusionMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.conclusionMark / 10 * 100)}%</td>
            </tr>
            ` : `
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
            `}
          </tbody>
        </table>
      </div>

      <div class="total-score">
        <h3>Total Score</h3>
        <div class="score">${totalMark}/100</div>
        <div class="grade">${getGrade(totalMark)}</div>
      </div>

      ${assessment.formType === 'materials' ? `
      <div class="comment-section">
        <h3>Comments Breakdown (Materials)</h3>
        <table class="score-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Content</td>
              <td>${assessment.preparationComment || ''}</td>
            </tr>
            <tr>
              <td>Pedagogical Value</td>
              <td>${assessment.lessonPlanningComment || ''}</td>
            </tr>
            <tr>
              <td>Design & Layout</td>
              <td>${assessment.environmentComment || ''}</td>
            </tr>
            <tr>
              <td>Innovation & Creativity</td>
              <td>${assessment.documentsComment || ''}</td>
            </tr>
            <tr>
              <td>Education 5.0</td>
              <td>${assessment.introductionComment || ''}</td>
            </tr>
          </tbody>
        </table>
        <h3>Overall Comment</h3>
        <p>${assessment.overallComment || ''}</p>
      </div>
      ` : (assessment.formType === 'ecd' || assessment.formType === 'junior' || !assessment.formType) ? `
       <div class="comment-section">
         <h3>Comments Breakdown</h3>
         <table class="score-table">
           <thead>
             <tr>
               <th>Category</th>
               <th>Comments</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Preparation</td>
               <td>${assessment.preparationComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Lesson Facilitation</td>
               <td>${assessment.lessonPlanningComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Deportment</td>
               <td>${assessment.introductionComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Records Management</td>
               <td>${assessment.documentsComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Teaching and Learning Environment</strong></td>
               <td>${assessment.environmentComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-based Community Service/Research & Innovation/Research & Industrialisation</strong></td>
               <td>${assessment.developmentComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Remaining 2 Pillars</strong></td>
               <td>${assessment.conclusionComment || ''}</td>
             </tr>
           </tbody>
         </table>
         <h3>Overall Comment</h3>
         <p>${assessment.overallComment || ''}</p>
       </div>
      ` : `
       <div class="comment-section">
         <h3>Comments Breakdown</h3>
         <table class="score-table">
           <thead>
             <tr>
               <th>Category</th>
               <th>Comments</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>Preparation & Scheming</td>
               <td>${assessment.preparationComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Planning</td>
               <td>${assessment.lessonPlanningComment || ''}</td>
             </tr>
             <tr>
               <td>Learning Environment & Management</td>
               <td>${assessment.environmentComment || ''}</td>
             </tr>
             <tr>
               <td>Other Work-Related Learning Documents</td>
               <td>${assessment.documentsComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Presentation: Introduction</td>
               <td>${assessment.introductionComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Presentation: Development</td>
               <td>${assessment.developmentComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Presentation: Conclusion</td>
               <td>${assessment.conclusionComment || ''}</td>
             </tr>
             <tr>
               <td>Personal Dimensions</td>
               <td>${assessment.personalDimensionsComment || ''}</td>
             </tr>
             <tr>
               <td>Community Engagement (Education 5.0)</td>
               <td>${assessment.communityComment || ''}</td>
             </tr>
           </tbody>
         </table>
         <h3>Overall Comment</h3>
         <p>${assessment.overallComment || ''}</p>
       </div>
      `}

      <div class="footer">
        <p>This report was generated by the Madziwa College TP Assessment Platform</p>
        <p>Contact: +263 772 145 972 | Email: madziwatc@gmail.com</p>
      </div>
    </body>
    </html>
  `
} 