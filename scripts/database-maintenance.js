import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function databaseMaintenance() {
  console.log('🔧 Running comprehensive database maintenance...')
  
  try {
    let issuesFound = 0

    // 1. Check for orphaned records
    console.log('\n🔍 Checking for orphaned records...')
    
    // Orphaned assessments (supervisor or student doesn't exist)
    const orphanedAssessments = await prisma.$queryRaw`
      SELECT a.id, a.supervisorId, a.studentId 
      FROM assessments a 
      LEFT JOIN supervisors s ON a.supervisorId = s.id 
      LEFT JOIN students st ON a.studentId = st.id 
      WHERE s.id IS NULL OR st.id IS NULL
    `
    
    if (orphanedAssessments.length > 0) {
      console.log(`❌ Found ${orphanedAssessments.length} orphaned assessments:`)
      for (const orphan of orphanedAssessments) {
        console.log(`   - Assessment ID: ${orphan.id} (Supervisor: ${orphan.supervisorId}, Student: ${orphan.studentId})`)
        issuesFound++
      }
    } else {
      console.log('✅ No orphaned assessments found')
    }

    // 2. Check for students with invalid district references
    console.log('\n🏘️ Checking for students with invalid district references...')
    const studentsWithInvalidDistricts = await prisma.$queryRaw`
      SELECT s.id, s.fullName, s.districtId 
      FROM students s 
      LEFT JOIN districts d ON s.districtId = d.id 
      WHERE s.districtId IS NOT NULL AND d.id IS NULL
    `
    
    if (studentsWithInvalidDistricts.length > 0) {
      console.log(`❌ Found ${studentsWithInvalidDistricts.length} students with invalid district references:`)
      for (const student of studentsWithInvalidDistricts) {
        console.log(`   - Student: ${student.fullName} (ID: ${student.id}, District ID: ${student.districtId})`)
        issuesFound++
      }
    } else {
      console.log('✅ No students with invalid district references found')
    }

    // 3. Check for supervisors with invalid district references
    console.log('\n👨‍🏫 Checking for supervisors with invalid district references...')
    const supervisorsWithInvalidDistricts = await prisma.$queryRaw`
      SELECT s.id, s.fullName, s.districtId 
      FROM supervisors s 
      LEFT JOIN districts d ON s.districtId = d.id 
      WHERE s.districtId IS NOT NULL AND d.id IS NULL
    `
    
    if (supervisorsWithInvalidDistricts.length > 0) {
      console.log(`❌ Found ${supervisorsWithInvalidDistricts.length} supervisors with invalid district references:`)
      for (const supervisor of supervisorsWithInvalidDistricts) {
        console.log(`   - Supervisor: ${supervisor.fullName} (ID: ${supervisor.id}, District ID: ${supervisor.districtId})`)
        issuesFound++
      }
    } else {
      console.log('✅ No supervisors with invalid district references found')
    }

    // 4. Check for empty or null critical fields
    console.log('\n📝 Checking for empty critical fields...')
    
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
      console.log(`❌ Found ${studentsWithEmptyNames.length} students with empty critical fields:`)
      for (const student of studentsWithEmptyNames) {
        console.log(`   - Student ID: ${student.id}, Name: "${student.fullName}", Candidate No: "${student.candidateNo}", Email: "${student.email}"`)
        issuesFound++
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
      console.log(`❌ Found ${supervisorsWithEmptyNames.length} supervisors with empty critical fields:`)
      for (const supervisor of supervisorsWithEmptyNames) {
        console.log(`   - Supervisor ID: ${supervisor.id}, Name: "${supervisor.fullName}", Email: "${supervisor.email}", National ID: "${supervisor.nationalId}"`)
        issuesFound++
      }
    } else {
      console.log('✅ No supervisors with empty critical fields found')
    }

    // 5. Check for assessments with invalid marks (negative or too high)
    console.log('\n📊 Checking for assessments with invalid marks...')
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
      console.log(`❌ Found ${assessmentsWithInvalidMarks.length} assessments with invalid marks:`)
      for (const assessment of assessmentsWithInvalidMarks) {
        console.log(`   - Assessment ID: ${assessment.id}, Subject: ${assessment.subject}`)
        console.log(`     Preparation: ${assessment.preparationMark}, Lesson Planning: ${assessment.lessonPlanningMark}`)
        console.log(`     Environment: ${assessment.environmentMark}, Documents: ${assessment.documentsMark}`)
        console.log(`     Introduction: ${assessment.introductionMark}, Development: ${assessment.developmentMark}`)
        console.log(`     Conclusion: ${assessment.conclusionMark}, Personal: ${assessment.personalDimensionsMark}`)
        console.log(`     Community: ${assessment.communityMark}`)
        issuesFound++
      }
    } else {
      console.log('✅ No assessments with invalid marks found')
    }

    // 6. Check for future-dated assessments
    console.log('\n📅 Checking for future-dated assessments...')
    const futureAssessments = await prisma.assessment.findMany({
      where: {
        assessmentDate: {
          gt: new Date()
        }
      }
    })
    
    if (futureAssessments.length > 0) {
      console.log(`⚠️  Found ${futureAssessments.length} assessments with future dates:`)
      for (const assessment of futureAssessments) {
        console.log(`   - Assessment ID: ${assessment.id}, Date: ${assessment.assessmentDate}, Subject: ${assessment.subject}`)
        issuesFound++
      }
    } else {
      console.log('✅ No future-dated assessments found')
    }

    // 7. Database statistics
    console.log('\n📊 Database Statistics:')
    const stats = {
      students: await prisma.student.count(),
      supervisors: await prisma.supervisor.count(),
      districts: await prisma.district.count(),
      assessments: await prisma.assessment.count(),
      adminUsers: await prisma.adminUser.count(),
      systemSettings: await prisma.systemSetting.count()
    }
    
    console.log(`   - Students: ${stats.students}`)
    console.log(`   - Supervisors: ${stats.supervisors}`)
    console.log(`   - Districts: ${stats.districts}`)
    console.log(`   - Assessments: ${stats.assessments}`)
    console.log(`   - Admin Users: ${stats.adminUsers}`)
    console.log(`   - System Settings: ${stats.systemSettings}`)

    console.log(`\n📋 Summary:`)
    if (issuesFound === 0) {
      console.log(`🎉 Database is in excellent condition! No issues found.`)
    } else {
      console.log(`⚠️  Found ${issuesFound} potential issues that may need attention.`)
      console.log(`💡 Consider reviewing and fixing these issues for better data quality.`)
    }
    
  } catch (error) {
    console.error('❌ Error during database maintenance:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the maintenance
databaseMaintenance()
  .then(() => {
    console.log('✅ Database maintenance completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Database maintenance failed:', error)
    process.exit(1)
  })
