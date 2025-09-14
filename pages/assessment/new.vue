<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Create New Assessment</h1>
        <p class="mt-2 text-gray-600">Supervisor registers, searches student, then completes assessment.</p>
      </div>

      <form @submit.prevent="submitAssessment" class="space-y-8">
        <!-- Offline Import -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Offline Import</h2>
          <div class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <a
              href="/api/assessments/template"
              class="inline-flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <i class="pi pi-file mr-2"></i> Download Excel Template
            </a>
            <label class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <i class="pi pi-upload mr-2"></i> Upload Completed Excel (supervisors only)
              <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onSupervisorImport" />
            </label>
          </div>
        </div>
        <!-- Assessment Type -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Assessment Type</h2>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span class="block text-sm font-medium text-gray-700">Form</span>
              <span
                class="inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-medium"
                :class="assessmentType==='junior' ? 'bg-primary-100 text-primary-800' : 'bg-rose-100 text-rose-800'"
              >
                {{ assessmentType==='junior' ? 'Junior Supervision' : 'Early Childhood Development' }}
              </span>
            </div>
            <div class="text-sm text-gray-600 md:max-w-2xl">
              <div v-if="assessmentType==='junior'">
                Follows Education 5.0: Research-Teaching & Learning, Records Management, Environment, Community Engagement.
              </div>
              <div v-else>
                Includes ECD-specific records and environment checks per Education 5.0.
              </div>
            </div>
          </div>
        </div>

        <!-- Supervisor Registration -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Supervisor Registration</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input v-model="supervisor.fullName" type="text" placeholder="start by surname" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input v-model="supervisor.nationalId" type="text" placeholder="e.g. 63-123433322X18" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="supervisor.phoneNumber" type="tel" placeholder="e.g.+263 777 000 000"class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="supervisor.email" type="email" placeholder="e.g.supervisor@gmail.com" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        </div>

        <!-- Student Search -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Find Student</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search by SRN</label>
              <input v-model="studentSearch.srn" type="text" placeholder="e.g.23/002/2024" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Or Surname</label>
              <input v-model="studentSearch.surname" type="text" placeholder="Surname" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-1">
              <button type="button" @click="searchStudents" :disabled="searching" class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                <i v-if="searching" class="pi pi-spinner pi-spin mr-2"></i>
                Search
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="studentsResults.length" class="mt-4 border rounded-lg divide-y">
            <div v-for="s in studentsResults" :key="s.id" class="p-3 flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">{{ s.fullName }} <span class="text-gray-500">({{ s.candidateNo }})</span></div>
                <div class="text-sm text-gray-600">{{ s.schoolName }} • {{ s.className }} • {{ s.email }}</div>
              </div>
              <button type="button" @click="selectStudent(s)" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">Select</button>
            </div>
          </div>

          <!-- Or enter student details manually -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">Student Details</h3>
              <span v-if="selectedStudentId" class="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">Selected from search</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input v-model="student.fullName" type="text" placeholder="start by surname" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select v-model="student.sex" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Candidate number (SRN)</label>
                <input v-model="student.candidateNo" type="text" placeholder="23/002/24" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="student.email" type="email" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">School name</label>
                <input v-model="student.schoolName" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input v-model="student.className" type="text" placeholder="Grade 4Blue" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </div>
        </div>

        <!-- Assessment Details -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Assessment Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                v-model="form.subject"
                type="text"
                required
                placeholder="e.g., Mathematics"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                v-model="form.topic"
                type="text"
                required
                placeholder="e.g., Addition and Subtraction"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Assessment Date</label>
              <input
                v-model="form.assessmentDate"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
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
                <span class="text-blue-600 font-bold text-sm">{{ settings.preparationMax }} pts</span>
              </div>

              <!-- Lesson Planning -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-calendar text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-green-900 text-sm">Lesson Planning</h4>
                <p class="text-xs text-green-700 mb-1">Detailed lesson planning and objectives</p>
                <span class="text-green-600 font-bold text-sm">{{ settings.lessonPlanningMax }} pts</span>
              </div>

              <!-- Environment & Management -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-users text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-purple-900 text-sm">Environment & Management</h4>
                <p class="text-xs text-purple-700 mb-1">Classroom environment and management</p>
                <span class="text-purple-600 font-bold text-sm">{{ settings.environmentMax }} pts</span>
              </div>

              <!-- Learning Documents -->
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-folder text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-orange-900 text-sm">Learning Documents</h4>
                <p class="text-xs text-orange-700 mb-1">Work-related learning documents</p>
                <span class="text-orange-600 font-bold text-sm">{{ settings.documentsMax }} pts</span>
              </div>

              <!-- Lesson Introduction -->
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-play text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-red-900 text-sm">Lesson Introduction</h4>
                <p class="text-xs text-red-700 mb-1">Lesson introduction and engagement</p>
                <span class="text-red-600 font-bold text-sm">{{ settings.introductionMax }} pts</span>
              </div>

              <!-- Lesson Development -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-cog text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-blue-900 text-sm">Lesson Development</h4>
                <p class="text-xs text-blue-700 mb-1">Main lesson development and delivery</p>
                <span class="text-blue-600 font-bold text-sm">{{ settings.developmentMax }} pts</span>
              </div>

              <!-- Lesson Conclusion -->
              <div class="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-stop text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-pink-900 text-sm">Lesson Conclusion</h4>
                <p class="text-xs text-pink-700 mb-1">Lesson conclusion and summary</p>
                <span class="text-pink-600 font-bold text-sm">{{ settings.conclusionMax }} pts</span>
              </div>

              <!-- Personal Dimensions -->
              <div class="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                <div class="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i class="pi pi-user text-white text-xl"></i>
                </div>
                <h4 class="font-medium text-teal-900 text-sm">Personal Dimensions</h4>
                <p class="text-xs text-teal-700 mb-1">Personal and professional attributes</p>
                <span class="text-teal-600 font-bold text-sm">{{ settings.personalDimensionsMax }} pts</span>
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
                1. Preparation & Scheming ({{ settings.preparationMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.preparationMax }})</label>
                  <input 
                    v-model.number="form.preparationMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.preparationMax"
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
                2. Lesson Planning ({{ settings.lessonPlanningMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.lessonPlanningMax }})</label>
                  <input 
                    v-model.number="form.lessonPlanningMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.lessonPlanningMax"
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
                3. Environment & Management ({{ settings.environmentMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.environmentMax }})</label>
                  <input 
                    v-model.number="form.environmentMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.environmentMax"
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
                4. Learning Documents ({{ settings.documentsMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.documentsMax }})</label>
                  <input 
                    v-model.number="form.documentsMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.documentsMax"
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
                5. Lesson Introduction ({{ settings.introductionMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.introductionMax }})</label>
                  <input 
                    v-model.number="form.introductionMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.introductionMax"
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
                6. Lesson Development ({{ settings.developmentMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.developmentMax }})</label>
                  <input 
                    v-model.number="form.developmentMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.developmentMax"
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
                7. Lesson Conclusion ({{ settings.conclusionMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.conclusionMax }})</label>
                  <input 
                    v-model.number="form.conclusionMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.conclusionMax"
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
                8. Personal Dimensions ({{ settings.personalDimensionsMax }} marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-{{ settings.personalDimensionsMax }})</label>
                  <input 
                    v-model.number="form.personalDimensionsMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    :max="settings.personalDimensionsMax"
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

            <!-- Community Engagement (Education 5.0) -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-users text-white text-sm"></i>
                </div>
                9. Community Engagement (Education 5.0) (20 marks)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mark (0-20)</label>
                  <input 
                    v-model.number="form.communityMark" 
                    type="number" 
                    step="1" 
                    min="0" 
                    max="20"
                    @input="clampField('communityMark', 20)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Observations</label>
                  <textarea 
                    v-model="form.communityComment" 
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Community engagement & provision of goods and services (CDP)"
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
        <div class="flex justify-end">
          <button type="submit" :disabled="loading" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ loading ? 'Submitting...' : 'Submit Assessment' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as XLSX from 'xlsx'

