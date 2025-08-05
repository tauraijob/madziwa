<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <i class="pi pi-graduation-cap text-white text-4xl"></i>
          </div>
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Madziwa College
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              TP Assessment Platform
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering educators through comprehensive Teaching Practice assessment and evaluation. 
            Streamline your assessment process with our modern, user-friendly platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/assessment/new"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
          
          <!-- Additional Management Links -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <NuxtLink 
              to="/students/new"
              class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg"
            >
              <i class="pi pi-user-plus mr-2"></i>
              Add Student
            </NuxtLink>
            <NuxtLink 
              to="/supervisors/new"
              class="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-200 shadow-lg"
            >
              <i class="pi pi-user-plus mr-2"></i>
              Add Supervisor
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
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file-text text-blue-600 text-2xl"></i>
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

    <!-- Assessment Categories -->
    <div class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Assessment Categories
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive scoring system evaluates teaching practice across multiple dimensions.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-book text-blue-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Preparation & Scheming</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Lesson preparation and scheme of work</p>
            <div class="text-2xl font-bold text-blue-600">20 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-calendar text-green-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Lesson Planning</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Detailed lesson planning and objectives</p>
            <div class="text-2xl font-bold text-green-600">20 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-users text-purple-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Environment & Management</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Classroom environment and management</p>
            <div class="text-2xl font-bold text-purple-600">10 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-file text-orange-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Learning Documents</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Work-related learning documents</p>
            <div class="text-2xl font-bold text-orange-600">10 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-play text-red-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Lesson Introduction</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Lesson introduction and engagement</p>
            <div class="text-2xl font-bold text-red-600">3 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-cog text-indigo-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Lesson Development</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Main lesson development and delivery</p>
            <div class="text-2xl font-bold text-indigo-600">30 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-stop text-pink-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Lesson Conclusion</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Lesson conclusion and summary</p>
            <div class="text-2xl font-bold text-pink-600">3 pts</div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-user text-teal-600"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Personal Dimensions</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">Personal and professional attributes</p>
            <div class="text-2xl font-bold text-teal-600">4 pts</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">
          Ready to Start Assessing?
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join Madziwa College in revolutionizing teaching practice assessment with our comprehensive platform.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/assessment/new"
            class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg"
          >
            <i class="pi pi-plus mr-2"></i>
            Create Assessment
          </NuxtLink>
          <NuxtLink 
            to="/assessments"
            class="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
          >
            <i class="pi pi-list mr-2"></i>
            View Assessments
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