<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
          <p class="text-gray-600 mt-1">Manage data, imports, and high-privilege actions</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="text-sm text-gray-600">Total Assessments</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalAssessments }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="text-sm text-gray-600">Total Students</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalStudents }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="text-sm text-gray-600">Total Supervisors</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalSupervisors }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="text-sm text-gray-600">Average Score</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.averageScore }}%</div>
        </div>
      </div>

      <!-- Import Students -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Import Students (CSV)</h2>
          <label class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            <i class="pi pi-upload mr-2"></i> Import CSV
            <input type="file" accept=".csv" class="hidden" @change="onImportStudentsCsv" />
          </label>
        </div>
        <div v-if="csvImportSummary" class="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700">
          <div class="font-medium mb-1">Import Summary</div>
          <div>Created: {{ csvImportSummary.created }}, Updated: {{ csvImportSummary.updated }}, Errors: {{ csvImportSummary.errors }}</div>
        </div>
      </div>

      <!-- Dangerous actions -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
        <p class="text-sm text-gray-600 mb-4">Only superadmins can delete assessments.</p>
        <NuxtLink to="/admin" class="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <i class="pi pi-trash mr-2"></i> Go to Admin to Delete Assessments
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'superadmin-auth' })

const stats = reactive({ totalAssessments: 0, totalStudents: 0, totalSupervisors: 0, averageScore: 0 })
const csvImportSummary = ref(null)

const loadStats = async () => {
  try {
    const res = await $fetch('/api/assessments')
    stats.totalAssessments = res.statistics?.totalAssessments || 0
    stats.totalStudents = res.statistics?.totalStudents || 0
    stats.totalSupervisors = res.statistics?.totalSupervisors || 0
    stats.averageScore = res.statistics?.averageScore || 0
  } catch (e) {
    // ignore
  }
}

const onImportStudentsCsv = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const form = new FormData()
    form.append('file', file)
    const result = await $fetch('/api/students/import-csv', { method: 'POST', body: form })
    csvImportSummary.value = result
    alert(`Students import complete. Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors}`)
  } catch (err) {
    alert('Import failed. Please verify the CSV and try again.')
  } finally {
    e.target.value = ''
  }
}

onMounted(loadStats)
</script>