definePageMeta({ title: 'Create New Assessment', middleware: 'supervisor-auth' })

const loading = ref(false)
const searching = ref(false)

// Supervisor model (registration)
const supervisor = ref({ fullName: '', nationalId: '', phoneNumber: '', email: '' })

// Student search and model
const studentSearch = ref({ srn: '', surname: '' })
const studentsResults = ref([])
const selectedStudentId = ref(null)
const student = ref({ fullName: '', sex: '', candidateNo: '', email: '', schoolName: '', className: '' })

// Settings
const { settings, loadSettings } = useAssessmentSettings()

// Selected assessment type (from query). Default to junior
const assessmentType = ref('junior')

// Assessment fields (scores/comments)
const form = ref({
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
  communityMark: 0,
  communityComment: '',
  overallComment: ''
})

// Clamp helpers to enforce max marks strictly
const clamp = (value, min, max) => {
  const num = Number(value)
  if (Number.isNaN(num)) return min
  if (num < min) return min
  if (num > max) return max
  return Math.round(num)
}

const clampField = (field, max) => {
  form.value[field] = clamp(form.value[field], 0, max)
}

// Deep watch: clamp any time a mark changes (covers paste, wheel, programmatic)
watch(form, () => {
  clampField('preparationMark', settings.value.preparationMax)
  clampField('lessonPlanningMark', settings.value.lessonPlanningMax)
  clampField('environmentMark', settings.value.environmentMax)
  clampField('documentsMark', settings.value.documentsMax)
  clampField('introductionMark', settings.value.introductionMax)
  clampField('developmentMark', settings.value.developmentMax)
  clampField('conclusionMark', settings.value.conclusionMax)
  clampField('personalDimensionsMark', settings.value.personalDimensionsMax)
  clampField('communityMark', 20)
}, { deep: true })

