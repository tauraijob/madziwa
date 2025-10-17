// @ts-ignore
import * as XLSX from 'xlsx/xlsx.mjs'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { assessmentType, selectedCriteria } = body

  if (!assessmentType || !selectedCriteria || !Array.isArray(selectedCriteria)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  try {
    // Create workbook
    const wb = XLSX.utils.book_new()

    // Define headers based on assessment type and selected criteria
    let headers = [
      'STUDENT NAME', 
      'STUDENT NUMBER', 
      'SUBJECT', 
      'TOPIC', 
      'ASSESSMENT DATE', 
      'SUPERVISOR NAME'
    ]

    if (assessmentType === 'materials') {
      // Materials Development criteria - Content Quality
      if (selectedCriteria.includes('content') || selectedCriteria.includes('contentRelevance') || selectedCriteria.includes('contentOrganization')) {
        headers.push('CONTENT QUALITY MARK (25)', 'CONTENT QUALITY COMMENT')
        if (selectedCriteria.includes('contentRelevance')) {
          headers.push('CONTENT RELEVANCE MARK (10)', 'CONTENT RELEVANCE COMMENT')
        }
        if (selectedCriteria.includes('contentOrganization')) {
          headers.push('CONTENT ORGANIZATION MARK (10)', 'CONTENT ORGANIZATION COMMENT')
        }
      }
      
      // Pedagogical Value
      if (selectedCriteria.includes('pedagogical') || selectedCriteria.includes('pedagogicalAlignment') || selectedCriteria.includes('pedagogicalEngagement') || selectedCriteria.includes('pedagogicalConnection') || selectedCriteria.includes('pedagogicalInclusive')) {
        headers.push('PEDAGOGICAL VALUE MARK (25)', 'PEDAGOGICAL VALUE COMMENT')
        if (selectedCriteria.includes('pedagogicalAlignment')) {
          headers.push('PEDAGOGICAL ALIGNMENT MARK (5)', 'PEDAGOGICAL ALIGNMENT COMMENT')
        }
        if (selectedCriteria.includes('pedagogicalEngagement')) {
          headers.push('PEDAGOGICAL ENGAGEMENT MARK (5)', 'PEDAGOGICAL ENGAGEMENT COMMENT')
        }
        if (selectedCriteria.includes('pedagogicalConnection')) {
          headers.push('PEDAGOGICAL CONNECTION MARK (5)', 'PEDAGOGICAL CONNECTION COMMENT')
        }
        if (selectedCriteria.includes('pedagogicalInclusive')) {
          headers.push('PEDAGOGICAL INCLUSIVE MARK (5)', 'PEDAGOGICAL INCLUSIVE COMMENT')
        }
      }
      
      // Design and Layout
      if (selectedCriteria.includes('design') || selectedCriteria.includes('designVisual') || selectedCriteria.includes('designNavigation') || selectedCriteria.includes('designQuality') || selectedCriteria.includes('designConsistency')) {
        headers.push('DESIGN & LAYOUT MARK (20)', 'DESIGN & LAYOUT COMMENT')
        if (selectedCriteria.includes('designVisual')) {
          headers.push('DESIGN VISUAL MARK (5)', 'DESIGN VISUAL COMMENT')
        }
        if (selectedCriteria.includes('designNavigation')) {
          headers.push('DESIGN NAVIGATION MARK (5)', 'DESIGN NAVIGATION COMMENT')
        }
        if (selectedCriteria.includes('designQuality')) {
          headers.push('DESIGN QUALITY MARK (5)', 'DESIGN QUALITY COMMENT')
        }
        if (selectedCriteria.includes('designConsistency')) {
          headers.push('DESIGN CONSISTENCY MARK (5)', 'DESIGN CONSISTENCY COMMENT')
        }
      }
      
      // Innovation and Creativity
      if (selectedCriteria.includes('innovation') || selectedCriteria.includes('innovationOriginality') || selectedCriteria.includes('innovationTechnology')) {
        headers.push('INNOVATION & CREATIVITY MARK (15)', 'INNOVATION & CREATIVITY COMMENT')
        if (selectedCriteria.includes('innovationOriginality')) {
          headers.push('INNOVATION ORIGINALITY MARK (10)', 'INNOVATION ORIGINALITY COMMENT')
        }
        if (selectedCriteria.includes('innovationTechnology')) {
          headers.push('INNOVATION TECHNOLOGY MARK (10)', 'INNOVATION TECHNOLOGY COMMENT')
        }
      }
      
      // Education 5.0 Compliance
      if (selectedCriteria.includes('education') || selectedCriteria.includes('educationLocal') || selectedCriteria.includes('educationHeritage') || selectedCriteria.includes('educationProblem') || selectedCriteria.includes('educationCommercial')) {
        headers.push('EDUCATION 5.0 COMPLIANCE MARK (15)', 'EDUCATION 5.0 COMPLIANCE COMMENT')
        if (selectedCriteria.includes('educationLocal')) {
          headers.push('EDUCATION LOCAL MARK (5)', 'EDUCATION LOCAL COMMENT')
        }
        if (selectedCriteria.includes('educationHeritage')) {
          headers.push('EDUCATION HERITAGE MARK (5)', 'EDUCATION HERITAGE COMMENT')
        }
        if (selectedCriteria.includes('educationProblem')) {
          headers.push('EDUCATION PROBLEM MARK (5)', 'EDUCATION PROBLEM COMMENT')
        }
        if (selectedCriteria.includes('educationCommercial')) {
          headers.push('EDUCATION COMMERCIAL MARK (5)', 'EDUCATION COMMERCIAL COMMENT')
        }
      }
    } else {
      // Standard criteria for ECD, Secondary, ISEN
      if (selectedCriteria.includes('preparation')) {
        headers.push('PREPARATION MARK (10)', 'PREPARATION COMMENT')
      }
      if (selectedCriteria.includes('lessonPlanning')) {
        headers.push('LESSON PLANNING MARK (15)', 'LESSON PLANNING COMMENT')
      }
      if (selectedCriteria.includes('introduction')) {
        headers.push('INTRODUCTION MARK (5)', 'INTRODUCTION COMMENT')
      }
      if (selectedCriteria.includes('development')) {
        headers.push('DEVELOPMENT MARK (15)', 'DEVELOPMENT COMMENT')
      }
      if (selectedCriteria.includes('conclusion')) {
        headers.push('CONCLUSION MARK (5)', 'CONCLUSION COMMENT')
      }
      if (selectedCriteria.includes('personal')) {
        headers.push('PERSONAL MARK (5)', 'PERSONAL COMMENT')
      }
      if (selectedCriteria.includes('records')) {
        headers.push('RECORDS MANAGEMENT MARK (15)', 'RECORDS MANAGEMENT COMMENT')
        // Add ECD-specific records items if it's ECD assessment
        if (assessmentType === 'ecd') {
          headers.push('ANECDOTAL RECORD MARK', 'ANECDOTAL RECORD COMMENT')
          headers.push('DEVELOPMENTAL CHECKLIST MARK', 'DEVELOPMENTAL CHECKLIST COMMENT')
          headers.push('HEALTH RECORD MARK', 'HEALTH RECORD COMMENT')
        }
      }
      if (selectedCriteria.includes('environment')) {
        headers.push('ENVIRONMENT MARK (10)', 'ENVIRONMENT COMMENT')
      }
      if (selectedCriteria.includes('community')) {
        headers.push('COMMUNITY MARK (20)', 'COMMUNITY COMMENT')
      }
      if (selectedCriteria.includes('research')) {
        if (assessmentType === 'ecd') {
          headers.push('RESEARCH-BASED CHILD STUDY & COMMUNITY SERVICE MARK (25)', 'RESEARCH-BASED CHILD STUDY & COMMUNITY SERVICE COMMENT')
        } else if (assessmentType === 'junior') {
          headers.push('RESEARCH-BASED COMMUNITY SERVICE MARK (25)', 'RESEARCH-BASED COMMUNITY SERVICE COMMENT')
        } else {
          headers.push('RESEARCH-BASED COMMUNITY SERVICE MARK (25)', 'RESEARCH-BASED COMMUNITY SERVICE COMMENT')
        }
      }
    }

    // Add overall comment
    headers.push('OVERALL COMMENT')

    // Create worksheet with headers
    const ws = XLSX.utils.aoa_to_sheet([headers])

    // Set column widths for better visibility
    const colWidths = headers.map(() => ({ wch: 25 }))
    ws['!cols'] = colWidths

    // Style header row with bold, clear formatting
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
      if (!ws[cellAddress]) continue
      ws[cellAddress].s = {
        font: { 
          bold: true, 
          size: 12, 
          color: { rgb: "FFFFFF" },
          name: "Arial"
        },
        fill: { fgColor: { rgb: "1E40AF" } }, // Blue background
        alignment: { 
          horizontal: "center", 
          vertical: "center",
          wrapText: true
        },
        border: {
          top: { style: "medium", color: { rgb: "000000" } },
          bottom: { style: "medium", color: { rgb: "000000" } },
          left: { style: "medium", color: { rgb: "000000" } },
          right: { style: "medium", color: { rgb: "000000" } }
        }
      }
    }

    // Add data validation for marks columns
    const markColumns = headers
      .map((header, index) => ({ header, index }))
      .filter(({ header }) => header.includes('Mark'))
      .map(({ index }) => index)

    markColumns.forEach(colIndex => {
      const maxMark = headers[colIndex]?.match(/\((\d+)\)/)?.[1] || '100'
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: colIndex })
      
      // Add data validation (Excel doesn't support this in XLSX.js, but we can add instructions)
      if (!ws[cellRef]) {
        ws[cellRef] = { v: '', t: 's' }
      }
    })

    // Add sample data row
    const sampleData = headers.map((header, index) => {
      if (header.includes('Mark')) {
        return 0 // Default mark
      } else if (header.includes('Comment')) {
        return '' // Empty comment
      } else if (header === 'Assessment Date') {
        return new Date().toISOString().slice(0, 16) // Current date
      } else {
        return '' // Empty for other fields
      }
    })
    
    XLSX.utils.sheet_add_aoa(ws, [sampleData], { origin: -1 })

    // Add instructions sheet
    const instructions = [
      ['OFFLINE ASSESSMENT TEMPLATE INSTRUCTIONS'],
      [''],
      ['1. Fill in the basic information: Student Name, Student Number, Subject, Topic, Assessment Date, Supervisor Name'],
      ['2. For each selected criteria, enter the mark (0 to maximum) and add comments'],
      ['3. Marks should be entered as numbers only'],
      ['4. Comments should be descriptive and constructive'],
      ['5. Save the file and upload it back to the system when complete'],
      [''],
      ['SELECTED CRITERIA:'],
      ...selectedCriteria.map(criteria => [`- ${criteria}`]),
      [''],
      ['ASSESSMENT TYPE:'],
      [`- ${assessmentType.toUpperCase()}`]
    ]

    const instructionsWs = XLSX.utils.aoa_to_sheet(instructions)
    instructionsWs['!cols'] = [{ wch: 80 }]

    // Style the instructions sheet
    const instructionsRange = XLSX.utils.decode_range(instructionsWs['!ref'])
    
    // Style main title
    const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 })
    if (instructionsWs[titleCell]) {
      instructionsWs[titleCell].s = {
        font: { 
          bold: true, 
          size: 16, 
          color: { rgb: "FFFFFF" },
          name: "Arial"
        },
        fill: { fgColor: { rgb: "1E40AF" } },
        alignment: { 
          horizontal: "center", 
          vertical: "center"
        }
      }
    }

    // Style section headings
    const sectionHeadings = ['SELECTED CRITERIA:', 'ASSESSMENT TYPE:']
    sectionHeadings.forEach(heading => {
      const rowIndex = instructions.findIndex(row => row[0] === heading)
      if (rowIndex !== -1) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 })
        if (instructionsWs[cellAddress]) {
          instructionsWs[cellAddress].s = {
            font: { 
              bold: true, 
              size: 14, 
              color: { rgb: "1E40AF" },
              name: "Arial"
            },
            fill: { fgColor: { rgb: "E6F3FF" } },
            alignment: { 
              horizontal: "left", 
              vertical: "center"
            }
          }
        }
      }
    })

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment Data')
    XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions')

    // Generate base64 data
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' })

    return {
      filename: `offline_assessment_${assessmentType}_${Date.now()}.xlsx`,
      data: wbout
    }
  } catch (error) {
    console.error('Error generating offline template:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to generate template: ${errorMessage}` 
    })
  }
})
