import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and schema...')
  
  try {
    // Test 1: Create a test supervisor
    console.log('\n1️⃣ Testing supervisor creation...')
    
    const testSupervisor = await prisma.supervisor.create({
      data: {
        fullName: 'Test Supervisor',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        nationalId: 'TEST123456',
        passwordHash: 'test_hash',
        pinHash: 'test_pin'
      }
    })
    
    console.log('✅ Supervisor created successfully:', testSupervisor.id)
    
    // Test 2: Create a test district
    console.log('\n2️⃣ Testing district creation...')
    
    const testDistrict = await prisma.district.create({
      data: {
        name: 'Test District'
      }
    })
    
    console.log('✅ District created successfully:', testDistrict.id)
    
    // Test 3: Update supervisor with district
    console.log('\n3️⃣ Testing supervisor update with district...')
    
    const updatedSupervisor = await prisma.supervisor.update({
      where: { id: testSupervisor.id },
      data: { districtId: testDistrict.id }
    })
    
    console.log('✅ Supervisor updated with district:', updatedSupervisor.districtId)
    
    // Test 4: Create a test student
    console.log('\n4️⃣ Testing student creation...')
    
    const testStudent = await prisma.student.create({
      data: {
        fullName: 'Test Student',
        sex: 'Male',
        candidateNo: 'TEST/001/2024',
        email: 'student@example.com',
        schoolName: 'Test School',
        className: 'Test Class',
        districtId: testDistrict.id
      }
    })
    
    console.log('✅ Student created successfully:', testStudent.id)
    
    // Test 5: Create a test assessment with selectedResearchCategory
    console.log('\n5️⃣ Testing assessment creation with selectedResearchCategory...')
    
    const testAssessment = await prisma.assessment.create({
      data: {
        assessmentDate: new Date(),
        subject: 'Test Subject',
        topic: 'Test Topic',
        preparationMark: 10,
        preparationComment: 'Test comment',
        lessonPlanningMark: 15,
        lessonPlanningComment: 'Test comment',
        environmentMark: 8,
        environmentComment: 'Test comment',
        documentsMark: 7,
        documentsComment: 'Test comment',
        introductionMark: 2,
        introductionComment: 'Test comment',
        developmentMark: 20,
        developmentComment: 'Test comment',
        conclusionMark: 2,
        conclusionComment: 'Test comment',
        personalDimensionsMark: 3,
        personalDimensionsComment: 'Test comment',
        communityMark: 25,
        communityComment: 'Test comment',
        selectedResearchCategory: 'community_service',
        formType: 'junior',
        overallComment: 'Test overall comment',
        supervisorId: testSupervisor.id,
        studentId: testStudent.id
      }
    })
    
    console.log('✅ Assessment created successfully:', testAssessment.id)
    console.log('✅ selectedResearchCategory field working:', testAssessment.selectedResearchCategory)
    
    // Test 6: Clean up test data
    console.log('\n6️⃣ Cleaning up test data...')
    
    await prisma.assessment.delete({ where: { id: testAssessment.id } })
    await prisma.student.delete({ where: { id: testStudent.id } })
    await prisma.supervisor.delete({ where: { id: testSupervisor.id } })
    await prisma.district.delete({ where: { id: testDistrict.id } })
    
    console.log('✅ Test data cleaned up')
    
    console.log('\n🎉 All database operations successful!')
    console.log('✅ Database schema is working correctly')
    console.log('✅ All new fields are accessible')
    console.log('✅ selectedResearchCategory field is working')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testDatabaseConnection()
  .then(() => {
    console.log('✅ Database connection test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Database connection test failed:', error)
    process.exit(1)
  })
