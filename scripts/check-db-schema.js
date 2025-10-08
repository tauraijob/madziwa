import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...')
  
  try {
    // Check if we can connect to the database
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Try to get a supervisor to see what fields are available
    console.log('\n📋 Checking supervisor table structure...')
    
    try {
      const supervisors = await prisma.supervisor.findMany({
        take: 1,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          nationalId: true,
          districtId: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      console.log('✅ Supervisor table accessible')
      console.log('Available fields:', Object.keys(supervisors[0] || {}))
      
    } catch (error) {
      console.log('❌ Error accessing supervisor table:', error.message)
    }
    
    // Check students table
    console.log('\n📋 Checking student table structure...')
    
    try {
      const students = await prisma.student.findMany({
        take: 1,
        select: {
          id: true,
          fullName: true,
          candidateNo: true,
          email: true,
          sex: true,
          schoolName: true,
          className: true,
          phoneNumber: true,
          districtId: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      console.log('✅ Student table accessible')
      console.log('Available fields:', Object.keys(students[0] || {}))
      
    } catch (error) {
      console.log('❌ Error accessing student table:', error.message)
    }
    
    // Check assessments table
    console.log('\n📋 Checking assessment table structure...')
    
    try {
      const assessments = await prisma.assessment.findMany({
        take: 1,
        select: {
          id: true,
          assessmentDate: true,
          subject: true,
          topic: true,
          preparationMark: true,
          lessonPlanningMark: true,
          environmentMark: true,
          documentsMark: true,
          introductionMark: true,
          developmentMark: true,
          conclusionMark: true,
          personalDimensionsMark: true,
          communityMark: true,
          formType: true,
          overallComment: true,
          supervisorId: true,
          studentId: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      console.log('✅ Assessment table accessible')
      console.log('Available fields:', Object.keys(assessments[0] || {}))
      
    } catch (error) {
      console.log('❌ Error accessing assessment table:', error.message)
    }
    
    // Check if selectedResearchCategory field exists
    console.log('\n🔍 Checking for selectedResearchCategory field...')
    
    try {
      const assessmentWithCategory = await prisma.assessment.findFirst({
        where: {
          selectedResearchCategory: {
            not: null
          }
        }
      })
      
      console.log('✅ selectedResearchCategory field exists')
      
    } catch (error) {
      console.log('❌ selectedResearchCategory field not found:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkDatabaseSchema()
  .then(() => {
    console.log('✅ Database schema check completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Database schema check failed:', error)
    process.exit(1)
  })
