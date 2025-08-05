<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Create New Assessment</h1>
        <p class="mt-2 text-gray-600">Fill in the assessment details below</p>
      </div>

      <!-- Assessment Form -->
      <form @submit.prevent="submitAssessment" class="space-y-8">
        <!-- Student and Supervisor Selection -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Student & Supervisor Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Student Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select 
                v-model="form.studentId" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a student</option>
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.fullName }} - {{ student.candidateNo }}
                </option>
              </select>
            </div>

            <!-- Supervisor Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
              <select 
                v-model="form.supervisorId" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a supervisor</option>
                <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
                  {{ supervisor.fullName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Assessment Details -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Assessment Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input 
                v-model="form.subject" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mathematics"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <input 
                v-model="form.topic" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Algebra"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
              <input 
                v-model="form.assessmentDate" 
                type="datetime-local" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
        </div>

        <!-- Scoring Categories -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Scoring Categories</h2>
          
          <!-- Assessment Criteria Overview -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Assessment Criteria Overview</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <!-- Preparation & Scheming -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-file text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-blue-900 text-sm">Preparation & Scheming</h4>
                <p class="text-xs text-blue-700 mb-1">Lesson preparation and scheme of work</p>
                <span class="text-blue-600 font-bold text-sm">20 pts</span>
              </div>

              <!-- Lesson Planning -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-calendar text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-green-900 text-sm">Lesson Planning</h4>
                <p class="text-xs text-green-700 mb-1">Detailed lesson planning and objectives</p>
                <span class="text-green-600 font-bold text-sm">20 pts</span>
              </div>

              <!-- Environment & Management -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-users text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-purple-900 text-sm">Environment & Management</h4>
                <p class="text-xs text-purple-700 mb-1">Classroom environment and management</p>
                <span class="text-purple-600 font-bold text-sm">10 pts</span>
              </div>

              <!-- Learning Documents -->
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-folder text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-orange-900 text-sm">Learning Documents</h4>
                <p class="text-xs text-orange-700 mb-1">Work-related learning documents</p>
                <span class="text-orange-600 font-bold text-sm">10 pts</span>
              </div>

              <!-- Lesson Introduction -->
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-play text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-red-900 text-sm">Lesson Introduction</h4>
                <p class="text-xs text-red-700 mb-1">Lesson introduction and engagement</p>
                <span class="text-red-600 font-bold text-sm">3 pts</span>
              </div>

              <!-- Lesson Development -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-cog text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-blue-900 text-sm">Lesson Development</h4>
                <p class="text-xs text-blue-700 mb-1">Main lesson development and delivery</p>
                <span class="text-blue-600 font-bold text-sm">30 pts</span>
              </div>

              <!-- Lesson Conclusion -->
              <div class="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-stop text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-pink-900 text-sm">Lesson Conclusion</h4>
                <p class="text-xs text-pink-700 mb-1">Lesson conclusion and summary</p>
                <span class="text-pink-600 font-bold text-sm">3 pts</span>
              </div>

              <!-- Personal Dimensions -->
              <div class="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-user text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-teal-900 text-sm">Personal Dimensions</h4>
                <p class="text-xs text-teal-700 mb-1">Personal and professional attributes</p>
                <span class="text-teal-600 font-bold text-sm">4 pts</span>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <!-- Preparation & Scheming -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-file text-white text-sm"></i>
                </div>
                1. Preparation & Scheming (20 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-20)</label>
                  <input 
                    v-model.number="form.preparationMark" 
                    type="number" 
                    min="0" 
                    max="20"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.preparationComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Lesson Planning -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-calendar text-white text-sm"></i>
                </div>
                2. Lesson Planning (20 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-20)</label>
                  <input 
                    v-model.number="form.lessonPlanningMark" 
                    type="number" 
                    min="0" 
                    max="20"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.lessonPlanningComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Environment & Management -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-users text-white text-sm"></i>
                </div>
                3. Environment & Management (10 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-10)</label>
                  <input 
                    v-model.number="form.environmentMark" 
                    type="number" 
                    min="0" 
                    max="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.environmentComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Learning Documents -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-folder text-white text-sm"></i>
                </div>
                4. Learning Documents (10 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-10)</label>
                  <input 
                    v-model.number="form.documentsMark" 
                    type="number" 
                    min="0" 
                    max="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.documentsComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Lesson Introduction -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-play text-white text-sm"></i>
                </div>
                5. Lesson Introduction (3 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-3)</label>
                  <input 
                    v-model.number="form.introductionMark" 
                    type="number" 
                    min="0" 
                    max="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.introductionComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Lesson Development -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-cog text-white text-sm"></i>
                </div>
                6. Lesson Development (30 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-30)</label>
                  <input 
                    v-model.number="form.developmentMark" 
                    type="number" 
                    min="0" 
                    max="30"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.developmentComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Lesson Conclusion -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-stop text-white text-sm"></i>
                </div>
                7. Lesson Conclusion (3 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-3)</label>
                  <input 
                    v-model.number="form.conclusionMark" 
                    type="number" 
                    min="0" 
                    max="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.conclusionComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Personal Dimensions -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-user text-white text-sm"></i>
                </div>
                8. Personal Dimensions (4 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-4)</label>
                  <input 
                    v-model.number="form.personalDimensionsMark" 
                    type="number" 
                    min="0" 
                    max="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea 
                    v-model="form.personalDimensionsComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overall Comment -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Overall Comment</h2>
          <textarea 
            v-model="form.overallComment" 
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter overall assessment comment..."
          ></textarea>
        </div>

        <!-- Total Score Display -->
        <div class="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h2 class="text-xl font-semibold text-blue-900 mb-2">Total Score</h2>
          <div class="text-3xl font-bold text-blue-600">{{ totalScore }}/100</div>
          <div class="text-sm text-blue-700 mt-1">Grade: {{ getGrade(totalScore) }}</div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <NuxtLink 
            to="/" 
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Creating...' : 'Create Assessment' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ title: 'Create New Assessment' })

const loading = ref(false)
const students = ref([])
const supervisors = ref([])

const form = ref({
  studentId: '',
  supervisorId: '',
  subject: '',
  topic: '',
  assessmentDate: new Date().toISOString().slice(0, 16),
  preparationMark: 0,
  preparationComment: '',
  lessonPlanningMark: 0,
  lessonPlanningComment: '',
  environmentMark: 0,
  environmentComment: '',
  documentsMark: 0,
  documentsComment: '',
  introductionMark: 0,
  introductionComment: '',
  developmentMark: 0,
  developmentComment: '',
  conclusionMark: 0,
  conclusionComment: '',
  personalDimensionsMark: 0,
  personalDimensionsComment: '',
  overallComment: ''
})

const totalScore = computed(() => {
  return (
    form.value.preparationMark +
    form.value.lessonPlanningMark +
    form.value.environmentMark +
    form.value.documentsMark +
    form.value.introductionMark +
    form.value.developmentMark +
    form.value.conclusionMark +
    form.value.personalDimensionsMark
  )
})

const getGrade = (score) => {
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

const fetchStudents = async () => {
  try {
    const response = await $fetch('/api/students')
    students.value = response.students
  } catch (error) {
    console.error('Error fetching students:', error)
  }
}

const fetchSupervisors = async () => {
  try {
    const response = await $fetch('/api/supervisors')
    supervisors.value = response.supervisors
  } catch (error) {
    console.error('Error fetching supervisors:', error)
  }
}

const submitAssessment = async () => {
  loading.value = true
  
  try {
    const response = await $fetch('/api/assessments', {
      method: 'POST',
      body: form.value
    })
    
    // Show success message
    alert('Assessment created successfully!')
    
    // Redirect to admin dashboard
    await navigateTo('/admin')
  } catch (error) {
    console.error('Error creating assessment:', error)
    alert('Failed to create assessment. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStudents()
  fetchSupervisors()
})
</script> 