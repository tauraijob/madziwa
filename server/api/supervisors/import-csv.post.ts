import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only superadmin may import supervisors
    const role = getCookie(event, 'role')
    if (role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Only superadmin may import supervisors' })
    }

    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    }

    const file = parts.find(p => p.name === 'file')
    if (!file || !file.data) {
      throw createError({ statusCode: 400, statusMessage: 'Missing file field' })
    }

    // Only accept CSV files
    const filename = (file as any).filename || ''
    if (!filename.toLowerCase().endsWith('.csv')) {
      throw createError({ statusCode: 400, statusMessage: 'Only .csv files are accepted' })
    }

    // Parse CSV
    const text = file.data.toString('utf-8')
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) {
      throw createError({ statusCode: 400, statusMessage: 'CSV has no data rows' })
    }
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    if (!header.length) throw createError({ statusCode: 400, statusMessage: 'Invalid CSV header' })

    // Expected: fullname,email,phonenumber,nationalid
    const required = ['fullname','email','phonenumber','nationalid']
    const aliasMap: Record<string,string> = {
      fullname: 'fullName',
      'full name': 'fullName',
      name: 'fullName',
      email: 'email',
      phone: 'phoneNumber',
      'phone number': 'phoneNumber',
      phonenumber: 'phoneNumber',
      mobile: 'phoneNumber',
      nationalid: 'nationalId',
      'national id': 'nationalId',
      national_id: 'nationalId',
      idnumber: 'nationalId',
      'id number': 'nationalId',
    }
    const idxMap: Record<string,number> = {}
    header.forEach((h, i) => {
      const key = aliasMap[h] || h
      idxMap[key] = i
    })
    const missing = required.filter(col => idxMap[aliasMap[col] || col] === undefined)
    if (missing.length) {
      throw createError({ statusCode: 400, statusMessage: `Missing required columns: ${missing.join(', ')}` })
    }

    let created = 0, updated = 0, errors = 0
    const results: any[] = []

    for (let r = 1; r < lines.length; r++) {
      const row = lines[r].split(',')
      if (row.length === 1 && row[0].trim() === '') continue
      try {
        const fullName = (row[idxMap['fullName']] || '').trim()
        const email = (row[idxMap['email']] || '').trim().toLowerCase()
        const phoneNumber = (row[idxMap['phoneNumber']] || '').trim()
        const rawNationalId = (row[idxMap['nationalId']] || '').trim()
        const nationalId = rawNationalId.replace(/[^a-z0-9]/gi, '').toUpperCase()

        if (!fullName || !email || !phoneNumber || !nationalId) {
          throw new Error('Missing required supervisor fields (fullname,email,phonenumber,nationalid)')
        }

        // Upsert by normalized nationalId
        const data: any = { fullName, email, phoneNumber, nationalId }
        const existing = await prisma.supervisor.findUnique({ where: { nationalId } })
        if (!existing) {
          await prisma.supervisor.create({ data })
          created++
          results.push({ row: r + 1, status: 'created', nationalId })
        } else {
          await prisma.supervisor.update({ where: { id: existing.id }, data })
          updated++
          results.push({ row: r + 1, status: 'updated', nationalId })
        }
      } catch (err: any) {
        errors++
        results.push({ row: r + 1, status: 'error', error: err?.message || String(err) })
      }
    }

    // Password logic: Supervisors authenticate with nationalId and last 4 digits of phone. No password stored.
    return { total: lines.length - 1, created, updated, errors, results }
  } catch (error) {
    console.error('Error importing supervisors CSV:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to import supervisors CSV' })
  }
})


