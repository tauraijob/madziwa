import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function backupDatabase() {
  console.log('💾 Creating database backup...')
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(__dirname, '..', 'backups')
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    
    // Export all data
    const backup = {
      timestamp: new Date().toISOString(),
      students: await prisma.student.findMany(),
      supervisors: await prisma.supervisor.findMany(),
      districts: await prisma.district.findMany(),
      assessments: await prisma.assessment.findMany(),
      adminUsers: await prisma.adminUser.findMany(),
      systemSettings: await prisma.systemSetting.findMany()
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))
    
    console.log(`✅ Database backup created: ${backupFile}`)
    console.log(`📊 Backup contains:`)
    console.log(`   - ${backup.students.length} students`)
    console.log(`   - ${backup.supervisors.length} supervisors`)
    console.log(`   - ${backup.districts.length} districts`)
    console.log(`   - ${backup.assessments.length} assessments`)
    console.log(`   - ${backup.adminUsers.length} admin users`)
    console.log(`   - ${backup.systemSettings.length} system settings`)
    
  } catch (error) {
    console.error('❌ Error creating backup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the backup
backupDatabase()
  .then(() => {
    console.log('✅ Backup completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  })
