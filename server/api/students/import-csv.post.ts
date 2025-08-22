import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin may import students
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may import students' })
    }

    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    }

    const file = parts.find(p => p.name === 'file')
    if (!file || !file.data) {
      throw createError({ statusCode: 400, statusMessage: 'Missing file field' })
    }

    // Parse CSV (simple parser)
    const text = file.data.toString('utf-8')
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) {
      throw createError({ statusCode: 400, statusMessage: 'CSV has no data rows' })
    }
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const required = ['surname','names','sex','phone','email','candidateNo','schoolName','className']
    // Accept flexible headers; map to expected fields
    const aliasMap: Record<string,string> = {
      surname: 'surname',
      names: 'names',
      sex: 'sex',
      phone: 'phone',
      phonenumber: 'phone',
      email: 'email',
      candidate: 'candidateNo',
      candidateno: 'candidateNo',
      srn: 'candidateNo',
      school: 'schoolName',
      schoolname: 'schoolName',
      class: 'className',
      classname: 'className',
    }
    const idxMap: Record<string,number> = {}
    header.forEach((h, i) => {
      const key = aliasMap[h] || h
      idxMap[key] = i
    })

    const results: any[] = []
    let created = 0, updated = 0, errors = 0

    for (let r = 1; r < lines.length; r++) {
      const row = lines[r].split(',')
      if (row.length === 1 && row[0].trim() === '') continue
      try {
        const surname = (row[idxMap['surname']] || '').trim()
        const names = (row[idxMap['names']] || '').trim()
        const fullName = [surname, names].filter(Boolean).join(' ')
        const sex = (row[idxMap['sex']] || '').trim()
        const phone = (row[idxMap['phone']] || '').trim()
        const email = (row[idxMap['email']] || '').trim()
        const candidateNo = (row[idxMap['candidateNo']] || '').trim()
        const schoolName = (row[idxMap['schoolName']] || '').trim()
        const className = (row[idxMap['className']] || '').trim()

        if (!fullName || !candidateNo) throw new Error('fullName and candidateNo required')

        const data = { fullName, sex, candidateNo, email, schoolName, className }

        let existing = await prisma.student.findUnique({ where: { candidateNo } })
        if (!existing) {
          await prisma.student.create({ data })
          created++
          results.push({ row: r + 1, status: 'created', candidateNo })
        } else {
          await prisma.student.update({ where: { id: existing.id }, data })
          updated++
          results.push({ row: r + 1, status: 'updated', candidateNo })
        }
      } catch (err: any) {
        errors++
        results.push({ row: r + 1, status: 'error', error: err?.message || String(err) })
      }
    }

    return { total: lines.length - 1, created, updated, errors, results }
  } catch (error) {
    console.error('Error importing students CSV:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to import students CSV' })
  }
})

