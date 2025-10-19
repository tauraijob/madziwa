# Excel Import Guide for Assessment Templates

## Overview
The system supports uploading completed Excel assessment templates to automatically create assessment records for multiple students at once.

## How It Works
1. **Download Template**: Use the "Download Template" button to get a properly formatted Excel file
2. **Fill Data**: Complete the template with student information and assessment scores
3. **Upload**: Use the "Upload Completed Excel" button to import all assessments at once

## Required Excel Columns

### Student Information (Required)
- `STUDENT CANDIDATE` or `CANDIDATE NUMBER` or `CANDIDATE NO` - Unique student identifier

### Student Information (Auto-populated from Database)
- Student name, sex, email, school name, and class name are automatically retrieved from the database using the candidate number
- These details are managed through the student management interface and will be automatically populated during import

### Assessment Information (Required)
- `SUBJECT` - Subject being assessed
- `TOPIC` - Specific topic of assessment
- `ASSESSMENT DATE` - Date of assessment (any valid date format)
- `FORM TYPE` - Type of assessment (junior, ecd, secondary, isen, materials)

### Assessment Scores (Optional - will default to 0)
- `PREPARATION MARK` - Preparation score (0-15)
- `PREPARATION COMMENT` - Comments on preparation
- `LESSON PLANNING MARK` - Lesson planning score (0-20)
- `LESSON PLANNING COMMENT` - Comments on lesson planning
- `ENVIRONMENT MARK` - Environment score (0-10)
- `ENVIRONMENT COMMENT` - Comments on environment
- `DOCUMENTS MARK` - Documents score (0-10)
- `DOCUMENTS COMMENT` - Comments on documents
- `INTRODUCTION MARK` - Introduction score (0-3)
- `INTRODUCTION COMMENT` - Comments on introduction
- `DEVELOPMENT MARK` - Development score (0-30)
- `DEVELOPMENT COMMENT` - Comments on development
- `CONCLUSION MARK` - Conclusion score (0-3)
- `CONCLUSION COMMENT` - Comments on conclusion
- `PERSONAL DIMENSIONS MARK` - Personal dimensions score (0-4)
- `PERSONAL DIMENSIONS COMMENT` - Comments on personal dimensions
- `COMMUNITY MARK` - Community score (0-30)
- `COMMUNITY COMMENT` - Comments on community
- `SELECTED RESEARCH CATEGORY` - Research category (community_service, innovation, industrialisation)
- `OVERALL COMMENT` - Overall assessment comments

## Excel Format Requirements

### File Format
- Supported formats: `.xlsx`, `.xls`
- First row should contain column headers
- Data should start from the second row

### Column Headers
- Headers are case-insensitive
- Spaces and special characters are ignored
- Examples of valid headers:
  - `STUDENT NAME`, `Student Name`, `student name`
  - `CANDIDATE NUMBER`, `Candidate No`, `candidate_no`
  - `PREPARATION MARK`, `Preparation Mark`, `preparation_mark`

### Data Validation
- **Required fields**: Student candidate number, subject, topic, assessment date
- **Date format**: Any valid date format (Excel will auto-detect)
- **Marks**: Must be numeric values within specified ranges
- **Comments**: Can be text of any length
- **Student details**: Automatically populated from database using candidate number

## Import Process

### What Happens During Import
1. **Student Lookup**: Students are found using the candidate number from the database
2. **Student Creation**: If a student doesn't exist, a new student record is created with default values
3. **Assessment Creation**: New assessment records are created for each row
4. **Duplicate Prevention**: If an assessment already exists for the same student, subject, and date, it will be updated instead of creating a duplicate
5. **Validation**: All data is validated and errors are reported
6. **Auto-population**: Student details (name, sex, email, school, class) are automatically populated from the database

### Import Results
After upload, you'll see:
- **Total rows processed**
- **Number of assessments created**
- **Number of assessments updated**
- **Number of errors** (if any)
- **Detailed error information** for any failed rows

## Error Handling

### Common Errors
- **Missing required fields**: Student candidate number, subject, topic, assessment date
- **Invalid date format**: Assessment date must be a valid date
- **Invalid marks**: Scores must be within the specified ranges
- **Duplicate data**: Same student, subject, and date combination
- **Student not found**: Candidate number doesn't exist in the database (will create new student with default values)

### Error Details
- Each error shows the row number and specific issue
- Errors are logged to the browser console for detailed debugging
- Import continues even if some rows have errors

## Tips for Success

1. **Use the Template**: Always start with the downloaded template
2. **Check Data**: Verify all required fields are filled
3. **Validate Dates**: Ensure assessment dates are in a valid format
4. **Review Scores**: Check that marks are within the specified ranges
5. **Test Small**: Try with a few rows first to verify the format

## Support

If you encounter issues:
1. Check the error details in the import results
2. Verify your Excel format matches the requirements
3. Ensure all required fields are present
4. Contact system administrator for assistance

## Example Excel Structure

| STUDENT NAME | CANDIDATE NUMBER | SEX | EMAIL | SCHOOL NAME | CLASS NAME | SUBJECT | TOPIC | ASSESSMENT DATE | PREPARATION MARK | PREPARATION COMMENT | ... |
|--------------|------------------|-----|-------|-------------|-------------|---------|-------|-----------------|------------------|---------------------|-----|
| John Doe     | 12345           | M   | john@email.com | ABC School | Grade 7 | Mathematics | Algebra | 2024-01-15 | 12 | Good preparation | ... |
| Jane Smith   | 12346           | F   | jane@email.com | XYZ School | Grade 8 | English | Poetry | 2024-01-16 | 15 | Excellent work | ... |
