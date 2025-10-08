import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixDataQuality() {
  console.log('🔧 Fixing data quality issues...')
  
  try {
    let fixedIssues = 0

    // 1. Fix assessments with invalid marks
    console.log('\n📊 Fixing assessments with invalid marks...')
    
    const assessmentsWithInvalidMarks = await prisma.assessment.findMany({
      where: {
        OR: [
          { preparationMark: { lt: 0 } },
          { preparationMark: { gt: 20 } },
          { lessonPlanningMark: { lt: 0 } },
          { lessonPlanningMark: { gt: 20 } },
          { environmentMark: { lt: 0 } },
          { environmentMark: { gt: 10 } },
          { documentsMark: { lt: 0 } },
          { documentsMark: { gt: 10 } },
          { introductionMark: { lt: 0 } },
          { introductionMark: { gt: 3 } },
          { developmentMark: { lt: 0 } },
          { developmentMark: { gt: 30 } },
          { conclusionMark: { lt: 0 } },
          { conclusionMark: { gt: 3 } },
          { personalDimensionsMark: { lt: 0 } },
          { personalDimensionsMark: { gt: 4 } },
          { communityMark: { lt: 0 } },
          { communityMark: { gt: 30 } }
        ]
      }
    })
    
    if (assessmentsWithInvalidMarks.length > 0) {
      console.log(`Found ${assessmentsWithInvalidMarks.length} assessments with invalid marks to fix:`)
      
      for (const assessment of assessmentsWithInvalidMarks) {
        console.log(`\nFixing Assessment ID: ${assessment.id} (${assessment.subject})`)
        
        const updates = {}
        
        // Clamp marks to valid ranges
        if (assessment.preparationMark < 0 || assessment.preparationMark > 20) {
          updates.preparationMark = Math.max(0, Math.min(20, assessment.preparationMark))
          console.log(`  - Preparation: ${assessment.preparationMark} → ${updates.preparationMark}`)
        }
        
        if (assessment.lessonPlanningMark < 0 || assessment.lessonPlanningMark > 20) {
          updates.lessonPlanningMark = Math.max(0, Math.min(20, assessment.lessonPlanningMark))
          console.log(`  - Lesson Planning: ${assessment.lessonPlanningMark} → ${updates.lessonPlanningMark}`)
        }
        
        if (assessment.environmentMark < 0 || assessment.environmentMark > 10) {
          updates.environmentMark = Math.max(0, Math.min(10, assessment.environmentMark))
          console.log(`  - Environment: ${assessment.environmentMark} → ${updates.environmentMark}`)
        }
        
        if (assessment.documentsMark < 0 || assessment.documentsMark > 10) {
          updates.documentsMark = Math.max(0, Math.min(10, assessment.documentsMark))
          console.log(`  - Documents: ${assessment.documentsMark} → ${updates.documentsMark}`)
        }
        
        if (assessment.introductionMark < 0 || assessment.introductionMark > 3) {
          updates.introductionMark = Math.max(0, Math.min(3, assessment.introductionMark))
          console.log(`  - Introduction: ${assessment.introductionMark} → ${updates.introductionMark}`)
        }
        
        if (assessment.developmentMark < 0 || assessment.developmentMark > 30) {
          updates.developmentMark = Math.max(0, Math.min(30, assessment.developmentMark))
          console.log(`  - Development: ${assessment.developmentMark} → ${updates.developmentMark}`)
        }
        
        if (assessment.conclusionMark < 0 || assessment.conclusionMark > 3) {
          updates.conclusionMark = Math.max(0, Math.min(3, assessment.conclusionMark))
          console.log(`  - Conclusion: ${assessment.conclusionMark} → ${updates.conclusionMark}`)
        }
        
        if (assessment.personalDimensionsMark < 0 || assessment.personalDimensionsMark > 4) {
          updates.personalDimensionsMark = Math.max(0, Math.min(4, assessment.personalDimensionsMark))
          console.log(`  - Personal Dimensions: ${assessment.personalDimensionsMark} → ${updates.personalDimensionsMark}`)
        }
        
        if (assessment.communityMark < 0 || assessment.communityMark > 30) {
          updates.communityMark = Math.max(0, Math.min(30, assessment.communityMark))
          console.log(`  - Community: ${assessment.communityMark} → ${updates.communityMark}`)
        }
        
        if (Object.keys(updates).length > 0) {
          await prisma.assessment.update({
            where: { id: assessment.id },
            data: updates
          })
          fixedIssues++
          console.log(`  ✅ Fixed ${Object.keys(updates).length} invalid marks`)
        }
      }
    } else {
      console.log('✅ No assessments with invalid marks found')
    }

    // 2. Fix empty critical fields (if any exist)
    console.log('\n📝 Fixing empty critical fields...')
    
    const studentsWithEmptyNames = await prisma.student.findMany({
      where: {
        OR: [
          { fullName: '' },
          { candidateNo: '' },
          { email: '' }
        ]
      }
    })
    
    if (studentsWithEmptyNames.length > 0) {
      console.log(`Found ${studentsWithEmptyNames.length} students with empty critical fields`)
      for (const student of studentsWithEmptyNames) {
        const updates = {}
        
        if (student.fullName === '') {
          updates.fullName = 'Unknown Student'
          console.log(`  - Student ID ${student.id}: Setting fullName to "Unknown Student"`)
        }
        
        if (student.candidateNo === '') {
          updates.candidateNo = `TEMP_${student.id}`
          console.log(`  - Student ID ${student.id}: Setting candidateNo to "TEMP_${student.id}"`)
        }
        
        if (student.email === '') {
          updates.email = `student${student.id}@unknown.com`
          console.log(`  - Student ID ${student.id}: Setting email to "student${student.id}@unknown.com"`)
        }
        
        if (Object.keys(updates).length > 0) {
          await prisma.student.update({
            where: { id: student.id },
            data: updates
          })
          fixedIssues++
        }
      }
    } else {
      console.log('✅ No students with empty critical fields found')
    }

    const supervisorsWithEmptyNames = await prisma.supervisor.findMany({
      where: {
        OR: [
          { fullName: '' },
          { email: '' },
          { nationalId: '' }
        ]
      }
    })
    
    if (supervisorsWithEmptyNames.length > 0) {
      console.log(`Found ${supervisorsWithEmptyNames.length} supervisors with empty critical fields`)
      for (const supervisor of supervisorsWithEmptyNames) {
        const updates = {}
        
        if (supervisor.fullName === '') {
          updates.fullName = 'Unknown Supervisor'
          console.log(`  - Supervisor ID ${supervisor.id}: Setting fullName to "Unknown Supervisor"`)
        }
        
        if (supervisor.email === '') {
          updates.email = `supervisor${supervisor.id}@unknown.com`
          console.log(`  - Supervisor ID ${supervisor.id}: Setting email to "supervisor${supervisor.id}@unknown.com"`)
        }
        
        if (supervisor.nationalId === '') {
          updates.nationalId = `TEMP_${supervisor.id}`
          console.log(`  - Supervisor ID ${supervisor.id}: Setting nationalId to "TEMP_${supervisor.id}"`)
        }
        
        if (Object.keys(updates).length > 0) {
          await prisma.supervisor.update({
            where: { id: supervisor.id },
            data: updates
          })
          fixedIssues++
        }
      }
    } else {
      console.log('✅ No supervisors with empty critical fields found')
    }

    console.log(`\n📋 Summary:`)
    if (fixedIssues === 0) {
      console.log(`🎉 No data quality issues found to fix!`)
    } else {
      console.log(`✅ Fixed ${fixedIssues} data quality issues.`)
      console.log(`💡 Consider running the maintenance script again to verify all issues are resolved.`)
    }
    
  } catch (error) {
    console.error('❌ Error fixing data quality:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixDataQuality()
  .then(() => {
    console.log('✅ Data quality fix completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Data quality fix failed:', error)
    process.exit(1)
  })
