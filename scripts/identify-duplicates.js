import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function identifyDuplicates() {
  console.log('🔍 Identifying duplicate entries in database...')
  
  try {
    let totalDuplicates = 0

    // 1. Check for duplicate students
    console.log('\n📚 Checking for duplicate students...')
    const duplicateStudents = await prisma.$queryRaw`
      SELECT candidateNo, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM students 
      GROUP BY candidateNo 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateStudents.length > 0) {
      console.log(`❌ Found ${duplicateStudents.length} duplicate student candidate numbers:`)
      for (const dup of duplicateStudents) {
        console.log(`   - Candidate No: ${dup.candidateNo} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    } else {
      console.log('✅ No duplicate students found')
    }

    // 2. Check for duplicate supervisors
    console.log('\n👨‍🏫 Checking for duplicate supervisors...')
    const duplicateSupervisorsEmail = await prisma.$queryRaw`
      SELECT email, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM supervisors 
      GROUP BY email 
      HAVING COUNT(*) > 1
    `
    
    const duplicateSupervisorsNationalId = await prisma.$queryRaw`
      SELECT nationalId, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM supervisors 
      GROUP BY nationalId 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateSupervisorsEmail.length > 0) {
      console.log(`❌ Found ${duplicateSupervisorsEmail.length} duplicate supervisor emails:`)
      for (const dup of duplicateSupervisorsEmail) {
        console.log(`   - Email: ${dup.email} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    }
    
    if (duplicateSupervisorsNationalId.length > 0) {
      console.log(`❌ Found ${duplicateSupervisorsNationalId.length} duplicate supervisor national IDs:`)
      for (const dup of duplicateSupervisorsNationalId) {
        console.log(`   - National ID: ${dup.nationalId} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    }
    
    if (duplicateSupervisorsEmail.length === 0 && duplicateSupervisorsNationalId.length === 0) {
      console.log('✅ No duplicate supervisors found')
    }

    // 3. Check for duplicate districts
    console.log('\n🏘️ Checking for duplicate districts...')
    const duplicateDistricts = await prisma.$queryRaw`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM districts 
      GROUP BY name 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateDistricts.length > 0) {
      console.log(`❌ Found ${duplicateDistricts.length} duplicate district names:`)
      for (const dup of duplicateDistricts) {
        console.log(`   - Name: ${dup.name} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    } else {
      console.log('✅ No duplicate districts found')
    }

    // 4. Check for duplicate admin users
    console.log('\n👤 Checking for duplicate admin users...')
    const duplicateAdmins = await prisma.$queryRaw`
      SELECT email, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM admin_users 
      GROUP BY email 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateAdmins.length > 0) {
      console.log(`❌ Found ${duplicateAdmins.length} duplicate admin emails:`)
      for (const dup of duplicateAdmins) {
        console.log(`   - Email: ${dup.email} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    } else {
      console.log('✅ No duplicate admin users found')
    }

    // 5. Check for duplicate assessments
    console.log('\n📝 Checking for duplicate assessments...')
    const duplicateAssessments = await prisma.$queryRaw`
      SELECT supervisorId, studentId, assessmentDate, subject, topic, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM assessments 
      GROUP BY supervisorId, studentId, assessmentDate, subject, topic 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateAssessments.length > 0) {
      console.log(`❌ Found ${duplicateAssessments.length} duplicate assessment combinations:`)
      for (const dup of duplicateAssessments) {
        console.log(`   - Supervisor ${dup.supervisorId}, Student ${dup.studentId}, ${dup.assessmentDate}, ${dup.subject} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    } else {
      console.log('✅ No duplicate assessments found')
    }

    // 6. Check for duplicate system settings
    console.log('\n⚙️ Checking for duplicate system settings...')
    const duplicateSettings = await prisma.$queryRaw`
      SELECT \`key\`, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM system_settings 
      GROUP BY \`key\` 
      HAVING COUNT(*) > 1
    `
    
    if (duplicateSettings.length > 0) {
      console.log(`❌ Found ${duplicateSettings.length} duplicate system settings:`)
      for (const dup of duplicateSettings) {
        console.log(`   - Key: ${dup.key} (${dup.count} entries) - IDs: ${dup.ids}`)
        totalDuplicates += parseInt(dup.count) - 1
      }
    } else {
      console.log('✅ No duplicate system settings found')
    }

    console.log(`\n📊 Summary:`)
    console.log(`   Total duplicate entries that would be removed: ${totalDuplicates}`)
    
    if (totalDuplicates > 0) {
      console.log(`\n⚠️  To remove these duplicates, run: node scripts/cleanup-duplicates.js`)
      console.log(`💾 Make sure to backup your database first: node scripts/backup-database.js`)
    } else {
      console.log(`\n🎉 No duplicates found! Your database is clean.`)
    }
    
  } catch (error) {
    console.error('❌ Error identifying duplicates:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the identification
identifyDuplicates()
  .then(() => {
    console.log('✅ Duplicate identification completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Duplicate identification failed:', error)
    process.exit(1)
  })