const totalScore = computed(() => (
  form.value.preparationMark +
  form.value.lessonPlanningMark +
  form.value.environmentMark +
  form.value.documentsMark +
  form.value.introductionMark +
  form.value.developmentMark +
  form.value.conclusionMark +
  form.value.personalDimensionsMark +
  form.value.communityMark
))

const getGrade = (score) => {
  if (score >= 80) return '1'
  if (score >= 70) return '2.1'
  if (score >= 60) return '2.2'
  if (score >= 50) return '3'
  return 'F'
}

const searchStudents = async () => {
  searching.value = true
  try {
    const params = new URLSearchParams()
    if (studentSearch.value.srn) {
      const srn = String(studentSearch.value.srn).trim()
      // Try exact and normalized contains in backend
      params.set('candidateNo', srn)
    }
    if (studentSearch.value.surname) params.set('surname', studentSearch.value.surname)
    const res = await $fetch(`/api/students/search?${params.toString()}`)
    studentsResults.value = res.students
    // Fallback attempt: strip non-alphanumerics if nothing returned
    if ((!studentsResults.value || !studentsResults.value.length) && studentSearch.value.srn) {
      const fallback = String(studentSearch.value.srn).replace(/[^a-zA-Z0-9]/g, '')
      if (fallback) {
        const res2 = await $fetch(`/api/students/search?candidateNo=${encodeURIComponent(fallback)}`)
        studentsResults.value = res2.students
      }
    }
  } catch (e) {
    console.error('Search failed', e)
    alert('Student search failed')
  } finally {
    searching.value = false
  }
}

const selectStudent = (s) => {
  selectedStudentId.value = s.id
  student.value = { 
    fullName: s.fullName,
    sex: s.sex,
    candidateNo: s.candidateNo,
    email: s.email,
    schoolName: s.schoolName,
    className: s.className
  }
}

