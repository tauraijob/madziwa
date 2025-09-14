import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  // Ensure at least one district exists
  const defaultDistrict = await prisma.district.upsert({
    where: { name: 'Default District' },
    update: {},
    create: { name: 'Default District' },
  })

  // Seed admin users
  const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')
  await prisma.adminUser.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: 'superadmin@example.com',
      passwordHash: sha256('superadmin123'),
      role: 'superadmin',
    },
  })
  await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      fullName: 'District Admin',
      email: 'admin@example.com',
      passwordHash: sha256('admin123'),
      role: 'admin',
      assignedDistrictId: defaultDistrict.id,
    },
  })

  // Dummy supervisors
  const supervisors = [
    { fullName: 'Alice Moyo', email: 'alice.moyo@example.com', phoneNumber: '+263777000001', nationalId: '63-1111111X18' },
    { fullName: 'Brian Ncube', email: 'brian.ncube@example.com', phoneNumber: '+263777000002', nationalId: '63-2222222X18' },
    { fullName: 'Chipo Dube', email: 'chipo.dube@example.com', phoneNumber: '+263777000003', nationalId: '63-3333333X18' },
  ]

  for (const s of supervisors) {
    await prisma.supervisor.upsert({
      where: { email: s.email },
      update: { ...s, passwordHash: sha256('1234'), pinHash: sha256('1234') },
      create: { ...s, passwordHash: sha256('1234'), pinHash: sha256('1234') },
    })
  }

  // Dummy students
  const students = [
    { fullName: 'Tendai Chirwa', sex: 'Male', candidateNo: '23/001/24', email: 'tendai@example.com', schoolName: 'Madziwa Primary', className: 'Grade 4 Blue' },
    { fullName: 'Rudo Matanhire', sex: 'Female', candidateNo: '23/002/24', email: 'rudo@example.com', schoolName: 'Madziwa Primary', className: 'Grade 5 Red' },
    { fullName: 'Peter Mlambo', sex: 'Male', candidateNo: '23/003/24', email: 'peter@example.com', schoolName: 'St. Marys', className: 'Grade 3 Yellow' },
  ]

  for (const st of students) {
    await prisma.student.upsert({
      where: { candidateNo: st.candidateNo },
      update: st,
      create: st,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

