<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Work Integrated Learning Assessment Instrument</h1>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">MADZIWA TEACHERS COLLEGE</h2>
          <h3 class="text-lg font-medium text-gray-700 mb-6">CENTRE FOR TEACHER EDUCATION AND MATERIALS DEVELOPMENT</h3>
          <div class="text-base text-gray-600">
            <div v-if="assessmentType === 'ecd'">DE: EXTERNAL EXAMINING INSTRUMENT: ECD & JUNIOR LEVELS</div>
            <div v-else-if="assessmentType === 'secondary'">DIPLOMA IN EDUCATION<br>EXTERNAL EXAMINING INSTRUMENT: SECONDARY LEVEL</div>
            <div v-else-if="assessmentType === 'isen'">FACULTY OF EDUCATION<br>CENTRE FOR TEACHER EDUCATION AND MATERIALS DEVELOPMENT<br>DIPLOMA IN EDUCATION<br>WORK INTEGRATED EXAMINING FORM<br>INCLUSION AND SPECIAL EDUCATIONAL NEEDS (ISEN)</div>
            <div v-else-if="assessmentType === 'materials'">MATERIALS DEVELOPMENT ASSESSMENT INSTRUMENT</div>
          </div>
        </div>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              @click="assessmentType = 'ecd'"
              class="p-4 border-2 rounded-lg cursor-pointer transition-colors"
              :class="assessmentType === 'ecd' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <h3 class="font-semibold text-gray-900 mb-2">ECD & Junior Levels</h3>
              <p class="text-sm text-gray-600">Early Childhood Development and Junior Level assessment</p>
            </div>
            <div 
              @click="assessmentType = 'secondary'"
              class="p-4 border-2 rounded-lg cursor-pointer transition-colors"
              :class="assessmentType === 'secondary' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <h3 class="font-semibold text-gray-900 mb-2">Secondary Level</h3>
              <p class="text-sm text-gray-600">Secondary level teaching assessment</p>
            </div>
            <div 
              @click="assessmentType = 'isen'"
              class="p-4 border-2 rounded-lg cursor-pointer transition-colors"
              :class="assessmentType === 'isen' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <h3 class="font-semibold text-gray-900 mb-2">ISEN</h3>
              <p class="text-sm text-gray-600">Inclusion and Special Educational Needs</p>
            </div>
            <div 
              @click="assessmentType = 'materials'"
              class="p-4 border-2 rounded-lg cursor-pointer transition-colors"
              :class="assessmentType === 'materials' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <h3 class="font-semibold text-gray-900 mb-2">Materials Development</h3>
              <p class="text-sm text-gray-600">Educational materials and resources assessment</p>
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

        <!-- Education 5.0 Pillar Assessment -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Education 5.0 Pillar Assessment</h2>
          
          <!-- ECD & Junior Level Form -->
          <div v-if="assessmentType === 'ecd'" class="space-y-6">
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Research-Teaching & Learning -->
                  <tr>
                    <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">Research-Teaching & Learning</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Preparation</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Portfolio of evidence</li>
                        <li>• Scheming</li>
                        <li>• Lesson planning</li>
                        <li>• Evaluation</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Lesson Facilitation</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Introduction</li>
                        <li>• Questioning techniques and distribution</li>
                        <li>• Sequencing of learning</li>
                        <li>• Knowledge of content</li>
                        <li>• Appropriate media use</li>
                        <li>• Evidence of research</li>
                        <li>• Assessment and feedback</li>
                        <li>• Lesson conclusion</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.lessonFacilitationComment" rows="4" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.lessonFacilitationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Deportment</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Dress code</li>
                        <li>• Voice projection</li>
                        <li>• Language use</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.deportmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">5%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Records management</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Register</li>
                        <li>• Progress Record</li>
                        <li>• Individual Social Record, Remedial,</li>
                        <li>• Extension work</li>
                        <li>• Reading</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.recordsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.recordsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Teaching and learning environment</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <ul class="text-sm text-gray-600">
                        <li>• Classroom layout and conduciveness</li>
                        <li>• Management of learning centres</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.environmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.environmentMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">10%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Community Service/ Research & Innovation/Research & Industrialisation</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="text-sm text-gray-600">[Tick Applicable]</div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">30%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Remaining 2 pillars</td>
                    <td class="border border-gray-300 px-4 py-2"></td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">10%</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Secondary Level Form -->
        <div v-if="assessmentType === 'secondary'" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Secondary Level Assessment</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="3" class="border border-gray-300 px-4 py-2 align-top font-medium">Research-Teaching & Learning</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">PREPARATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Portfolio of evidence</li>
                      <li>• Scheming</li>
                      <li>• Lesson planning</li>
                      <li>• Evaluation</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">RECORDS MANAGEMENT</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Register</li>
                      <li>• Progress Record</li>
                      <li>• Individual Social Record, Remedial,</li>
                      <li>• Extension work</li>
                      <li>• Reading</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.recordsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.recordsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">LESSON FACILITATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Introduction</li>
                      <li>• Questioning techniques and distribution</li>
                      <li>• Sequencing of learning</li>
                      <li>• Knowledge of content</li>
                      <li>• Appropriate media use</li>
                      <li>• Evidence of research</li>
                      <li>• Assessment and feedback</li>
                      <li>• Lesson conclusion</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.lessonFacilitationComment" rows="4" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.lessonFacilitationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Deportment</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="text-sm text-gray-600">
                      <li>• Dress code</li>
                      <li>• Voice projection</li>
                      <li>• Language use</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.deportmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Community Service/ Research & Innovation/Research & Industrialisation</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="text-sm text-gray-600">[Tick Applicable]</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">30%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Remaining 2 pillars</td>
                  <td class="border border-gray-300 px-4 py-2"></td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="20" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">20%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ISEN Form -->
        <div v-if="assessmentType === 'isen'" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">ISEN Assessment</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="3" class="border border-gray-300 px-4 py-2 align-top font-medium">Research-Teaching & Learning</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">PREPARATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Portfolio of evidence</li>
                      <li>• Scheming</li>
                      <li>• Lesson planning</li>
                      <li>• Evaluation</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">RECORDS MANAGEMENT</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Register</li>
                      <li>• Progress Record</li>
                      <li>• Individual Social Record, Remedial,</li>
                      <li>• Extension work</li>
                      <li>• Reading</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.recordsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.recordsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">LESSON FACILITATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Introduction</li>
                      <li>• Questioning techniques and distribution</li>
                      <li>• Sequencing of learning</li>
                      <li>• Knowledge of content</li>
                      <li>• Appropriate media use</li>
                      <li>• Evidence of research</li>
                      <li>• Assessment and feedback</li>
                      <li>• Lesson conclusion</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.lessonFacilitationComment" rows="4" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.lessonFacilitationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">DEPORTMENT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="text-sm text-gray-600">
                      <li>• Dress code</li>
                      <li>• Voice projection</li>
                      <li>• Language use</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.deportmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">LEARNING ENVIRONMENT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="text-sm text-gray-600">
                      <li>• Classroom layout and conduciveness</li>
                      <li>• Management of learning centres</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.environmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.environmentMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Community engagement</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="text-sm text-gray-600">[Tick Applicable]</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">30%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Remaining 2 pillars</td>
                  <td class="border border-gray-300 px-4 py-2"></td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Materials Development Form -->
        <div v-if="assessmentType === 'materials'" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Materials Development Assessment</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="2" class="border border-gray-300 px-4 py-2 align-top font-medium">CONTENT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Relevance to curriculum</div>
                    <div class="text-sm text-gray-600">Alignment with curriculum objectives and learning outcomes</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.contentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.contentRelevanceMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Organization and structure</div>
                    <div class="text-sm text-gray-600">Logical flow and clear organization of content</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.contentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.contentOrganizationMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">PEDAGOGICAL VALUE</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Alignment with teaching methods</div>
                    <div class="text-sm text-gray-600">Compatibility with effective teaching strategies</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalAlignmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Student engagement</div>
                    <div class="text-sm text-gray-600">Potential to engage and motivate students</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalEngagementMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Connection to real-world</div>
                    <div class="text-sm text-gray-600">Relevance to practical applications</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalConnectionMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Inclusive design</div>
                    <div class="text-sm text-gray-600">Accessibility and inclusivity considerations</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalInclusiveMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">DESIGN AND LAYOUT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Visual appeal</div>
                    <div class="text-sm text-gray-600">Aesthetic quality and visual design</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designVisualMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Navigation and usability</div>
                    <div class="text-sm text-gray-600">Ease of use and navigation</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designNavigationMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Quality of production</div>
                    <div class="text-sm text-gray-600">Technical quality and finish</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designQualityMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Consistency</div>
                    <div class="text-sm text-gray-600">Consistent design elements and branding</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designConsistencyMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="2" class="border border-gray-300 px-4 py-2 align-top font-medium">INNOVATION AND CREATIVITY</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Originality</div>
                    <div class="text-sm text-gray-600">Uniqueness and creative approach</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.innovationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.innovationOriginalityMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Technology integration</div>
                    <div class="text-sm text-gray-600">Effective use of technology</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.innovationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.innovationTechnologyMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">EDUCATION 5.0 COMPLIANCE</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Local relevance</div>
                    <div class="text-sm text-gray-600">Alignment with local context and needs</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationLocalMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Heritage preservation</div>
                    <div class="text-sm text-gray-600">Cultural heritage integration</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationHeritageMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Problem-solving focus</div>
                    <div class="text-sm text-gray-600">Addressing real-world problems</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationProblemMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Commercial viability</div>
                    <div class="text-sm text-gray-600">Potential for commercialization</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationCommercialMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Media Bag Warning -->
          <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center">
              <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
              <span class="font-medium text-yellow-800">Media Bag Warning</span>
            </div>
            <p class="text-sm text-yellow-700 mt-1">
              Ensure all materials are properly packaged and labeled for distribution. Check for completeness and quality before final submission.
            </p>
          </div>
        </div>

        <!-- General Comment -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">General Comment</h2>
          <textarea 
            v-model="form.overallComment" 
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your general comment..."
          ></textarea>
        </div>

        <!-- Signature Section -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Examiner Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
              <input 
                v-model="form.examinerName" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter examiner name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                v-model="form.examinerDate" 
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
          
          <!-- ISEN Overall Mark -->
          <div v-if="assessmentType === 'isen'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Overall Mark</label>
            <input 
              v-model.number="form.overallMark" 
              type="number" 
              min="0" 
              max="100"
              class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Overall mark"
            >
          </div>

          <!-- Materials Development specific fields -->
          <div v-if="assessmentType === 'materials'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor Designation</label>
              <input 
                v-model="form.supervisorDesignation" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter supervisor designation"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Total Percentage</label>
              <input 
                v-model.number="form.materialsTotalPercentage" 
                type="number" 
                min="0" 
                max="100"
                class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="%"
              >
            </div>
          </div>

          <!-- Digital Signature Drawing Area -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Digital Signature</label>
            <div class="border-2 border-gray-300 rounded-lg p-4">
              <canvas 
                ref="signatureCanvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
                class="w-full h-32 border border-gray-200 rounded cursor-crosshair bg-white"
                style="touch-action: none;"
              ></canvas>
              <div class="flex justify-between items-center mt-2">
                <button 
                  type="button"
                  @click="clearSignature"
                  class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                >
                  Clear Signature
                </button>
                <span class="text-xs text-gray-500">Draw your signature above</span>
              </div>
            </div>
          </div>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import * as XLSX from 'xlsx'

