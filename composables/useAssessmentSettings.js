import { ref, computed, readonly } from 'vue'

// Default settings (100-point system)
const defaultSettings = {
  preparationMax: 20,
  lessonPlanningMax: 20,
  environmentMax: 10,
  documentsMax: 10,
  introductionMax: 3,
  developmentMax: 30,
  conclusionMax: 3,
  personalDimensionsMax: 4
}

export const useAssessmentSettings = () => {
  const settings = ref({ ...defaultSettings })

  // Load settings from localStorage
  const loadSettings = () => {
    if (process.client) {
      const savedSettings = localStorage.getItem('assessmentSettings')
      if (savedSettings) {
        try {
          settings.value = { ...defaultSettings, ...JSON.parse(savedSettings) }
        } catch (error) {
          console.error('Error loading settings:', error)
        }
      }
    }
  }

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    if (process.client) {
      localStorage.setItem('assessmentSettings', JSON.stringify(newSettings))
      settings.value = newSettings
    }
  }

  // Calculate total points
  const totalPoints = computed(() => {
    return (
      settings.value.preparationMax +
      settings.value.lessonPlanningMax +
      settings.value.environmentMax +
      settings.value.documentsMax +
      settings.value.introductionMax +
      settings.value.developmentMax +
      settings.value.conclusionMax +
      settings.value.personalDimensionsMax
    )
  })

  // Get max points for a specific category
  const getMaxPoints = (category) => {
    return settings.value[category] || 0
  }

  // Reset to default settings
  const resetToDefault = () => {
    settings.value = { ...defaultSettings }
    if (process.client) {
      localStorage.removeItem('assessmentSettings')
    }
  }

  return {
    settings: readonly(settings),
    loadSettings,
    saveSettings,
    totalPoints,
    getMaxPoints,
    resetToDefault,
    defaultSettings
  }
} 