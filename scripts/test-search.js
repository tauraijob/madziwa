import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSearch() {
  console.log('🔍 Testing student search functionality...')
  
  try {
    // Test 1: Search for a specific candidate number
    console.log('\n1️⃣ Testing search for candidate number "23/004/2024"...')
    
    const students = await prisma.student.findMany({
      where: {
        candidateNo: { contains: '23/004/2024' }
      },
      include: { district: true }
    })
    
    console.log(`Found ${students.length} students with candidate number containing "23/004/2024"`)
    if (students.length > 0) {
      students.forEach(student => {
        console.log(`  - ${student.fullName} (${student.candidateNo}) - District: ${student.district?.name || 'None'}`)
      })
    }
    
    // Test 2: Search for any students with "23" in candidate number
    console.log('\n2️⃣ Testing search for candidate number containing "23"...')
    
    const studentsWith23 = await prisma.student.findMany({
      where: {
        candidateNo: { contains: '23' }
      },
      include: { district: true }
    })
    
    console.log(`Found ${studentsWith23.length} students with candidate number containing "23"`)
    if (studentsWith23.length > 0) {
      studentsWith23.slice(0, 5).forEach(student => {
        console.log(`  - ${student.fullName} (${student.candidateNo}) - District: ${student.district?.name || 'None'}`)
      })
      if (studentsWith23.length > 5) {
        console.log(`  ... and ${studentsWith23.length - 5} more`)
      }
    }
    
    // Test 3: Check total students count
    console.log('\n3️⃣ Checking total students count...')
    const totalStudents = await prisma.student.count()
    console.log(`Total students in database: ${totalStudents}`)
    
    // Test 4: Check if there are any students with similar candidate numbers
    console.log('\n4️⃣ Checking for students with similar candidate numbers...')
    const similarStudents = await prisma.student.findMany({
      where: {
        candidateNo: { contains: '23/004' }
      },
      include: { district: true }
    })
    
    console.log(`Found ${similarStudents.length} students with candidate number containing "23/004"`)
    if (similarStudents.length > 0) {
      similarStudents.forEach(student => {
        console.log(`  - ${student.fullName} (${student.candidateNo}) - District: ${student.district?.name || 'None'}`)
      })
    }
    
    console.log('\n✅ Search functionality test completed')
    
  } catch (error) {
    console.error('❌ Error testing search:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testSearch()
  .then(() => {
    console.log('✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
