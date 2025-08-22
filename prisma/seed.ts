import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Dummy supervisors
  const supervisors = [
    { fullName: 'Alice Moyo', email: 'alice.moyo@example.com', phoneNumber: '+263777000001', nationalId: '63-1111111X18' },
    { fullName: 'Brian Ncube', email: 'brian.ncube@example.com', phoneNumber: '+263777000002', nationalId: '63-2222222X18' },
    { fullName: 'Chipo Dube', email: 'chipo.dube@example.com', phoneNumber: '+263777000003', nationalId: '63-3333333X18' },
  ]

  for (const s of supervisors) {
    await prisma.supervisor.upsert({
      where: { email: s.email },
      update: s,
      create: s,
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

