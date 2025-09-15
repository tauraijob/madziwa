<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
          <p class="text-gray-600 mt-1">Manage data, imports, and high-privilege actions</p>
        </div>
        <NuxtLink
          to="/admin"
          class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <i class="pi pi-table mr-2"></i>
          Go to Admin Dashboard
        </NuxtLink>
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
        <div class="text-sm text-gray-600 space-y-2">
          <div class="font-medium">CSV header (comma-separated):</div>
          <code class="block bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto">surname,names,sex,phone,email,district,schoolname,classname,candidateno</code>
          <div>Example row:</div>
          <code class="block bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto">Banda,Jane,Female,+263777000000,jane@example.com,Shamva,Madziwa Primary,Grade 4 Blue,23/002/24</code>
          <div>Full name is constructed as “surname + space + names”. All columns are required.</div>
        </div>
        <div v-if="csvImportSummary" class="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700">
          <div class="font-medium mb-1">Import Summary</div>
          <div>Created: {{ csvImportSummary.created }}, Updated: {{ csvImportSummary.updated }}, Errors: {{ csvImportSummary.errors }}</div>
        </div>
      </div>

      <!-- Import Supervisors -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Import Supervisors (CSV)</h2>
          <label class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            <i class="pi pi-upload mr-2"></i> Import CSV
            <input type="file" accept=".csv" class="hidden" @change="onImportSupervisorsCsv" />
          </label>
        </div>
        <div class="text-sm text-gray-600 space-y-2">
          <div class="font-medium">CSV header (comma-separated):</div>
          <code class="block bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto">fullname,email,phonenumber,nationalid</code>
          <div>Passwords are derived automatically as the last 4 digits of the phone number.</div>
        </div>
        <div v-if="supImportSummary" class="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700 mt-4">
          <div class="font-medium mb-1">Import Summary</div>
          <div>Created: {{ supImportSummary.created }}, Updated: {{ supImportSummary.updated }}, Errors: {{ supImportSummary.errors }}</div>
        </div>
      </div>

      <!-- Manage Admins & Districts -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Manage Admins & Districts</h2>
        </div>
        <form @submit.prevent="createAdmin" class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <input v-model="newAdmin.fullName" placeholder="Full name" class="px-3 py-2 border rounded" />
          <input v-model="newAdmin.email" placeholder="Email" class="px-3 py-2 border rounded" />
          <input v-model="newAdmin.password" type="password" placeholder="Password" class="px-3 py-2 border rounded" />
          <select v-model="newAdmin.role" class="px-3 py-2 border rounded">
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <select v-model.number="newAdmin.assignedDistrictId" class="px-3 py-2 border rounded">
            <option :value="undefined">No District</option>
            <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
          <div class="md:col-span-5">
            <button @click="createAdmin" class="bg-green-600 text-white px-4 py-2 rounded">Create Admin</button>
          </div>
        </form>

        <!-- Reset Admin Password -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <input v-model="resetForm.email" placeholder="Admin email (or leave blank to use ID)" class="px-3 py-2 border rounded" />
          <input v-model.number="resetForm.id" type="number" placeholder="Admin ID (optional)" class="px-3 py-2 border rounded" />
          <input v-model="resetForm.newPassword" type="password" placeholder="New password" class="px-3 py-2 border rounded" />
          <div class="md:col-span-2 flex items-center">
            <button @click="resetAdminPassword" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Reset Admin Password</button>
          </div>
        </div>

        <div class="flex items-center space-x-2 mb-4">
          <input v-model="newDistrict" placeholder="New district name" class="px-3 py-2 border rounded" />
          <button @click="addDistrict" class="bg-blue-600 text-white px-4 py-2 rounded">Add District</button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Email</th>
                <th class="px-4 py-2 text-left">Role</th>
                <th class="px-4 py-2 text-left">District</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id" class="border-b">
                <td class="px-4 py-2">{{ a.fullName }}</td>
                <td class="px-4 py-2">{{ a.email }}</td>
                <td class="px-4 py-2">{{ a.role }}</td>
                <td class="px-4 py-2">
                  <select :value="a.assignedDistrictId || undefined" @change="onAssignDistrict(a.id, $event.target.value)" class="px-2 py-1 border rounded">
                    <option :value="undefined">No District</option>
                    <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
                  </select>
                </td>
                <td class="px-4 py-2 text-right">
                  <button @click="deleteAdmin(a.id)" class="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Exports -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Exports</h2>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="downloadAllCsv" class="bg-indigo-600 text-white px-4 py-2 rounded"><i class="pi pi-download mr-2"/>Download All Assessments (CSV)</button>
          <button @click="downloadAllPdfs" class="bg-indigo-600 text-white px-4 py-2 rounded"><i class="pi pi-download mr-2"/>Download All PDFs (ZIP)</button>
        </div>
      </div>

      <!-- Manage Supervisors -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Manage Supervisors</h2>
          <button @click="loadSupervisors" class="bg-gray-700 text-white px-3 py-1.5 rounded">Refresh</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Email</th>
                <th class="px-4 py-2 text-left">National ID</th>
                <th class="px-4 py-2 text-left">Phone</th>
                <th class="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in supervisors" :key="s.id" class="border-b">
                <td class="px-4 py-2">{{ s.fullName }}</td>
                <td class="px-4 py-2">{{ s.email }}</td>
                <td class="px-4 py-2">{{ s.nationalId }}</td>
                <td class="px-4 py-2">
                  <input v-model="s.phoneNumber" class="px-2 py-1 border rounded w-48" />
                </td>
                <td class="px-4 py-2 text-right space-x-2">
                  <button @click="saveSupervisorPhone(s)" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                  <button @click="testSupervisorLogin(s)" class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Test Login</button>
                </td>
              </tr>
            </tbody>
          </table>
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
const supImportSummary = ref(null)

