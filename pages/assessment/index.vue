<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900">Choose Assessment Type</h1>
        <p class="text-gray-600 mt-2">Select the appropriate form to continue.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Junior Supervision -->
        <NuxtLink
          to="/assessment/new?type=junior"
          class="group block bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-6"
        >
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mr-3">
              <i class="pi pi-briefcase text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Junior Supervision</h2>
              <p class="text-sm text-gray-600">Education 5.0: Research–Teaching & Learning, Records, Environment, Community Engagement.</p>
            </div>
          </div>
          <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>Preparation (10), Lesson Planning (15), Introduction (5)</li>
            <li>Development (15), Conclusion (5), Personal (5)</li>
            <li>Records Management (15), Environment (10), Community (20)</li>
          </ul>
        </NuxtLink>

        <!-- Early Childhood Development -->
        <NuxtLink
          to="/assessment/new?type=ecd"
          class="group block bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-6"
        >
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center mr-3">
              <i class="pi pi-users text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Early Childhood Development</h2>
              <p class="text-sm text-gray-600">ECD-specific Records & Environment with Education 5.0 emphasis.</p>
            </div>
          </div>
          <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>Preparation (10), Lesson Planning (15), Introduction (5)</li>
            <li>Development (15), Conclusion (5), Personal (5)</li>
            <li>Records Management (15), Environment (10), Community (20)</li>
          </ul>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ title: 'Choose Assessment Type' })
</script>