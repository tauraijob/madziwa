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
      'STUDENT CANDIDATE', 
      'SUBJECT', 
      'TOPIC', 
      'ASSESSMENT DATE',
      'SELECTED CATEGORY',
      'REMAINING 2 PILLARS'
    ]

    if (assessmentType === 'materials') {
      // Materials Development criteria - Content Quality (20 marks)
      if (selectedCriteria.includes('content') || selectedCriteria.includes('contentRelevance') || selectedCriteria.includes('contentOrganization')) {
        headers.push('CONTENT QUALITY MARK (20)', 'CONTENT QUALITY COMMENT')
        if (selectedCriteria.includes('contentRelevance')) {
          headers.push('CONTENT RELEVANCE MARK (10)', 'CONTENT RELEVANCE COMMENT')
        }
        if (selectedCriteria.includes('contentOrganization')) {
          headers.push('CONTENT ORGANIZATION MARK (10)', 'CONTENT ORGANIZATION COMMENT')
        }
      }
      
      // Pedagogical Value (20 marks)
      if (selectedCriteria.includes('pedagogical') || selectedCriteria.includes('pedagogicalAlignment') || selectedCriteria.includes('pedagogicalEngagement') || selectedCriteria.includes('pedagogicalConnection') || selectedCriteria.includes('pedagogicalInclusive')) {
        headers.push('PEDAGOGICAL VALUE MARK (20)', 'PEDAGOGICAL VALUE COMMENT')
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
      
      // Design and Layout (20 marks)
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
      
      // Innovation and Creativity (20 marks)
      if (selectedCriteria.includes('innovation') || selectedCriteria.includes('innovationOriginality') || selectedCriteria.includes('innovationTechnology')) {
        headers.push('INNOVATION & CREATIVITY MARK (20)', 'INNOVATION & CREATIVITY COMMENT')
        if (selectedCriteria.includes('innovationOriginality')) {
          headers.push('INNOVATION ORIGINALITY MARK (10)', 'INNOVATION ORIGINALITY COMMENT')
        }
        if (selectedCriteria.includes('innovationTechnology')) {
          headers.push('INNOVATION TECHNOLOGY MARK (10)', 'INNOVATION TECHNOLOGY COMMENT')
        }
      }
      
      // Education 5.0 Compliance (20 marks)
      if (selectedCriteria.includes('education') || selectedCriteria.includes('educationLocal') || selectedCriteria.includes('educationHeritage') || selectedCriteria.includes('educationProblem') || selectedCriteria.includes('educationCommercial')) {
        headers.push('EDUCATION 5.0 COMPLIANCE MARK (20)', 'EDUCATION 5.0 COMPLIANCE COMMENT')
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
      // ECD Assessment criteria - exactly matching online form
      if (assessmentType === 'ecd') {
        // PREPARATION and its aspects
        headers.push('PREPARATION MARK (15)', 'PREPARATION COMMENT')
        
        // LESSON FACILITATION and its aspects
        headers.push('LESSON FACILITATION MARK (15)', 'LESSON FACILITATION COMMENT')
        
        // DEPORTMENT and its aspects
        headers.push('DEPORTMENT MARK (5)', 'DEPORTMENT COMMENT')
        
        // RECORDS MANAGEMENT
        headers.push('RECORDS MANAGEMENT MARK (15)', 'RECORDS MANAGEMENT COMMENT')
        
        // TEACHING AND LEARNING ENVIRONMENT
        headers.push('TEACHING AND LEARNING ENVIRONMENT MARK (10)', 'TEACHING AND LEARNING ENVIRONMENT COMMENT')
        
        // SELECTABLE 3 CATEGORIES - Research-based Child Study & Community Service/Research & Innovation/Research & Industrialisation
        headers.push('SELECTABLE 3 CATEGORIES MARK (30)', 'SELECTABLE 3 CATEGORIES COMMENT')
        
        // REMAINING 2 PILLARS (assessed together out of 10% each taking 5%)
        headers.push('REMAINING 2 PILLARS MARK (10)', 'REMAINING 2 PILLARS COMMENT')
      } else if (assessmentType === 'junior') {
        // Junior Level criteria - exactly matching online form
        // PREPARATION and its aspects
        headers.push('PREPARATION MARK (15)', 'PREPARATION COMMENT')
        
        // LESSON FACILITATION and its aspects
        headers.push('LESSON FACILITATION MARK (15)', 'LESSON FACILITATION COMMENT')
        
        // DEPORTMENT and its aspects
        headers.push('DEPORTMENT MARK (5)', 'DEPORTMENT COMMENT')
        
        // RECORDS MANAGEMENT
        headers.push('RECORDS MANAGEMENT MARK (15)', 'RECORDS MANAGEMENT COMMENT')
        
        // TEACHING AND LEARNING ENVIRONMENT
        headers.push('TEACHING AND LEARNING ENVIRONMENT MARK (10)', 'TEACHING AND LEARNING ENVIRONMENT COMMENT')
        
        // SELECTABLE 3 CATEGORIES - Research-based Community Service/Research & Innovation/Research & Industrialisation
        headers.push('SELECTABLE 3 CATEGORIES MARK (30)', 'SELECTABLE 3 CATEGORIES COMMENT')
        
        // REMAINING 2 PILLARS (assessed together out of 10% each taking 5%)
        headers.push('REMAINING 2 PILLARS MARK (10)', 'REMAINING 2 PILLARS COMMENT')
      } else {
        // Standard criteria for Secondary, ISEN
        if (selectedCriteria.includes('preparation')) {
          headers.push('PREPARATION MARK (10)', 'PREPARATION COMMENT')
        }
        if (selectedCriteria.includes('lessonPlanning')) {
          headers.push('LESSON PLANNING MARK (15)', 'LESSON PLANNING COMMENT')
        }
        if (selectedCriteria.includes('personal')) {
          headers.push('PERSONAL MARK (5)', 'PERSONAL COMMENT')
        }
        if (selectedCriteria.includes('records')) {
          headers.push('RECORDS MANAGEMENT MARK (15)', 'RECORDS MANAGEMENT COMMENT')
        }
        if (selectedCriteria.includes('environment')) {
          headers.push('ENVIRONMENT MARK (10)', 'ENVIRONMENT COMMENT')
        }
        if (selectedCriteria.includes('community')) {
          headers.push('COMMUNITY MARK (20)', 'COMMUNITY COMMENT')
        }
        if (selectedCriteria.includes('research')) {
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
                  size: 14,
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
                  top: { style: "thick", color: { rgb: "000000" } },
                  bottom: { style: "thick", color: { rgb: "000000" } },
                  left: { style: "thick", color: { rgb: "000000" } },
                  right: { style: "thick", color: { rgb: "000000" } }
                }
              }
            }

    // Add data validation for marks columns
    const markColumns = headers
      .map((header, index) => ({ header, index }))
      .filter(({ header }) => header.includes('Mark'))
      .map(({ index }) => index)

    markColumns.forEach(colIndex => {
      const header = headers[colIndex]
      let maxMark = '100'
      
      // Set specific max marks based on assessment type
      if (assessmentType === 'ecd') {
        // ECD Level specific mark allocations - exactly matching online form
        if (header.includes('PREPARATION MARK')) {
          maxMark = '15'
        } else if (header.includes('LESSON FACILITATION MARK')) {
          maxMark = '15'
        } else if (header.includes('DEPORTMENT MARK')) {
          maxMark = '5'
        } else if (header.includes('RECORDS MANAGEMENT MARK')) {
          maxMark = '15'
        } else if (header.includes('TEACHING AND LEARNING ENVIRONMENT MARK')) {
          maxMark = '10'
        } else if (header.includes('SELECTABLE 3 CATEGORIES MARK')) {
          maxMark = '30'
        } else if (header.includes('REMAINING 2 PILLARS MARK')) {
          maxMark = '10'
        } else {
          maxMark = header?.match(/\((\d+)\)/)?.[1] || '100'
        }
      } else if (assessmentType === 'junior') {
        // Junior Level specific mark allocations - exactly matching online form
        if (header.includes('PREPARATION MARK')) {
          maxMark = '15'
        } else if (header.includes('LESSON FACILITATION MARK')) {
          maxMark = '15'
        } else if (header.includes('DEPORTMENT MARK')) {
          maxMark = '5'
        } else if (header.includes('RECORDS MANAGEMENT MARK')) {
          maxMark = '15'
        } else if (header.includes('TEACHING AND LEARNING ENVIRONMENT MARK')) {
          maxMark = '10'
        } else if (header.includes('SELECTABLE 3 CATEGORIES MARK')) {
          maxMark = '30'
        } else if (header.includes('REMAINING 2 PILLARS MARK')) {
          maxMark = '10'
        } else {
          maxMark = header?.match(/\((\d+)\)/)?.[1] || '100'
        }
      } else {
        maxMark = header?.match(/\((\d+)\)/)?.[1] || '100'
      }
      
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: colIndex })
      
      // Add data validation using XLSX.js dv property
      if (!ws[cellRef]) {
        ws[cellRef] = { v: '', t: 'n' }
      }
      
      // Add data validation constraint
      ws[cellRef].dv = {
        type: 'whole',
        operator: 'lessThanOrEqual',
        formula1: maxMark,
        showInputMessage: true,
        showErrorMessage: true,
        inputTitle: 'Mark Entry',
        inputMessage: `Enter a mark between 0 and ${maxMark}`,
        errorTitle: 'Invalid Mark',
        errorMessage: `Mark must be between 0 and ${maxMark}. Please correct your entry.`,
        errorStyle: 'stop'
      }
    })

    // Add data validation for SELECTED CATEGORY column
    const selectedCategoryColIndex = headers.findIndex(header => header === 'SELECTED CATEGORY')
    if (selectedCategoryColIndex !== -1) {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: selectedCategoryColIndex })
      
      if (!ws[cellRef]) {
        ws[cellRef] = { v: '', t: 's' }
      }
      
      // Add dropdown validation for research categories based on assessment type
      let researchCategories = []
      if (assessmentType === 'ecd') {
        researchCategories = [
          'Research-based Child Study & Community Service',
          'Research & Innovation',
          'Research & Industrialisation'
        ]
      } else if (assessmentType === 'junior') {
        researchCategories = [
          'Research-based Community Service',
          'Research & Innovation',
          'Research & Industrialisation'
        ]
      } else {
        researchCategories = [
          'Community Service',
          'Research & Innovation',
          'Research & Industrialisation'
        ]
      }
      
      ws[cellRef].dv = {
        type: 'list',
        formula1: `"${researchCategories.join(',')}"`,
        showInputMessage: true,
        showErrorMessage: true,
        inputTitle: 'Select Research Category',
        inputMessage: 'Choose one of the three research categories',
        errorTitle: 'Invalid Selection',
        errorMessage: 'Please select a valid research category from the dropdown list.',
        errorStyle: 'stop'
      }
    }

    // Add sample data row
    const sampleData = headers.map((header, index) => {
      if (header.includes('Mark')) {
        return 0 // Default mark
      } else if (header.includes('Comment')) {
        return '' // Empty comment
      } else if (header === 'Assessment Date') {
        return new Date().toISOString().slice(0, 16) // Current date
      } else if (header === 'SELECTED CATEGORY') {
        // Show the first research category as an example based on assessment type
        if (assessmentType === 'ecd') {
          return 'Research-based Child Study & Community Service'
        } else if (assessmentType === 'junior') {
          return 'Research-based Community Service'
        } else {
          return 'Community Service'
        }
      } else if (header === 'REMAINING 2 PILLARS') {
        // Show remaining pillars based on assessment type
        return getRemainingPillarsText(assessmentType, selectedCriteria)
      } else {
        return '' // Empty for other fields
      }
    })
    
    XLSX.utils.sheet_add_aoa(ws, [sampleData], { origin: -1 })

    // Style the sample data row for better visibility
    const dataRange = XLSX.utils.decode_range(ws['!ref'])
    for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C })
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: {
            bold: false,
            size: 11,
            color: { rgb: "000000" },
            name: "Arial"
          },
          fill: { fgColor: { rgb: "F8F9FA" } },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        }
      }
    }

    // Add instructions sheet
    const instructions = [
      ['OFFLINE ASSESSMENT TEMPLATE INSTRUCTIONS'],
      [''],
      ['GENERAL INSTRUCTIONS:'],
      ['1. Fill in the basic information: Student Candidate (candidate number), Subject, Topic, Assessment Date'],
      ['2. For SELECTED CATEGORY: Use the dropdown to choose ONE of the three research categories:'],
      ...(assessmentType === 'ecd' ? [
        ['   - Research-based Child Study & Community Service'],
        ['   - Research & Innovation'],
        ['   - Research & Industrialisation']
      ] : assessmentType === 'junior' ? [
        ['   - Research-based Community Service'],
        ['   - Research & Innovation'],
        ['   - Research & Industrialisation']
      ] : [
        ['   - Community Service'],
        ['   - Research & Innovation'],
        ['   - Research & Industrialisation']
      ]),
      ['3. For REMAINING 2 PILLARS: These are the other two categories that will also be assessed (out of 10% each taking 5%)'],
      ...(assessmentType === 'ecd' ? [
        [''],
        ['ECD ASSESSMENT CRITERIA:'],
        ['- PREPARATION and its aspects (15 marks)'],
        ['- LESSON FACILITATION and its aspects (15 marks)'],
        ['- DEPORTMENT and its aspects (5 marks)'],
        ['- RECORDS MANAGEMENT (15 marks)'],
        ['- TEACHING AND LEARNING ENVIRONMENT (10 marks)'],
        ['- SELECTABLE 3 CATEGORIES: Research-based Child Study & Community Service/Research & Innovation/Research & Industrialisation (30 marks)'],
        ['  * Supervisor must select ONE category from the three options'],
        ['- REMAINING 2 PILLARS (assessed together out of 10% each taking 5%) (10 marks)'],
        [''],
        ['4. For each selected criteria, enter the mark (0 to maximum) and add comments']
      ] : assessmentType === 'junior' ? [
        [''],
        ['JUNIOR LEVEL ASSESSMENT CRITERIA:'],
        ['- PREPARATION and its aspects (15 marks)'],
        ['- LESSON FACILITATION and its aspects (15 marks)'],
        ['- DEPORTMENT and its aspects (5 marks)'],
        ['- RECORDS MANAGEMENT (15 marks)'],
        ['- TEACHING AND LEARNING ENVIRONMENT (10 marks)'],
        ['- SELECTABLE 3 CATEGORIES: Research-based Community Service/Research & Innovation/Research & Industrialisation (30 marks)'],
        ['  * Supervisor must select ONE category from the three options'],
        ['- REMAINING 2 PILLARS (assessed together out of 10% each taking 5%) (10 marks)'],
        [''],
        ['4. For each selected criteria, enter the mark (0 to maximum) and add comments']
      ] : assessmentType === 'materials' ? [
        [''],
        ['MATERIALS DEVELOPMENT ASSESSMENT CRITERIA:'],
        ['- Content Quality (20 marks)'],
        ['  • Relevance to curriculum (10 marks)'],
        ['  • Organization and structure (10 marks)'],
        ['- Pedagogical Value (20 marks)'],
        ['  • Alignment with learning objectives (5 marks)'],
        ['  • Student engagement strategies (5 marks)'],
        ['  • Connection to real-world applications (5 marks)'],
        ['  • Inclusive learning approaches (5 marks)'],
        ['- Design & Layout (20 marks)'],
        ['  • Visual appeal and clarity (5 marks)'],
        ['  • Navigation and usability (5 marks)'],
        ['  • Quality of presentation (5 marks)'],
        ['  • Consistency in design (5 marks)'],
        ['- Innovation & Creativity (20 marks)'],
        ['  • Originality and creativity (10 marks)'],
        ['  • Use of technology (10 marks)'],
        ['- Education 5.0 Compliance (20 marks)'],
        ['  • Local content integration (5 marks)'],
        ['  • Cultural heritage preservation (5 marks)'],
        ['  • Problem-solving focus (5 marks)'],
        ['  • Commercial viability (5 marks)'],
        [''],
        ['4. For each selected criteria, enter the mark (0 to maximum) and add comments']
      ] : [
        ['4. For each selected criteria, enter the mark (0 to maximum) and add comments']
      ]),
      ['5. Marks should be entered as numbers only (no decimals unless specified)'],
      ['6. Comments should be descriptive and constructive'],
      ['7. All headings are in BOLD and clearly marked for easy identification'],
      ['8. Save the file and upload it back to the system when complete'],
      [''],
      ['STUDENT DETAILS:'],
      ['- Only STUDENT CANDIDATE field needs to be filled (student candidate number)'],
      ['- All other student details (name, sex, email, school, class) will be automatically populated from the database'],
      ['- The system will match students using the candidate number provided'],
      [''],
      ['MARKING GUIDELINES:'],
      ['- Each criteria has a maximum mark indicated in parentheses (e.g., PREPARATION MARK (10))'],
      ['- Enter marks as whole numbers (0, 1, 2, etc.) - NO DECIMALS ALLOWED'],
      ['- Marks are automatically validated: you CANNOT enter marks above the maximum'],
      ['- If you try to enter a mark above the limit, Excel will show an error message'],
      ['- Use comments to justify your marks and provide feedback'],
      ['- Ensure all required fields are completed before submission'],
      ['- Example: If a field shows "PREPARATION MARK (10)", you can only enter 0-10'],
      [''],
      ['SELECTED CRITERIA:'],
      ...selectedCriteria.map(criteria => [`• ${criteria}`]),
      [''],
      ['ASSESSMENT TYPE:'],
      [`• ${assessmentType.toUpperCase()}`],
      [''],
      ['VALIDATION RULES:'],
      ['- Excel will prevent you from entering marks above the maximum allowed'],
      ['- If you see an error message, check that your mark is within the valid range'],
      ['- All mark fields have built-in validation that cannot be bypassed'],
      ['- The system will also validate marks again during upload for extra security'],
      ['- Invalid marks will be highlighted and must be corrected before upload'],
      [''],
      ['IMPORTANT NOTES:'],
      ['- This template is specifically designed for offline assessment'],
      ['- All headings and sections are clearly marked in BOLD'],
      ['- Follow the marking scheme exactly as specified'],
      ['- Student details will be automatically updated from the database during import'],
      ['- Contact your supervisor if you have any questions about mark limits']
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
                  size: 18,
                  color: { rgb: "FFFFFF" },
                  name: "Arial"
                },
                fill: { fgColor: { rgb: "1E40AF" } },
                alignment: {
                  horizontal: "center",
                  vertical: "center"
                },
                border: {
                  top: { style: "thick", color: { rgb: "000000" } },
                  bottom: { style: "thick", color: { rgb: "000000" } },
                  left: { style: "thick", color: { rgb: "000000" } },
                  right: { style: "thick", color: { rgb: "000000" } }
                }
              }
            }

            // Style all section headings and make them bold
            const sectionHeadings = ['GENERAL INSTRUCTIONS:', 'STUDENT DETAILS:', 'MARKING GUIDELINES:', 'VALIDATION RULES:', 'SELECTED CRITERIA:', 'ASSESSMENT TYPE:', 'IMPORTANT NOTES:']
            sectionHeadings.forEach(heading => {
              const rowIndex = instructions.findIndex(row => row[0] === heading)
              if (rowIndex !== -1) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 })
                if (instructionsWs[cellAddress]) {
                  instructionsWs[cellAddress].s = {
                    font: {
                      bold: true,
                      size: 16,
                      color: { rgb: "FFFFFF" },
                      name: "Arial"
                    },
                    fill: { fgColor: { rgb: "1E40AF" } },
                    alignment: {
                      horizontal: "left",
                      vertical: "center"
                    },
                    border: {
                      top: { style: "medium", color: { rgb: "000000" } },
                      bottom: { style: "medium", color: { rgb: "000000" } },
                      left: { style: "medium", color: { rgb: "000000" } },
                      right: { style: "medium", color: { rgb: "000000" } }
                    }
                  }
                }
              }
            })

            // Style all instruction text to be more visible
            for (let R = 0; R < instructions.length; R++) {
              for (let C = 0; C < 1; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
                if (instructionsWs[cellAddress] && !instructionsWs[cellAddress].s) {
                  instructionsWs[cellAddress].s = {
                    font: {
                      bold: false,
                      size: 12,
                      color: { rgb: "000000" },
                      name: "Arial"
                    },
                    fill: { fgColor: { rgb: "FFFFFF" } },
                    alignment: {
                      horizontal: "left",
                      vertical: "top",
                      wrapText: true
                    },
                    border: {
                      top: { style: "thin", color: { rgb: "CCCCCC" } },
                      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                      left: { style: "thin", color: { rgb: "CCCCCC" } },
                      right: { style: "thin", color: { rgb: "CCCCCC" } }
                    }
                  }
                }
              }
            }

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

function getRemainingPillarsText(assessmentType: string, selectedCriteria: string[]): string {
  if (assessmentType === 'materials') {
    // For materials development, show all 5 categories as remaining if none selected
    const allCategories = ['content', 'pedagogical', 'design', 'innovation', 'education']
    const remaining = allCategories.filter(cat => !selectedCriteria.includes(cat))
    return remaining.length > 0 ? remaining.join(' & ') : 'All Categories Selected'
  } else if (assessmentType === 'ecd') {
    // For ECD, show the remaining 2 research pillars
    return 'Research & Innovation & Research & Industrialisation'
  } else if (assessmentType === 'junior') {
    // For Junior, show the remaining 2 research pillars
    return 'Research & Innovation & Research & Industrialisation'
  } else {
    // For Secondary/ISEN, show the remaining 2 research pillars
    return 'Research & Innovation & Research & Industrialisation'
  }
}
