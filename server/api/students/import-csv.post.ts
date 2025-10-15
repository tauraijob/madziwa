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

    // Only accept CSV files
    const filename = (file as any).filename || ''
    if (!filename.toLowerCase().endsWith('.csv')) {
      throw createError({ statusCode: 400, statusMessage: 'Only .csv files are accepted' })
    }

    // Parse CSV with better handling
    const text = file.data.toString('utf-8')
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
    if (lines.length < 2) {
      throw createError({ statusCode: 400, statusMessage: 'CSV has no data rows' })
    }
    
    // Simple CSV parser that handles quoted fields
    function parseCSVLine(line: string): string[] {
      const result = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }
    
    const header = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase())
    if (!header.length) throw createError({ statusCode: 400, statusMessage: 'Invalid CSV header' })
    const required = ['surname','names','sex','email','district','schoolname','classname','candidateno']
    // Accept flexible headers; map to expected fields
    const aliasMap: Record<string,string> = {
      surname: 'surname',
      names: 'names',
      sex: 'sex',
      phone: 'phone',
      phonenumber: 'phone',
      email: 'email',
      candidate: 'candidateNo',
      candidatnumber: 'candidateNo',
      candidateno: 'candidateNo',
      srn: 'candidateNo',
      candidate_no: 'candidateNo',
      candidate_number: 'candidateNo',
      school: 'schoolName',
      schoolname: 'schoolName',
      class: 'className',
      classname: 'className',
      district: 'district',
    }
    const idxMap: Record<string,number> = {}
    header.forEach((h, i) => {
      const key = aliasMap[h] || h
      idxMap[key] = i
    })
    // Ensure required columns present
    const missingCols = required.filter(col => idxMap[aliasMap[col] || col] === undefined)
    if (missingCols.length) {
      throw createError({ statusCode: 400, statusMessage: `Missing required columns: ${missingCols.join(', ')}` })
    }

    const results: any[] = []
    let created = 0, updated = 0, errors = 0

    for (let r = 1; r < lines.length; r++) {
      const row = parseCSVLine(lines[r])
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
        const districtName = (row[idxMap['district']] || '').trim()

        if (!fullName || !candidateNo || !sex || !email || !schoolName || !className || !districtName) {
          throw new Error('Missing required student fields (ensure surname,names,sex,email,district,schoolname,classname,candidateno). Phone is optional.')
        }

        // Ensure district exists if provided
        let districtId: number | undefined = undefined
        if (districtName) {
          let district = await prisma.district.findFirst({ where: { name: districtName } })
          if (!district) {
            district = await prisma.district.create({ data: { name: districtName } })
          }
          districtId = district.id
        }

        const data: any = { fullName, sex, candidateNo, email, schoolName, className }
        if (phone) data.phoneNumber = phone
        if (districtId) data.districtId = districtId

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
        const errorMsg = err?.message || String(err)
        console.error(`Error processing row ${r + 1}:`, errorMsg)
        results.push({ row: r + 1, status: 'error', error: errorMsg })
      }
    }

    return { total: lines.length - 1, created, updated, errors, results }
  } catch (error) {
    console.error('Error importing students CSV:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to import students CSV' })
  }
})

