<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Assessment Guide</h1>
        <p class="text-xl text-gray-600">Complete guide to using assessment templates</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">How to Use Assessment Templates</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">1. Download Template</h3>
            <p class="text-gray-700 mb-2">Visit the <NuxtLink to="/templates" class="text-blue-600 hover:text-blue-800">Templates page</NuxtLink> and download the appropriate template for your assessment type:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>Junior/Primary:</strong> For primary school level assessments</li>
              <li><strong>ECD:</strong> For Early Childhood Development assessments</li>
              <li><strong>Secondary:</strong> For secondary school level assessments</li>
              <li><strong>ISEN:</strong> For ISEN level assessments</li>
              <li><strong>Materials Development:</strong> For materials development assessments</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">2. Fill in Basic Information</h3>
            <p class="text-gray-700 mb-2">Complete the required fields:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>STUDENT CANDIDATE:</strong> Enter the student's candidate number</li>
              <li><strong>SUBJECT:</strong> Enter the subject being assessed</li>
              <li><strong>TOPIC:</strong> Enter the specific topic of assessment</li>
              <li><strong>ASSESSMENT DATE:</strong> Enter the date of assessment</li>
            </ul>
            <p class="text-sm text-gray-600 mt-2">Note: Other student details (name, sex, email, school, class) will be automatically populated from the database using the candidate number.</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">3. Enter Marks and Comments</h3>
            <p class="text-gray-700 mb-2">For each assessment criteria:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Enter marks as whole numbers (0, 1, 2, etc.) - no decimals allowed</li>
              <li>Marks are automatically validated - you cannot enter marks above the maximum</li>
              <li>If you try to enter an invalid mark, Excel will show an error message</li>
              <li>Add descriptive comments to justify your marks and provide feedback</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">4. Data Validation Features</h3>
            <div class="bg-blue-50 rounded-lg p-4">
              <h4 class="font-semibold text-blue-900 mb-2">Built-in Validation:</h4>
              <ul class="list-disc list-inside text-blue-800 space-y-1">
                <li>Maximum mark limits are enforced automatically</li>
                <li>Negative marks are not allowed</li>
                <li>Only whole numbers are accepted (no decimals)</li>
                <li>Real-time error messages guide you to correct entries</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">5. Save and Upload</h3>
            <p class="text-gray-700 mb-2">Once you've completed the template:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Save the Excel file</li>
              <li>Upload the completed template back to the system</li>
              <li>The system will validate all marks again during upload</li>
              <li>Any remaining errors will be highlighted for correction</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">6. Troubleshooting</h3>
            <div class="bg-yellow-50 rounded-lg p-4">
              <h4 class="font-semibold text-yellow-900 mb-2">Common Issues:</h4>
              <ul class="list-disc list-inside text-yellow-800 space-y-1">
                <li><strong>Invalid marks:</strong> Check that marks are within the allowed range (shown in parentheses)</li>
                <li><strong>Decimal marks:</strong> Only whole numbers are allowed - round to the nearest whole number</li>
                <li><strong>Missing data:</strong> Ensure all required fields are completed</li>
                <li><strong>Student not found:</strong> Verify the candidate number is correct</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink 
            to="/templates" 
            class="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="pi pi-download mr-2"></i>
            Download Templates Now
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No authentication required for this page
definePageMeta({
  layout: 'default'
})

// SEO and meta
useHead({
  title: 'Assessment Guide - How to Use Templates',
  meta: [
    { name: 'description', content: 'Complete guide to using assessment templates for offline assessment. Learn how to download, fill, and upload templates.' }
  ]
})
</script>
