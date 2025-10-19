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
      const row = parseCSVLine(lines[r])
      
      // Skip completely empty rows
      if (row.length === 1 && row[0].trim() === '') continue
      
      // Check if row has enough columns
      if (row.length < header.length) {
        errors++
        results.push({ 
          row: r + 1, 
          status: 'error', 
          error: `Row has ${row.length} columns but header has ${header.length} columns. Expected: ${header.join(', ')}` 
        })
        continue
      }
      try {
        const fullName = (row[idxMap['fullName']] || '').trim()
        const email = (row[idxMap['email']] || '').trim().toLowerCase()
        const phoneNumber = (row[idxMap['phoneNumber']] || '').trim()
        const rawNationalId = (row[idxMap['nationalId']] || '').trim()
        const nationalId = rawNationalId.replace(/[^a-z0-9]/gi, '').toUpperCase()

        // Check for missing required fields with detailed information
        const missingFields = []
        if (!fullName) missingFields.push('fullName')
        if (!email) missingFields.push('email')
        if (!phoneNumber) missingFields.push('phoneNumber')
        if (!nationalId) missingFields.push('nationalId')
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}. Row data: ${row.join(' | ')}`)
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (email && !emailRegex.test(email)) {
          throw new Error(`Invalid email format: ${email}. Row data: ${row.join(' | ')}`)
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
        const errorMsg = err?.message || String(err)
        console.error(`Error processing supervisor row ${r + 1}:`, errorMsg)
        results.push({ row: r + 1, status: 'error', error: errorMsg })
      }
    }

    // Password logic: Supervisors authenticate with nationalId and last 4 digits of phone. No password stored.
    return { 
      total: lines.length - 1, 
      created, 
      updated, 
      errors, 
      results,
      success: errors === 0,
      message: errors > 0 ? `Import completed with ${errors} errors. Check details below.` : 'Import completed successfully!'
    }
  } catch (error) {
    console.error('Error importing supervisors CSV:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to import supervisors CSV: ${errorMessage}` 
    })
  }
})


