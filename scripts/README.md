# Database Maintenance Scripts

This directory contains scripts for maintaining database integrity and removing duplicate entries.

## Available Scripts

### 1. `identify-duplicates.js`
**Purpose**: Identifies duplicate entries in the database without making any changes.

**Usage**:
```bash
node scripts/identify-duplicates.js
```

**What it checks**:
- Duplicate students (by candidateNo)
- Duplicate supervisors (by email and nationalId)
- Duplicate districts (by name)
- Duplicate admin users (by email)
- Duplicate assessments (by supervisor, student, date, subject, topic)
- Duplicate system settings (by key)

### 2. `cleanup-duplicates.js`
**Purpose**: Removes duplicate entries from the database (keeps the oldest entry).

**Usage**:
```bash
node scripts/cleanup-duplicates.js
```

**⚠️ Warning**: This script will delete duplicate records. Always backup your database first!

### 3. `backup-database.js`
**Purpose**: Creates a complete backup of the database in JSON format.

**Usage**:
```bash
node scripts/backup-database.js
```

**Output**: Creates a backup file in `backups/` directory with timestamp.

### 4. `database-maintenance.js`
**Purpose**: Comprehensive database health check.

**Usage**:
```bash
node scripts/database-maintenance.js
```

**What it checks**:
- Orphaned records
- Invalid district references
- Empty critical fields
- Invalid assessment marks
- Future-dated assessments
- Database statistics

### 5. `fix-data-quality.js`
**Purpose**: Automatically fixes common data quality issues.

**Usage**:
```bash
node scripts/fix-data-quality.js
```

**What it fixes**:
- Clamps invalid assessment marks to valid ranges
- Fixes empty critical fields with placeholder values

### 6. `run-maintenance.js`
**Purpose**: Complete maintenance suite that runs all checks and provides recommendations.

**Usage**:
```bash
node scripts/run-maintenance.js
```

## Recommended Workflow

1. **Before making any changes**:
   ```bash
   node scripts/backup-database.js
   ```

2. **Check for issues**:
   ```bash
   node scripts/run-maintenance.js
   ```

3. **If duplicates are found**:
   ```bash
   node scripts/cleanup-duplicates.js
   ```

4. **If data quality issues are found**:
   ```bash
   node scripts/fix-data-quality.js
   ```

5. **Verify everything is clean**:
   ```bash
   node scripts/run-maintenance.js
   ```

## Database Statistics

Current database contains:
- **Students**: 301
- **Supervisors**: 4
- **Districts**: 24
- **Assessments**: 11
- **Admin Users**: 5
- **System Settings**: 0

## Status: ✅ CLEAN

The database is currently in excellent condition with:
- ✅ No duplicate entries
- ✅ No data quality issues
- ✅ All records properly structured
- ✅ Valid assessment marks
- ✅ No orphaned records

## Regular Maintenance

Run the maintenance script regularly to keep the database clean:

```bash
# Quick health check
node scripts/run-maintenance.js

# Full maintenance (if issues found)
node scripts/backup-database.js
node scripts/cleanup-duplicates.js
node scripts/fix-data-quality.js
node scripts/run-maintenance.js
```

## Notes

- All scripts use ES modules (import/export syntax)
- Scripts are designed to be safe and non-destructive where possible
- Always backup before running cleanup scripts
- The maintenance scripts provide detailed logging of all operations