const onSupervisorImport = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  loading.value = true
  try {
    const buf = await file.arrayBuffer()
    const workbook = XLSX.read(buf, { type: 'array' })
    const sheetName = workbook.SheetNames.includes('Assessments') ? 'Assessments' : workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
    if (!rows.length) {
      alert('No rows found in sheet')
      return
    }
    const rowRaw = rows[0]
    // Normalize keys to be resilient to slight header variations
    const simplifyKey = (k) => String(k || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const canon = {
      fullname: 'fullName', sex: 'sex', candidateno: 'candidateNo', email: 'email', schoolname: 'schoolName', classname: 'className',
      supervisorfullname: 'supervisorFullName', supervisornationalid: 'supervisorNationalId', supervisorphonenumber: 'supervisorPhoneNumber', supervisoremail: 'supervisorEmail',
      assessmentdate: 'assessmentDate', subject: 'subject', topic: 'topic', formtype: 'formType',
      preparationmark: 'preparationMark', preparationcomment: 'preparationComment',
      lessonplanningmark: 'lessonPlanningMark', lessonplanningcomment: 'lessonPlanningComment',
      environmentmark: 'environmentMark', environmentcomment: 'environmentComment',
      documentsmark: 'documentsMark', documentscomment: 'documentsComment',
      introductionmark: 'introductionMark', introductioncomment: 'introductionComment',
      developmentmark: 'developmentMark', developmentcomment: 'developmentComment',
      conclusionmark: 'conclusionMark', conclusioncomment: 'conclusionComment',
      personaldimensionsmark: 'personalDimensionsMark', personaldimensionscomment: 'personalDimensionsComment',
      communitymark: 'communityMark', communitycomment: 'communityComment',
      overallcomment: 'overallComment',
    }
    const row = {}
    Object.entries(rowRaw).forEach(([k, v]) => {
      const t = canon[simplifyKey(k)]
      row[t || k] = v
    })

    // Prefill assessment type
    const ft = String(row.formType || '').toLowerCase()
    assessmentType.value = (ft === 'ecd' ? 'ecd' : 'junior')

    // Prefill student
    student.value.fullName = String(row.fullName || student.value.fullName)
    student.value.sex = String(row.sex || student.value.sex)
    student.value.candidateNo = String(row.candidateNo || student.value.candidateNo)
    student.value.email = String(row.email || student.value.email)
    student.value.schoolName = String(row.schoolName || student.value.schoolName)
    student.value.className = String(row.className || student.value.className)

    // Prefill supervisor (optional)
    supervisor.value.fullName = String(row.supervisorFullName || supervisor.value.fullName)
    supervisor.value.nationalId = String(row.supervisorNationalId || supervisor.value.nationalId)
    supervisor.value.phoneNumber = String(row.supervisorPhoneNumber || supervisor.value.phoneNumber)
    supervisor.value.email = String(row.supervisorEmail || supervisor.value.email)

    // Prefill assessment details
    form.value.subject = String(row.subject || form.value.subject)
    form.value.topic = String(row.topic || form.value.topic)
    const d = (row.assessmentDate ? new Date(row.assessmentDate) : null)
    if (d && !isNaN(d.getTime())) {
      form.value.assessmentDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    }
    const num = (v) => Number.isNaN(Number(v)) ? undefined : Number(v)
    if (num(row.preparationMark) !== undefined) form.value.preparationMark = num(row.preparationMark)
    if (num(row.lessonPlanningMark) !== undefined) form.value.lessonPlanningMark = num(row.lessonPlanningMark)
    if (num(row.environmentMark) !== undefined) form.value.environmentMark = num(row.environmentMark)
    if (num(row.documentsMark) !== undefined) form.value.documentsMark = num(row.documentsMark)
    if (num(row.introductionMark) !== undefined) form.value.introductionMark = num(row.introductionMark)
    if (num(row.developmentMark) !== undefined) form.value.developmentMark = num(row.developmentMark)
    if (num(row.conclusionMark) !== undefined) form.value.conclusionMark = num(row.conclusionMark)
    if (num(row.personalDimensionsMark) !== undefined) form.value.personalDimensionsMark = num(row.personalDimensionsMark)
    if (num(row.communityMark) !== undefined) form.value.communityMark = num(row.communityMark)
    form.value.overallComment = String(row.overallComment || form.value.overallComment)

    // Prefill all comment fields if present
    const setIf = (field) => { if (row[field] !== undefined && row[field] !== null) form.value[field] = String(row[field]) }
    setIf('preparationComment')
    setIf('lessonPlanningComment')
    setIf('environmentComment')
    setIf('documentsComment')
    setIf('introductionComment')
    setIf('developmentComment')
    setIf('conclusionComment')
    setIf('personalDimensionsComment')
    setIf('communityComment')

    alert('Form prefilled from Excel. Review and submit.')
  } catch (err) {
    console.error('Prefill from Excel failed', err)
    alert('Prefill failed. Please ensure you used the provided template.')
  } finally {
    loading.value = false
    e.target.value = ''
  }
}

