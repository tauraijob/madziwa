<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Assessment Settings</h1>
            <p class="text-gray-600 mt-2">Configure point values for assessment categories</p>
          </div>
          <NuxtLink
            to="/admin"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="pi pi-arrow-left mr-2"></i>
            Back to Admin
          </NuxtLink>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <form @submit.prevent="handleSaveSettings" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preparation & Scheming -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Preparation & Scheming
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.preparationMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="20"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Planning -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Planning
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.lessonPlanningMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="20"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Environment & Management -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Environment & Management
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.environmentMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Learning Documents -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Learning Documents
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.documentsMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Introduction -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Introduction
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.introductionMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Development -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Development
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.developmentMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Conclusion -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Conclusion
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.conclusionMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Personal Dimensions -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Personal Dimensions
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="settings.personalDimensionsMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>
          </div>

          <!-- Total Points Display -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-blue-900">Total Points:</span>
              <span class="text-2xl font-bold text-blue-600">{{ totalPoints }} pts</span>
            </div>
            <div v-if="totalPoints !== 100" class="mt-2 text-sm text-blue-700">
              <i class="pi pi-info-circle mr-1"></i>
              {{ totalPoints > 100 ? 'Total exceeds 100 points' : 'Total is less than 100 points' }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="handleResetToDefault"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset to Default
            </button>
            <button
              type="submit"
              :disabled="loading || totalPoints !== 100"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loading" class="pi pi-spinner pi-spin mr-2"></i>
              <i v-else class="pi pi-save mr-2"></i>
              {{ loading ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'admin-auth'
})

const loading = ref(false)



const { settings, loadSettings, saveSettings, totalPoints, resetToDefault } = useAssessmentSettings()

// Load settings from localStorage or use defaults
onMounted(() => {
  loadSettings()
})



// Save settings
const handleSaveSettings = async () => {
  if (totalPoints.value !== 100) {
    alert('Total points must equal 100')
    return
  }

  loading.value = true
  try {
    saveSettings(settings.value)
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Error saving settings')
  } finally {
    loading.value = false
  }
}

// Reset to default values
const handleResetToDefault = () => {
  if (confirm('Are you sure you want to reset to default values?')) {
    resetToDefault()
  }
}
</script> 