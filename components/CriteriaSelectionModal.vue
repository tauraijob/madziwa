<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
      <h2 class="text-2xl font-bold mb-4">Select Criteria for Offline Assessment</h2>
      
      <!-- Assessment Type Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
        <select v-model="selectedAssessmentType" class="w-full p-2 border border-gray-300 rounded-md">
          <option value="materials">Materials Development</option>
          <option value="ecd">ECD & Junior Levels</option>
          <option value="secondary">Secondary Level</option>
          <option value="isen">ISEN (Inclusion & Special Educational Needs)</option>
        </select>
      </div>

      <!-- Materials Development Criteria -->
      <div v-if="selectedAssessmentType === 'materials'" class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Materials Development Criteria</h3>
        
        <!-- Content Quality -->
        <div class="mb-4 p-4 border border-gray-200 rounded-lg">
          <label class="flex items-center mb-3">
            <input type="checkbox" v-model="materialsCriteria.content" @change="toggleContentCategory" class="mr-2">
            <span class="font-semibold text-gray-800">CONTENT QUALITY (25 marks)</span>
          </label>
          <div class="ml-6 space-y-2 text-sm">
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.contentRelevance" @change="updateContentCategory" class="mr-2">
              <span>Relevance to curriculum (10 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.contentOrganization" @change="updateContentCategory" class="mr-2">
              <span>Organization and structure (10 marks)</span>
            </div>
          </div>
        </div>

        <!-- Pedagogical Value -->
        <div class="mb-4 p-4 border border-gray-200 rounded-lg">
          <label class="flex items-center mb-3">
            <input type="checkbox" v-model="materialsCriteria.pedagogical" @change="togglePedagogicalCategory" class="mr-2">
            <span class="font-semibold text-gray-800">PEDAGOGICAL VALUE (25 marks)</span>
          </label>
          <div class="ml-6 space-y-2 text-sm">
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.pedagogicalAlignment" @change="updatePedagogicalCategory" class="mr-2">
              <span>Alignment with teaching methods (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.pedagogicalEngagement" @change="updatePedagogicalCategory" class="mr-2">
              <span>Student engagement (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.pedagogicalConnection" @change="updatePedagogicalCategory" class="mr-2">
              <span>Connection to real-world (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.pedagogicalInclusive" @change="updatePedagogicalCategory" class="mr-2">
              <span>Inclusive design (5 marks)</span>
            </div>
          </div>
        </div>

        <!-- Design and Layout -->
        <div class="mb-4 p-4 border border-gray-200 rounded-lg">
          <label class="flex items-center mb-3">
            <input type="checkbox" v-model="materialsCriteria.design" @change="toggleDesignCategory" class="mr-2">
            <span class="font-semibold text-gray-800">DESIGN AND LAYOUT (20 marks)</span>
          </label>
          <div class="ml-6 space-y-2 text-sm">
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.designVisual" @change="updateDesignCategory" class="mr-2">
              <span>Visual appeal (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.designNavigation" @change="updateDesignCategory" class="mr-2">
              <span>Navigation and usability (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.designQuality" @change="updateDesignCategory" class="mr-2">
              <span>Quality of production (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.designConsistency" @change="updateDesignCategory" class="mr-2">
              <span>Consistency (5 marks)</span>
            </div>
          </div>
        </div>

        <!-- Innovation and Creativity -->
        <div class="mb-4 p-4 border border-gray-200 rounded-lg">
          <label class="flex items-center mb-3">
            <input type="checkbox" v-model="materialsCriteria.innovation" @change="toggleInnovationCategory" class="mr-2">
            <span class="font-semibold text-gray-800">INNOVATION AND CREATIVITY (15 marks)</span>
          </label>
          <div class="ml-6 space-y-2 text-sm">
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.innovationOriginality" @change="updateInnovationCategory" class="mr-2">
              <span>Originality (10 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.innovationTechnology" @change="updateInnovationCategory" class="mr-2">
              <span>Technology integration (10 marks)</span>
            </div>
          </div>
        </div>

        <!-- Education 5.0 Compliance -->
        <div class="mb-4 p-4 border border-gray-200 rounded-lg">
          <label class="flex items-center mb-3">
            <input type="checkbox" v-model="materialsCriteria.education" @change="toggleEducationCategory" class="mr-2">
            <span class="font-semibold text-gray-800">EDUCATION 5.0 COMPLIANCE (15 marks)</span>
          </label>
          <div class="ml-6 space-y-2 text-sm">
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.educationLocal" @change="updateEducationCategory" class="mr-2">
              <span>Local relevance (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.educationHeritage" @change="updateEducationCategory" class="mr-2">
              <span>Heritage preservation (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.educationProblem" @change="updateEducationCategory" class="mr-2">
              <span>Problem-solving focus (5 marks)</span>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="materialsCriteria.educationCommercial" @change="updateEducationCategory" class="mr-2">
              <span>Commercial viability (5 marks)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ECD & Junior Criteria -->
      <div v-if="selectedAssessmentType === 'ecd'" class="mb-6">
        <h3 class="text-lg font-semibold mb-3">ECD & Junior Level Criteria</h3>
        <div class="space-y-2">
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.preparation" class="mr-2">
            Preparation (10 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.lessonPlanning" class="mr-2">
            Lesson Planning (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.introduction" class="mr-2">
            Introduction (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.development" class="mr-2">
            Development (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.conclusion" class="mr-2">
            Conclusion (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.personal" class="mr-2">
            Personal (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.records" class="mr-2">
            Records Management (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.environment" class="mr-2">
            Environment (10 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="ecdCriteria.community" class="mr-2">
            Community (20 marks)
          </label>
        </div>
      </div>

      <!-- Secondary Level Criteria -->
      <div v-if="selectedAssessmentType === 'secondary'" class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Secondary Level Criteria</h3>
        <div class="space-y-2">
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.preparation" class="mr-2">
            Preparation (10 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.lessonPlanning" class="mr-2">
            Lesson Planning (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.introduction" class="mr-2">
            Introduction (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.development" class="mr-2">
            Development (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.conclusion" class="mr-2">
            Conclusion (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.personal" class="mr-2">
            Personal (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.records" class="mr-2">
            Records Management (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.environment" class="mr-2">
            Environment (10 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="secondaryCriteria.community" class="mr-2">
            Community (20 marks)
          </label>
        </div>
      </div>

      <!-- ISEN Criteria -->
      <div v-if="selectedAssessmentType === 'isen'" class="mb-6">
        <h3 class="text-lg font-semibold mb-3">ISEN Criteria</h3>
        <div class="space-y-2">
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.preparation" class="mr-2">
            Preparation (10 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.lessonPlanning" class="mr-2">
            Lesson Planning (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.introduction" class="mr-2">
            Introduction (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.development" class="mr-2">
            Development (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.conclusion" class="mr-2">
            Conclusion (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.personal" class="mr-2">
            Personal (5 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.records" class="mr-2">
            Records Management (15 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.environment" class="mr-2">
            Environment (10 marks)
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="isenCriteria.community" class="mr-2">
            Community (20 marks)
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="downloadTemplate"
          :disabled="!hasSelectedCriteria"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Download Template
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'download'])

const selectedAssessmentType = ref('materials')

// Materials Development criteria
const materialsCriteria = ref({
  content: false,
  contentRelevance: false,
  contentOrganization: false,
  pedagogical: false,
  pedagogicalAlignment: false,
  pedagogicalEngagement: false,
  pedagogicalConnection: false,
  pedagogicalInclusive: false,
  design: false,
  designVisual: false,
  designNavigation: false,
  designQuality: false,
  designConsistency: false,
  innovation: false,
  innovationOriginality: false,
  innovationTechnology: false,
  education: false,
  educationLocal: false,
  educationHeritage: false,
  educationProblem: false,
  educationCommercial: false
})

// ECD & Junior criteria
const ecdCriteria = ref({
  preparation: false,
  lessonPlanning: false,
  introduction: false,
  development: false,
  conclusion: false,
  personal: false,
  records: false,
  environment: false,
  community: false
})

// Secondary criteria
const secondaryCriteria = ref({
  preparation: false,
  lessonPlanning: false,
  introduction: false,
  development: false,
  conclusion: false,
  personal: false,
  records: false,
  environment: false,
  community: false
})

// ISEN criteria
const isenCriteria = ref({
  preparation: false,
  lessonPlanning: false,
  introduction: false,
  development: false,
  conclusion: false,
  personal: false,
  records: false,
  environment: false,
  community: false
})

// Computed property to check if any criteria are selected
const hasSelectedCriteria = computed(() => {
  if (selectedAssessmentType.value === 'materials') {
    return Object.values(materialsCriteria.value).some(Boolean)
  } else if (selectedAssessmentType.value === 'ecd') {
    return Object.values(ecdCriteria.value).some(Boolean)
  } else if (selectedAssessmentType.value === 'secondary') {
    return Object.values(secondaryCriteria.value).some(Boolean)
  } else if (selectedAssessmentType.value === 'isen') {
    return Object.values(isenCriteria.value).some(Boolean)
  }
  return false
})

// Get selected criteria based on assessment type
const getSelectedCriteria = () => {
  if (selectedAssessmentType.value === 'materials') {
    return Object.entries(materialsCriteria.value)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)
  } else if (selectedAssessmentType.value === 'ecd') {
    return Object.entries(ecdCriteria.value)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)
  } else if (selectedAssessmentType.value === 'secondary') {
    return Object.entries(secondaryCriteria.value)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)
  } else if (selectedAssessmentType.value === 'isen') {
    return Object.entries(isenCriteria.value)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)
  }
  return []
}

const downloadTemplate = async () => {
  try {
    const selectedCriteria = getSelectedCriteria()
    
    const response = await $fetch('/api/assessments/offline-template', {
      method: 'POST',
      body: {
        assessmentType: selectedAssessmentType.value,
        selectedCriteria
      }
    })

    // Create download link
    const link = document.createElement('a')
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.data}`
    link.download = response.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Emit download event with data
    emit('download', {
      assessmentType: selectedAssessmentType.value,
      selectedCriteria
    })
  } catch (error) {
    console.error('Error downloading template:', error)
    alert('Failed to download template. Please try again.')
  }
}

// Category toggle methods
const toggleContentCategory = () => {
  if (materialsCriteria.value.content) {
    materialsCriteria.value.contentRelevance = true
    materialsCriteria.value.contentOrganization = true
  } else {
    materialsCriteria.value.contentRelevance = false
    materialsCriteria.value.contentOrganization = false
  }
}

const updateContentCategory = () => {
  materialsCriteria.value.content = materialsCriteria.value.contentRelevance && materialsCriteria.value.contentOrganization
}

const togglePedagogicalCategory = () => {
  if (materialsCriteria.value.pedagogical) {
    materialsCriteria.value.pedagogicalAlignment = true
    materialsCriteria.value.pedagogicalEngagement = true
    materialsCriteria.value.pedagogicalConnection = true
    materialsCriteria.value.pedagogicalInclusive = true
  } else {
    materialsCriteria.value.pedagogicalAlignment = false
    materialsCriteria.value.pedagogicalEngagement = false
    materialsCriteria.value.pedagogicalConnection = false
    materialsCriteria.value.pedagogicalInclusive = false
  }
}

const updatePedagogicalCategory = () => {
  materialsCriteria.value.pedagogical = materialsCriteria.value.pedagogicalAlignment && 
    materialsCriteria.value.pedagogicalEngagement && 
    materialsCriteria.value.pedagogicalConnection && 
    materialsCriteria.value.pedagogicalInclusive
}

const toggleDesignCategory = () => {
  if (materialsCriteria.value.design) {
    materialsCriteria.value.designVisual = true
    materialsCriteria.value.designNavigation = true
    materialsCriteria.value.designQuality = true
    materialsCriteria.value.designConsistency = true
  } else {
    materialsCriteria.value.designVisual = false
    materialsCriteria.value.designNavigation = false
    materialsCriteria.value.designQuality = false
    materialsCriteria.value.designConsistency = false
  }
}

const updateDesignCategory = () => {
  materialsCriteria.value.design = materialsCriteria.value.designVisual && 
    materialsCriteria.value.designNavigation && 
    materialsCriteria.value.designQuality && 
    materialsCriteria.value.designConsistency
}

const toggleInnovationCategory = () => {
  if (materialsCriteria.value.innovation) {
    materialsCriteria.value.innovationOriginality = true
    materialsCriteria.value.innovationTechnology = true
  } else {
    materialsCriteria.value.innovationOriginality = false
    materialsCriteria.value.innovationTechnology = false
  }
}

const updateInnovationCategory = () => {
  materialsCriteria.value.innovation = materialsCriteria.value.innovationOriginality && materialsCriteria.value.innovationTechnology
}

const toggleEducationCategory = () => {
  if (materialsCriteria.value.education) {
    materialsCriteria.value.educationLocal = true
    materialsCriteria.value.educationHeritage = true
    materialsCriteria.value.educationProblem = true
    materialsCriteria.value.educationCommercial = true
  } else {
    materialsCriteria.value.educationLocal = false
    materialsCriteria.value.educationHeritage = false
    materialsCriteria.value.educationProblem = false
    materialsCriteria.value.educationCommercial = false
  }
}

const updateEducationCategory = () => {
  materialsCriteria.value.education = materialsCriteria.value.educationLocal && 
    materialsCriteria.value.educationHeritage && 
    materialsCriteria.value.educationProblem && 
    materialsCriteria.value.educationCommercial
}

// Reset criteria when assessment type changes
watch(selectedAssessmentType, () => {
  materialsCriteria.value = {
    content: false,
    contentRelevance: false,
    contentOrganization: false,
    pedagogical: false,
    pedagogicalAlignment: false,
    pedagogicalEngagement: false,
    pedagogicalConnection: false,
    pedagogicalInclusive: false,
    design: false,
    designVisual: false,
    designNavigation: false,
    designQuality: false,
    designConsistency: false,
    innovation: false,
    innovationOriginality: false,
    innovationTechnology: false,
    education: false,
    educationLocal: false,
    educationHeritage: false,
    educationProblem: false,
    educationCommercial: false
  }
  ecdCriteria.value = {
    preparation: false,
    lessonPlanning: false,
    introduction: false,
    development: false,
    conclusion: false,
    personal: false,
    records: false,
    environment: false,
    community: false
  }
  secondaryCriteria.value = {
    preparation: false,
    lessonPlanning: false,
    introduction: false,
    development: false,
    conclusion: false,
    personal: false,
    records: false,
    environment: false,
    community: false
  }
  isenCriteria.value = {
    preparation: false,
    lessonPlanning: false,
    introduction: false,
    development: false,
    conclusion: false,
    personal: false,
    records: false,
    environment: false,
    community: false
  }
})
</script>