const ensureSupervisor = async () => {
  // try find by nationalId or email, otherwise create
  try {
    const existing = await $fetch('/api/supervisors')
    const found = existing.supervisors.find((x) => x.nationalId === supervisor.value.nationalId || x.email === supervisor.value.email)
    if (found) return found.id
    const created = await $fetch('/api/supervisors', { method: 'POST', body: supervisor.value })
    return created.supervisor.id
  } catch (e) {
    console.error('Ensure supervisor failed', e)
    throw e
  }
}

const ensureStudent = async () => {
  // if selected from search, reuse id; else find by candidateNo, else create
  if (selectedStudentId.value) return selectedStudentId.value
  try {
    const res = await $fetch(`/api/students/search?candidateNo=${encodeURIComponent(student.value.candidateNo || '')}`)
    const found = (res.students || [])[0]
    if (found) return found.id
    const created = await $fetch('/api/students', { method: 'POST', body: student.value })
    return created.student.id
  } catch (e) {
    console.error('Ensure student failed', e)
    throw e
  }
}

const submitAssessment = async () => {
  loading.value = true
  try {
    // validate required parts
    if (!supervisor.value.fullName || !supervisor.value.nationalId || !supervisor.value.phoneNumber || !supervisor.value.email) {
      alert('Please complete supervisor registration')
      loading.value = false
      return
    }
    if (!student.value.fullName || !student.value.candidateNo || !student.value.schoolName || !student.value.className || !student.value.sex) {
      alert('Please complete student details')
      loading.value = false
      return
    }
    if (!form.value.subject || !form.value.topic) {
      alert('Please fill in Subject and Topic')
      loading.value = false
      return
    }

    // Final clamp before submit to guarantee marks never exceed maxima
    clampField('preparationMark', settings.value.preparationMax)
    clampField('lessonPlanningMark', settings.value.lessonPlanningMax)
    clampField('environmentMark', settings.value.environmentMax)
    clampField('documentsMark', settings.value.documentsMax)
    clampField('introductionMark', settings.value.introductionMax)
    clampField('developmentMark', settings.value.developmentMax)
    clampField('conclusionMark', settings.value.conclusionMax)
    clampField('personalDimensionsMark', settings.value.personalDimensionsMax)
    clampField('communityMark', 20)

    const supervisorId = await ensureSupervisor()
    const studentId = await ensureStudent()

    await $fetch('/api/assessments', {
      method: 'POST',
      body: { ...form.value, studentId, formType: assessmentType.value }
    })

    alert('Assessment created successfully!')
    await navigateTo('/supervisor')
  } catch (error) {
    console.error('Error creating assessment:', error)
    alert('Failed to create assessment. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSettings()
  const route = useRoute()
  const q = String(route.query.type || '').toLowerCase()
  if (q === 'ecd' || q === 'junior') {
    assessmentType.value = q
  }
})
</script> 