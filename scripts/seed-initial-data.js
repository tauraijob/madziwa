import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

const sha256 = (input) => crypto.createHash('sha256').update(input).digest('hex')

async function seedInitialData() {
  console.log('🌱 Seeding initial data...')
  
  try {
    // 1. Create superadmin user
    console.log('\n1️⃣ Creating superadmin user...')
    
    const superadmin = await prisma.adminUser.upsert({
      where: { email: 'admin@madziwa.ac.zw' },
      update: {},
      create: {
        fullName: 'System Administrator',
        email: 'admin@madziwa.ac.zw',
        passwordHash: sha256('admin123'),
        role: 'superadmin'
      }
    })
    
    console.log('✅ Superadmin created:', superadmin.email)
    
    // 2. Clean up duplicate districts and create standardized ones
    console.log('\n2️⃣ Cleaning up districts...')
    
    // First, let's get all existing districts
    const existingDistricts = await prisma.district.findMany()
    console.log(`Found ${existingDistricts.length} existing districts`)
    
    // Define standardized district names
    const standardDistricts = [
      'Bindura',
      'Goromonzi', 
      'Guruve',
      'Mazowe',
      'Mount Darwin',
      'Murewa',
      'Mvurwi',
      'Rushinga',
      'Shamva',
      'Harare',
      'Glendale',
      'Concession',
      'Chiweshe'
    ]
    
    // Create standardized districts
    for (const districtName of standardDistricts) {
      await prisma.district.upsert({
        where: { name: districtName },
        update: {},
        create: { name: districtName }
      })
      console.log(`✅ District: ${districtName}`)
    }
    
    // 3. Create a sample supervisor
    console.log('\n3️⃣ Creating sample supervisor...')
    
    // Get the Bindura district ID
    const binduraDistrict = await prisma.district.findFirst({
      where: { name: 'Bindura' }
    })
    
    if (!binduraDistrict) {
      throw new Error('Bindura district not found')
    }
    
    const sampleSupervisor = await prisma.supervisor.upsert({
      where: { email: 'supervisor@madziwa.ac.zw' },
      update: {},
      create: {
        fullName: 'Sample Supervisor',
        email: 'supervisor@madziwa.ac.zw',
        passwordHash: sha256('supervisor123'),
        pinHash: sha256('1234'),
        phoneNumber: '+263 77 123 4567',
        nationalId: '1234567890',
        districtId: binduraDistrict.id
      }
    })
    
    console.log('✅ Sample supervisor created:', sampleSupervisor.email)
    
    // 4. Create a sample student
    console.log('\n4️⃣ Creating sample student...')
    
    const sampleStudent = await prisma.student.upsert({
      where: { candidateNo: 'SAMPLE/001/2024' },
      update: {},
      create: {
        fullName: 'Sample Student',
        sex: 'Female',
        candidateNo: 'SAMPLE/001/2024',
        email: 'student@madziwa.ac.zw',
        schoolName: 'Sample Primary School',
        className: 'Grade 7',
        phoneNumber: '+263 77 987 6543',
        districtId: binduraDistrict.id
      }
    })
    
    console.log('✅ Sample student created:', sampleStudent.candidateNo)
    
    console.log('\n🎉 Initial data seeding completed successfully!')
    console.log('\n📋 Login credentials:')
    console.log('  Superadmin: admin@madziwa.ac.zw / admin123')
    console.log('  Supervisor: supervisor@madziwa.ac.zw / 1234')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedInitialData()