definePageMeta({ title: 'Create New Assessment', middleware: 'supervisor-auth' })

const loading = ref(false)
const searching = ref(false)

// Signature drawing functionality
const signatureCanvas = ref(null)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

// Supervisor model (registration)
const supervisor = ref({ fullName: '', nationalId: '', phoneNumber: '', email: '' })

// Student search and model
const studentSearch = ref({ srn: '', surname: '' })
const studentsResults = ref([])
const selectedStudentId = ref(null)
const student = ref({ fullName: '', sex: '', candidateNo: '', email: '', schoolName: '', className: '' })

// Settings
const { settings, loadSettings } = useAssessmentSettings()

// Selected assessment type (from query). Default to ecd
const assessmentType = ref('ecd')

// Assessment fields (scores/comments)
const form = ref({
  subject: '',
  topic: '',
  assessmentDate: new Date().toISOString().slice(0, 16),
  assessmentTime: '',
  // ECD & Junior Level fields
  preparationMark: 0,
  preparationComment: '',
  lessonFacilitationMark: 0,
  lessonFacilitationComment: '',
  deportmentMark: 0,
  deportmentComment: '',
  recordsMark: 0,
  recordsComment: '',
  environmentMark: 0,
  environmentComment: '',
  communityMark: 0,
  communityComment: '',
  remainingPillarsMark: 0,
  remainingPillarsComment: '',
  // Materials Development fields
  contentRelevanceMark: 0,
  contentOrganizationMark: 0,
  contentTotalMark: 0,
  contentComment: '',
  pedagogicalAlignmentMark: 0,
  pedagogicalEngagementMark: 0,
  pedagogicalConnectionMark: 0,
  pedagogicalInclusiveMark: 0,
  pedagogicalTotalMark: 0,
  pedagogicalComment: '',
  designVisualMark: 0,
  designNavigationMark: 0,
  designQualityMark: 0,
  designConsistencyMark: 0,
  designTotalMark: 0,
  designComment: '',
  innovationOriginalityMark: 0,
  innovationTechnologyMark: 0,
  innovationTotalMark: 0,
  innovationComment: '',
  educationLocalMark: 0,
  educationHeritageMark: 0,
  educationProblemMark: 0,
  educationCommercialMark: 0,
  educationTotalMark: 0,
  educationComment: '',
  materialsTotalMark: 0,
  // Signature fields
  examinerName: '',
  examinerDate: new Date().toISOString().slice(0, 10),
  overallMark: 0,
  supervisorDesignation: '',
  materialsTotalPercentage: 0,
  signatureData: '',
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
  if (assessmentType.value === 'materials') {
    // Materials Development specific clamping
    clampField('contentRelevanceMark', 10)
    clampField('contentOrganizationMark', 10)
    clampField('contentTotalMark', 20)
    clampField('pedagogicalAlignmentMark', 5)
    clampField('pedagogicalEngagementMark', 5)
    clampField('pedagogicalConnectionMark', 5)
    clampField('pedagogicalInclusiveMark', 5)
    clampField('pedagogicalTotalMark', 20)
    clampField('designVisualMark', 5)
    clampField('designNavigationMark', 5)
    clampField('designQualityMark', 5)
    clampField('designConsistencyMark', 5)
    clampField('designTotalMark', 20)
    clampField('innovationOriginalityMark', 10)
    clampField('innovationTechnologyMark', 10)
    clampField('innovationTotalMark', 20)
    clampField('educationLocalMark', 5)
    clampField('educationHeritageMark', 5)
    clampField('educationProblemMark', 5)
    clampField('educationCommercialMark', 5)
    clampField('educationTotalMark', 20)
    clampField('materialsTotalMark', 100)
  } else {
    // ECD, Secondary, ISEN specific clamping
    clampField('preparationMark', 15)
    clampField('lessonFacilitationMark', 15)
    clampField('deportmentMark', 5)
    clampField('recordsMark', 15)
    clampField('environmentMark', 10)
    clampField('communityMark', 30)
    clampField('remainingPillarsMark', 10)
  }
}, { deep: true })

