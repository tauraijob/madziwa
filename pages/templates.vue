<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Assessment Templates</h1>
        <p class="text-xl text-gray-600">Download Excel templates for offline assessment</p>
      </div>


      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Junior/Primary Template -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Junior/Primary</h3>
            <p class="text-gray-600 mb-4">Template for Junior and Primary level assessments</p>
            <a
              :href="`/api/assessments/template?type=junior`"
              class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              download
            >
              <i class="pi pi-download mr-2"></i> Download Template
            </a>
          </div>
        </div>

        <!-- ECD Template -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file text-2xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">ECD</h3>
            <p class="text-gray-600 mb-4">Template for Early Childhood Development assessments</p>
            <a
              :href="`/api/assessments/template?type=ecd`"
              class="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              download
            >
              <i class="pi pi-download mr-2"></i> Download Template
            </a>
          </div>
        </div>

        <!-- Secondary Template -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file text-2xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Secondary</h3>
            <p class="text-gray-600 mb-4">Template for Secondary level assessments</p>
            <a
              :href="`/api/assessments/template?type=secondary`"
              class="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              download
            >
              <i class="pi pi-download mr-2"></i> Download Template
            </a>
          </div>
        </div>

        <!-- ISEN Template -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file text-2xl text-orange-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">ISEN</h3>
            <p class="text-gray-600 mb-4">Template for ISEN level assessments</p>
            <a
              :href="`/api/assessments/template?type=isen`"
              class="inline-flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              download
            >
              <i class="pi pi-download mr-2"></i> Download Template
            </a>
          </div>
        </div>

        <!-- Materials Development Template -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file text-2xl text-red-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Materials Development</h3>
            <p class="text-gray-600 mb-4">Template for Materials Development assessments</p>
            <a
              :href="`/api/assessments/template?type=materials`"
              class="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              download
            >
              <i class="pi pi-download mr-2"></i> Download Template
            </a>
          </div>
        </div>

        <!-- Instructions Card -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-info-circle text-2xl text-gray-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Instructions</h3>
            <p class="text-gray-600 mb-4">Learn how to use the templates</p>
            <NuxtLink
              to="/guide"
              class="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i class="pi pi-book mr-2"></i> View Guide
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Template Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="pi pi-check text-blue-600"></i>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Data Validation</h3>
            <p class="text-gray-600 text-sm">Built-in validation prevents invalid marks and ensures data quality</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="pi pi-shield text-green-600"></i>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Error Prevention</h3>
            <p class="text-gray-600 text-sm">Excel validation rules prevent common data entry errors</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="pi pi-upload text-purple-600"></i>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p class="text-gray-600 text-sm">Completed templates can be easily uploaded back to the system</p>
          </div>
        </div>
      </div>

      <!-- Quick Start Section -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-3">Quick Start Guide</h3>
        <ol class="list-decimal list-inside space-y-2 text-blue-800">
          <li>Download the appropriate template for your assessment type</li>
          <li>Fill in the student candidate number and assessment details</li>
          <li>Enter marks and comments for each criteria (validation will guide you)</li>
          <li>Save the completed template</li>
          <li>Upload the completed template back to the system</li>
        </ol>
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
  title: 'Assessment Templates - Download Excel Templates',
  meta: [
    { name: 'description', content: 'Download Excel templates for offline assessment. No registration required. Templates include data validation and error prevention.' }
  ]
})

</script>
