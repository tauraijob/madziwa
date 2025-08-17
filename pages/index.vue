<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <i class="pi pi-graduation-cap text-white text-4xl"></i>
          </div>
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Madziwa College
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600">
              WIL Assessment Platform
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering educators through comprehensive WIL Practice assessment and evaluation. 
            Streamline your assessment process with our modern, user-friendly platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/assessment"
              class="bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <i class="pi pi-plus mr-2"></i>
              Create New Assessment
            </NuxtLink>
            <NuxtLink 
              to="/admin"
              class="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <i class="pi pi-cog mr-2"></i>
              Admin Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Assessment Features
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to conduct thorough and professional teaching practice assessments.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file-text text-primary-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">100-Point Scoring System</h3>
            <p class="text-gray-600">
              Comprehensive evaluation across 8 key categories including preparation, lesson planning, presentation, and personal dimensions.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-download text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">PDF Export</h3>
            <p class="text-gray-600">
              Generate professional PDF reports for individual assessments or batch download multiple reports as ZIP files.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-chart-line text-purple-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
            <p class="text-gray-600">
              Track performance metrics, view statistics, and analyze assessment data with our comprehensive dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-24 bg-gradient-to-r from-primary-600 to-emerald-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">
          Ready to Start Assessing?
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join Madziwa College in revolutionizing teaching practice assessment with our comprehensive platform.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/assessment"
            class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg"
          >
            <i class="pi pi-plus mr-2"></i>
            Create Assessment
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Home - Madziwa College TP Assessment Platform'
})
</script> 