const totalScore = computed(() => {
  if (assessmentType.value === 'ecd') {
    return form.value.preparationMark +
           form.value.lessonFacilitationMark +
           form.value.deportmentMark +
           form.value.recordsMark +
           form.value.environmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'secondary') {
    return form.value.preparationMark +
           form.value.recordsMark +
           form.value.lessonFacilitationMark +
           form.value.deportmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'isen') {
    return form.value.preparationMark +
           form.value.recordsMark +
           form.value.lessonFacilitationMark +
           form.value.deportmentMark +
           form.value.environmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'materials') {
    return form.value.contentTotalMark +
           form.value.pedagogicalTotalMark +
           form.value.designTotalMark +
           form.value.innovationTotalMark +
           form.value.educationTotalMark
  }
  return 0
})

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
    if (assessmentType.value === 'materials') {
      // Materials Development specific clamping
      clampField('contentRelevanceMark', 10)
      clampField('contentOrganizationMark', 10)
      clampField('contentTotalMark', 20)
      clampField('pedagogicalAlignmentMark', 5)
      clampField('pedagogicalEngagementMark', 5)
      clampField('pedagogicalConnectionMark', 5)
      clampField('pedagogicalInclusiveMark', 5)
      clampField('pedagogicalTotalMark', 20)
      clampField('designVisualMark', 5)
      clampField('designNavigationMark', 5)
      clampField('designQualityMark', 5)
      clampField('designConsistencyMark', 5)
      clampField('designTotalMark', 20)
      clampField('innovationOriginalityMark', 10)
      clampField('innovationTechnologyMark', 10)
      clampField('innovationTotalMark', 20)
      clampField('educationLocalMark', 5)
      clampField('educationHeritageMark', 5)
      clampField('educationProblemMark', 5)
      clampField('educationCommercialMark', 5)
      clampField('educationTotalMark', 20)
      clampField('materialsTotalMark', 100)
    } else {
      // ECD, Secondary, ISEN specific clamping
      clampField('preparationMark', 15)
      clampField('lessonFacilitationMark', 15)
      clampField('deportmentMark', 5)
      clampField('recordsMark', 15)
      clampField('environmentMark', 10)
      clampField('communityMark', 30)
      clampField('remainingPillarsMark', 10)
    }

    const supervisorId = await ensureSupervisor()
    const studentId = await ensureStudent()

    // Get signature data
    const signatureData = getSignatureData()

    await $fetch('/api/assessments', {
      method: 'POST',
      body: { 
        ...form.value, 
        studentId, 
        formType: assessmentType.value,
        signatureData: signatureData
      }
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

// Signature drawing methods
const startDrawing = (e) => {
  isDrawing.value = true
  const canvas = signatureCanvas.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
  
  lastX.value = (clientX - rect.left) * scaleX
  lastY.value = (clientY - rect.top) * scaleY
}

const draw = (e) => {
  if (!isDrawing.value) return
  
  const canvas = signatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
  
  const currentX = (clientX - rect.left) * scaleX
  const currentY = (clientY - rect.top) * scaleY
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(currentX, currentY)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.stroke()
  
  lastX.value = currentX
  lastY.value = currentY
}

const stopDrawing = () => {
  isDrawing.value = false
}

const clearSignature = () => {
  const canvas = signatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const getSignatureData = () => {
  const canvas = signatureCanvas.value
  if (!canvas) return null
  
  return canvas.toDataURL('image/png')
}

onMounted(() => {
  loadSettings()
  const route = useRoute()
  const q = String(route.query.type || '').toLowerCase()
  if (q === 'ecd' || q === 'secondary' || q === 'isen' || q === 'materials') {
    assessmentType.value = q
  }
  
  // Initialize signature canvas
  nextTick(() => {
    const canvas = signatureCanvas.value
    if (canvas) {
      const ctx = canvas.getContext('2d')
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  })
})
</script> 