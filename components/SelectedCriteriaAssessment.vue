<template>
  <div v-if="selectedCriteria.length > 0" class="bg-white rounded-xl shadow-sm border p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Selected Assessment Criteria</h2>
    
    <!-- Materials Development Criteria -->
    <div v-if="assessmentType === 'materials'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Content Quality -->
        <div v-if="selectedCriteria.includes('content')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Content Quality (25 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content Mark</label>
              <input
                v-model.number="form.contentMark"
                type="number"
                min="0"
                max="25"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content Comment</label>
              <textarea
                v-model="form.contentComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on content quality..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Pedagogical Soundness -->
        <div v-if="selectedCriteria.includes('pedagogical')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Pedagogical Soundness (25 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pedagogical Mark</label>
              <input
                v-model.number="form.pedagogicalMark"
                type="number"
                min="0"
                max="25"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pedagogical Comment</label>
              <textarea
                v-model="form.pedagogicalComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on pedagogical soundness..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Design & Layout -->
        <div v-if="selectedCriteria.includes('design')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Design & Layout (20 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Design Mark</label>
              <input
                v-model.number="form.designMark"
                type="number"
                min="0"
                max="20"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Design Comment</label>
              <textarea
                v-model="form.designComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on design and layout..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Innovation & Creativity -->
        <div v-if="selectedCriteria.includes('innovation')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Innovation & Creativity (15 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Innovation Mark</label>
              <input
                v-model.number="form.innovationMark"
                type="number"
                min="0"
                max="15"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Innovation Comment</label>
              <textarea
                v-model="form.innovationComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on innovation and creativity..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Educational Value -->
        <div v-if="selectedCriteria.includes('education')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Educational Value (15 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Educational Mark</label>
              <input
                v-model.number="form.educationMark"
                type="number"
                min="0"
                max="15"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Educational Comment</label>
              <textarea
                v-model="form.educationComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on educational value..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Other Assessment Types (ECD, Secondary, ISEN) -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Preparation -->
        <div v-if="selectedCriteria.includes('preparation')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Preparation (10 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preparation Mark</label>
              <input
                v-model.number="form.preparationMark"
                type="number"
                min="0"
                max="10"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preparation Comment</label>
              <textarea
                v-model="form.preparationComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on preparation..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Lesson Planning -->
        <div v-if="selectedCriteria.includes('lessonPlanning')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Lesson Planning (15 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lesson Planning Mark</label>
              <input
                v-model.number="form.lessonPlanningMark"
                type="number"
                min="0"
                max="15"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lesson Planning Comment</label>
              <textarea
                v-model="form.lessonPlanningComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on lesson planning..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Introduction -->
        <div v-if="selectedCriteria.includes('introduction')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Introduction (5 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Introduction Mark</label>
              <input
                v-model.number="form.introductionMark"
                type="number"
                min="0"
                max="5"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Introduction Comment</label>
              <textarea
                v-model="form.introductionComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on introduction..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Development -->
        <div v-if="selectedCriteria.includes('development')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Development (15 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Development Mark</label>
              <input
                v-model.number="form.developmentMark"
                type="number"
                min="0"
                max="15"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Development Comment</label>
              <textarea
                v-model="form.developmentComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on development..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Conclusion -->
        <div v-if="selectedCriteria.includes('conclusion')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Conclusion (5 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Conclusion Mark</label>
              <input
                v-model.number="form.conclusionMark"
                type="number"
                min="0"
                max="5"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Conclusion Comment</label>
              <textarea
                v-model="form.conclusionComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on conclusion..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Personal -->
        <div v-if="selectedCriteria.includes('personal')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Personal (5 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Personal Mark</label>
              <input
                v-model.number="form.personalMark"
                type="number"
                min="0"
                max="5"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Personal Comment</label>
              <textarea
                v-model="form.personalComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on personal aspects..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Records Management -->
        <div v-if="selectedCriteria.includes('records')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Records Management (15 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Records Mark</label>
              <input
                v-model.number="form.recordsMark"
                type="number"
                min="0"
                max="15"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Records Comment</label>
              <textarea
                v-model="form.recordsComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on records management..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Environment -->
        <div v-if="selectedCriteria.includes('environment')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Environment (10 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Environment Mark</label>
              <input
                v-model.number="form.environmentMark"
                type="number"
                min="0"
                max="10"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Environment Comment</label>
              <textarea
                v-model="form.environmentComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on environment..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Community -->
        <div v-if="selectedCriteria.includes('community')" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800">Community (20 marks)</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Community Mark</label>
              <input
                v-model.number="form.communityMark"
                type="number"
                min="0"
                max="20"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Community Comment</label>
              <textarea
                v-model="form.communityComment"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comment on community involvement..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assessmentType: {
    type: String,
    required: true
  },
  selectedCriteria: {
    type: Array,
    default: () => []
  },
  form: {
    type: Object,
    required: true
  }
})
</script>