const admins = ref([])
const districts = ref([])
const supervisors = ref([])
const newDistrict = ref('')
const newAdmin = ref({ fullName: '', email: '', password: '', role: 'admin', assignedDistrictId: undefined })
const resetForm = ref({ id: undefined, email: '', newPassword: '' })

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

const loadDistrictsAdmins = async () => {
  try {
    const [d, a] = await Promise.all([
      $fetch('/api/districts'),
      $fetch('/api/admins'),
    ])
    districts.value = d.districts || []
    admins.value = a.admins || []
  } catch (e) {
    // ignore
  }
}

const loadSupervisors = async () => {
  try {
    const res = await $fetch('/api/supervisors')
    supervisors.value = res.supervisors || []
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

const onImportSupervisorsCsv = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const form = new FormData()
    form.append('file', file)
    const result = await $fetch('/api/supervisors/import-csv', { method: 'POST', body: form })
    supImportSummary.value = result
    alert(`Supervisors import complete. Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors}`)
  } catch (err) {
    alert('Import failed. Please verify the CSV and try again.')
  } finally {
    e.target.value = ''
  }
}

const createAdmin = async (evt) => {
  if (evt && evt.preventDefault) evt.preventDefault()
  try {
    const payload = { ...newAdmin.value }
    const res = await $fetch('/api/admins', { method: 'POST', body: payload })
    alert('Admin created')
    newAdmin.value = { fullName: '', email: '', password: '', role: 'admin', assignedDistrictId: undefined }
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to create admin')
  }
}

const addDistrict = async () => {
  if (!newDistrict.value.trim()) return
  try {
    await $fetch('/api/districts', { method: 'POST', body: { name: newDistrict.value.trim() } })
    newDistrict.value = ''
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to add district')
  }
}

const onAssignDistrict = async (adminId, value) => {
  try {
    const districtId = value ? parseInt(String(value)) : undefined
    if (!districtId) return
    await $fetch('/api/admins/assign-district', { method: 'POST', body: { adminId, districtId } })
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to assign district')
  }
}

const deleteAdmin = async (id) => {
  if (!confirm('Delete this admin?')) return
  try {
    await $fetch(`/api/admins/${id}`, { method: 'DELETE' })
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to delete admin')
  }
}

const resetAdminPassword = async (evt) => {
  if (evt && evt.preventDefault) evt.preventDefault()
  try {
    if (!resetForm.value.newPassword.trim()) {
      alert('Enter a new password')
      return
    }
    const payload = { newPassword: resetForm.value.newPassword }
    if (resetForm.value.email && resetForm.value.email.trim()) payload.email = resetForm.value.email.trim().toLowerCase()
    if (!payload.email && resetForm.value.id) payload.id = resetForm.value.id
    if (!payload.email && !payload.id) {
      alert('Provide email or ID to reset')
      return
    }
    await $fetch('/api/admins/reset-password', { method: 'POST', body: payload })
    alert('Password reset successful')
    resetForm.value = { id: undefined, email: '', newPassword: '' }
  } catch (e) {
    alert('Failed to reset password')
  }
}

const saveSupervisorPhone = async (s) => {
  try {
    await $fetch(`/api/supervisors/${s.id}`, { method: 'PUT', body: { phoneNumber: s.phoneNumber } })
    alert('Phone updated')
  } catch (e) {
    alert('Failed to update phone')
  }
}

const testSupervisorLogin = async (s) => {
  try {
    const last4 = (s.phoneNumber || '').replace(/\D/g, '').slice(-4)
    if (!last4) {
      alert('Supervisor phone must have at least 4 digits')
      return
    }
    // Perform a test login request without navigating; this will set cookies in dev
    await $fetch('/api/auth/supervisor-login', { method: 'POST', body: { nationalId: s.nationalId, pin: last4 } })
    alert('Test login successful')
  } catch (e) {
    alert('Test login failed')
  }
}

const downloadAllCsv = async () => {
  try {
    const response = await $fetch('/api/assessments/export-csv', { method: 'GET', responseType: 'blob' })
    const blob = new Blob([response], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessments-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert('Failed to download CSV')
  }
}

const downloadAllPdfs = async () => {
  try {
    const response = await $fetch('/api/assessments/export-pdf-all', { method: 'GET', responseType: 'blob' })
    const blob = new Blob([response], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessments-${new Date().toISOString().split('T')[0]}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert('Failed to download PDFs')
  }
}

onMounted(() => { loadStats(); loadDistrictsAdmins(); loadSupervisors() })
</script>

