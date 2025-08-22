<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p class="text-gray-600 mt-1">Your recent assessments and quick actions</p>
        </div>
        <div class="flex items-center space-x-3">
          <NuxtLink to="/assessment" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <i class="pi pi-plus mr-2"></i> New Assessment
          </NuxtLink>
          <label class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer">
            <i class="pi pi-upload mr-2"></i> Upload Excel
            <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onSupervisorImport" />
          </label>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Your Assessments</h3>
        </div>
        <div v-if="loading" class="p-6 text-gray-600">Loading…</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="a in assessments" :key="a.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ a.student.fullName }}</div>
                  <div class="text-sm text-gray-500">{{ a.student.candidateNo }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ a.subject }}</div>
                  <div class="text-sm text-gray-500">{{ a.topic }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ a.totalMark }}/100</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(a.assessmentDate) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!assessments.length" class="p-6 text-gray-600">No assessments yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'supervisor-auth' })

const loading = ref(false)
const assessments = ref([])

const fetchMine = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/assessments/by-supervisor')
    assessments.value = res.assessments || []
  } finally {
    loading.value = false
  }
}

const formatDate = (d) => new Date(d).toLocaleDateString()

const onSupervisorImport = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const result = await $fetch('/api/assessments/import-xlsx', { method: 'POST', body: formData })
    alert(`Imported. Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors}`)
    await fetchMine()
  } catch (err) {
    alert('Import failed')
  } finally {
    loading.value = false
    e.target.value = ''
  }
}

onMounted(fetchMine)
</script>

