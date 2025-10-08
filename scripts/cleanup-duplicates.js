import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicates() {
  console.log('🔍 Starting database cleanup to remove duplicates...')
  
  try {
    // 1. Clean up duplicate students (by candidateNo)
    console.log('\n📚 Cleaning up duplicate students...')
    const duplicateStudents = await prisma.$queryRaw`
      SELECT candidateNo, COUNT(*) as count 
      FROM students 
      GROUP BY candidateNo 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateStudents.length > 0) {
      console.log(`Found ${duplicateStudents.length} duplicate student candidate numbers:`)
      for (const dup of duplicateStudents) {
        console.log(`  - ${dup.candidateNo}: ${dup.count} entries`)
        
        // Keep the oldest entry, delete the rest
        const students = await prisma.student.findMany({
          where: { candidateNo: dup.candidateNo },
          orderBy: { createdAt: 'asc' }
        })
        
        if (students.length > 1) {
          const toDelete = students.slice(1) // Keep first, delete rest
          for (const student of toDelete) {
            console.log(`    Deleting duplicate student ID: ${student.id}`)
            await prisma.student.delete({ where: { id: student.id } })
          }
        }
      }
    } else {
      console.log('✅ No duplicate students found')
    }

    // 2. Clean up duplicate supervisors (by email or nationalId)
    console.log('\n👨‍🏫 Cleaning up duplicate supervisors...')
    const duplicateSupervisorsEmail = await prisma.$queryRaw`
      SELECT email, COUNT(*) as count 
      FROM supervisors 
      GROUP BY email 
      HAVING COUNT(*) > 1
    `
    
    const duplicateSupervisorsNationalId = await prisma.$queryRaw`
      SELECT nationalId, COUNT(*) as count 
      FROM supervisors 
      GROUP BY nationalId 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateSupervisorsEmail.length > 0) {
      console.log(`Found ${duplicateSupervisorsEmail.length} duplicate supervisor emails:`)
      for (const dup of duplicateSupervisorsEmail) {
        console.log(`  - ${dup.email}: ${dup.count} entries`)
        
        const supervisors = await prisma.supervisor.findMany({
          where: { email: dup.email },
          orderBy: { createdAt: 'asc' }
        })
        
        if (supervisors.length > 1) {
          const toDelete = supervisors.slice(1)
          for (const supervisor of toDelete) {
            console.log(`    Deleting duplicate supervisor ID: ${supervisor.id}`)
            await prisma.supervisor.delete({ where: { id: supervisor.id } })
          }
        }
      }
    }
    
    if (duplicateSupervisorsNationalId.length > 0) {
      console.log(`Found ${duplicateSupervisorsNationalId.length} duplicate supervisor national IDs:`)
      for (const dup of duplicateSupervisorsNationalId) {
        console.log(`  - ${dup.nationalId}: ${dup.count} entries`)
        
        const supervisors = await prisma.supervisor.findMany({
          where: { nationalId: dup.nationalId },
          orderBy: { createdAt: 'asc' }
        })
        
        if (supervisors.length > 1) {
          const toDelete = supervisors.slice(1)
          for (const supervisor of toDelete) {
            console.log(`    Deleting duplicate supervisor ID: ${supervisor.id}`)
            await prisma.supervisor.delete({ where: { id: supervisor.id } })
          }
        }
      }
    }
    
    if (duplicateSupervisorsEmail.length === 0 && duplicateSupervisorsNationalId.length === 0) {
      console.log('✅ No duplicate supervisors found')
    }

    // 3. Clean up duplicate districts (by name)
    console.log('\n🏘️ Cleaning up duplicate districts...')
    const duplicateDistricts = await prisma.$queryRaw`
      SELECT name, COUNT(*) as count 
      FROM districts 
      GROUP BY name 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateDistricts.length > 0) {
      console.log(`Found ${duplicateDistricts.length} duplicate district names:`)
      for (const dup of duplicateDistricts) {
        console.log(`  - ${dup.name}: ${dup.count} entries`)
        
        const districts = await prisma.district.findMany({
          where: { name: dup.name },
          orderBy: { id: 'asc' }
        })
        
        if (districts.length > 1) {
          const toDelete = districts.slice(1)
          for (const district of toDelete) {
            console.log(`    Deleting duplicate district ID: ${district.id}`)
            await prisma.district.delete({ where: { id: district.id } })
          }
        }
      }
    } else {
      console.log('✅ No duplicate districts found')
    }

    // 4. Clean up duplicate admin users (by email)
    console.log('\n👤 Cleaning up duplicate admin users...')
    const duplicateAdmins = await prisma.$queryRaw`
      SELECT email, COUNT(*) as count 
      FROM admin_users 
      GROUP BY email 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateAdmins.length > 0) {
      console.log(`Found ${duplicateAdmins.length} duplicate admin emails:`)
      for (const dup of duplicateAdmins) {
        console.log(`  - ${dup.email}: ${dup.count} entries`)
        
        const admins = await prisma.adminUser.findMany({
          where: { email: dup.email },
          orderBy: { createdAt: 'asc' }
        })
        
        if (admins.length > 1) {
          const toDelete = admins.slice(1)
          for (const admin of toDelete) {
            console.log(`    Deleting duplicate admin ID: ${admin.id}`)
            await prisma.adminUser.delete({ where: { id: admin.id } })
          }
        }
      }
    } else {
      console.log('✅ No duplicate admin users found')
    }

    // 5. Clean up duplicate assessments (same supervisor, student, date, subject, topic)
    console.log('\n📝 Cleaning up duplicate assessments...')
    const duplicateAssessments = await prisma.$queryRaw`
      SELECT supervisorId, studentId, assessmentDate, subject, topic, COUNT(*) as count 
      FROM assessments 
      GROUP BY supervisorId, studentId, assessmentDate, subject, topic 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateAssessments.length > 0) {
      console.log(`Found ${duplicateAssessments.length} duplicate assessment combinations:`)
      for (const dup of duplicateAssessments) {
        console.log(`  - Supervisor ${dup.supervisorId}, Student ${dup.studentId}, ${dup.assessmentDate}, ${dup.subject}: ${dup.count} entries`)
        
        const assessments = await prisma.assessment.findMany({
          where: {
            supervisorId: dup.supervisorId,
            studentId: dup.studentId,
            assessmentDate: new Date(dup.assessmentDate),
            subject: dup.subject,
            topic: dup.topic
          },
          orderBy: { createdAt: 'asc' }
        })
        
        if (assessments.length > 1) {
          const toDelete = assessments.slice(1)
          for (const assessment of toDelete) {
            console.log(`    Deleting duplicate assessment ID: ${assessment.id}`)
            await prisma.assessment.delete({ where: { id: assessment.id } })
          }
        }
      }
    } else {
      console.log('✅ No duplicate assessments found')
    }

    // 6. Clean up duplicate system settings (by key)
    console.log('\n⚙️ Cleaning up duplicate system settings...')
    const duplicateSettings = await prisma.$queryRaw`
      SELECT \`key\`, COUNT(*) as count 
      FROM system_settings 
      GROUP BY \`key\` 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateSettings.length > 0) {
      console.log(`Found ${duplicateSettings.length} duplicate system settings:`)
      for (const dup of duplicateSettings) {
        console.log(`  - ${dup.key}: ${dup.count} entries`)
        
        const settings = await prisma.systemSetting.findMany({
          where: { key: dup.key },
          orderBy: { createdAt: 'asc' }
        })
        
        if (settings.length > 1) {
          const toDelete = settings.slice(1)
          for (const setting of toDelete) {
            console.log(`    Deleting duplicate setting ID: ${setting.id}`)
            await prisma.systemSetting.delete({ where: { id: setting.id } })
          }
        }
      }
    } else {
      console.log('✅ No duplicate system settings found')
    }

    console.log('\n🎉 Database cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupDuplicates()
  .then(() => {
    console.log('✅ Cleanup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Cleanup script failed:', error)
    process.exit(1)
  })
