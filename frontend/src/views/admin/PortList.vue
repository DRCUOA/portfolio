<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Manage Ports</h1>
          <router-link to="/admin" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Dashboard</router-link>
        </div>
        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-md dark:shadow-xl transition-colors">
            <button
              @click="viewMode = 'by-type'"
              :class="viewMode === 'by-type' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'"
              class="p-2 rounded transition-colors"
              title="View by Server Type"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              @click="viewMode = 'by-project'"
              :class="viewMode === 'by-project' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'"
              class="p-2 rounded transition-colors"
              title="View by Project"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
          </div>
          <router-link
            to="/admin/ports/new"
            class="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            + New Port
          </router-link>
        </div>
      </div>

      <div v-if="store.loading" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-400">Loading ports...</p>
      </div>

      <div v-else-if="store.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 transition-colors">
        <p>Error: {{ store.error }}</p>
      </div>

      <div v-else>
        <!-- Search Filter -->
        <div class="mb-6">
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-4 transition-colors">
            <div class="flex items-center gap-4">
              <div class="flex-1 relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="viewMode === 'by-project' ? 'Search by project name, port number...' : 'Search by port number, name, description...'"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
                />
              </div>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Project Grouped View -->
        <div v-if="viewMode === 'by-project'" class="space-y-6">
          <div v-if="filteredProjects.length === 0" class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-12 text-center transition-colors">
            <p class="text-gray-500 dark:text-slate-400 text-lg transition-colors">
              {{ searchQuery ? 'No projects match your search' : 'No projects configured' }}
            </p>
          </div>
          <div v-for="project in filteredProjects" :key="project.name" class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl overflow-hidden transition-colors">
            <div class="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100 transition-colors">{{ project.name }}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400 transition-colors">
                  <span>Total Clicks: <strong class="text-gray-900 dark:text-slate-200">{{ project.totalClicks }}</strong></span>
                  <span>Data Transfer: <strong class="text-gray-900 dark:text-slate-200">{{ project.totalDataTransferMB.toFixed(2) }} MB</strong></span>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Frontend Port -->
                <div v-if="project.frontend" class="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        FRONTEND
                      </span>
                      <span class="text-lg font-bold text-gray-900 dark:text-slate-200 transition-colors">Port {{ project.frontend.portNumber }}</span>
                    </div>
                    <span :class="project.frontend.inUse ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="text-sm font-medium">
                      {{ project.frontend.inUse ? (project.frontend.pid ? `Active (PID: ${project.frontend.pid})` : 'In Use') : 'Available' }}
                    </span>
                  </div>
                  <div class="space-y-2 text-sm text-gray-600 dark:text-slate-400 transition-colors">
                    <div v-if="project.frontendStats">
                      <span>Clicks: <strong class="text-gray-900 dark:text-slate-200">{{ project.frontendStats.totalClicks }}</strong></span>
                    </div>
                    <div v-if="project.frontendStats">
                      <span>Data: <strong class="text-gray-900 dark:text-slate-200">{{ project.frontendStats.totalDataTransferMB.toFixed(2) }} MB</strong></span>
                    </div>
                    <div class="flex gap-2 mt-4">
                      <router-link
                        :to="`/admin/ports/${project.frontend.id}/edit`"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm transition-colors"
                      >
                        Edit
                      </router-link>
                      <button
                        @click="handleDelete(project.frontend.id)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm transition-colors"
                        :disabled="deleting === project.frontend.id"
                      >
                        {{ deleting === project.frontend.id ? 'Deleting...' : 'Delete' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Backend Port -->
                <div v-if="project.backend" class="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        BACKEND
                      </span>
                      <span class="text-lg font-bold text-gray-900 dark:text-slate-200 transition-colors">Port {{ project.backend.portNumber }}</span>
                    </div>
                    <span :class="project.backend.inUse ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="text-sm font-medium">
                      {{ project.backend.inUse ? (project.backend.pid ? `Active (PID: ${project.backend.pid})` : 'In Use') : 'Available' }}
                    </span>
                  </div>
                  <div class="space-y-2 text-sm text-gray-600 dark:text-slate-400 transition-colors">
                    <div v-if="project.backendStats">
                      <span>Clicks: <strong class="text-gray-900 dark:text-slate-200">{{ project.backendStats.totalClicks }}</strong></span>
                    </div>
                    <div v-if="project.backendStats">
                      <span>Data: <strong class="text-gray-900 dark:text-slate-200">{{ project.backendStats.totalDataTransferMB.toFixed(2) }} MB</strong></span>
                    </div>
                    <div class="flex gap-2 mt-4">
                      <router-link
                        :to="`/admin/ports/${project.backend.id}/edit`"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm transition-colors"
                      >
                        Edit
                      </router-link>
                      <button
                        @click="handleDelete(project.backend.id)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm transition-colors"
                        :disabled="deleting === project.backend.id"
                      >
                        {{ deleting === project.backend.id ? 'Deleting...' : 'Delete' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Original View by Server Type -->
        <div v-else class="space-y-8">
          <!-- Frontend Ports -->
          <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4 transition-colors">Frontend Servers</h2>
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl overflow-hidden transition-colors">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead class="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Port</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">AVAILABILITY TO ALLOCATE</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                <tr v-for="port in filteredFrontendPorts" :key="port.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-200 transition-colors">{{ port.portNumber }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-200 transition-colors">{{ port.name || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-slate-400 transition-colors">{{ port.description || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors">
                    <span :class="port.inUse ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="font-medium">
                      {{ port.inUse ? (port.pid ? `Active (PID: ${port.pid})` : 'In Use') : 'Available' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link
                      :to="`/admin/ports/${port.id}/edit`"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="handleDelete(port.id)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      :disabled="deleting === port.id"
                    >
                      {{ deleting === port.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredFrontendPorts.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-slate-400 transition-colors">
                    {{ searchQuery ? 'No frontend ports match your search' : 'No frontend ports configured' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Backend/API Ports -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4 transition-colors">Backend/API Servers</h2>
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl overflow-hidden transition-colors">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead class="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Port</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">AVAILABILITY TO ALLOCATE</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                <tr v-for="port in filteredBackendPorts" :key="port.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-200 transition-colors">{{ port.portNumber }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-200 transition-colors">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="port.serverType === 'api' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'">
                      {{ port.serverType.toUpperCase() }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-200 transition-colors">{{ port.name || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-slate-400 transition-colors">{{ port.description || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors">
                    <span :class="port.inUse ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="font-medium">
                      {{ port.inUse ? (port.pid ? `Active (PID: ${port.pid})` : 'In Use') : 'Available' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link
                      :to="`/admin/ports/${port.id}/edit`"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="handleDelete(port.id)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      :disabled="deleting === port.id"
                    >
                      {{ deleting === port.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredBackendPorts.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-slate-400 transition-colors">
                    {{ searchQuery ? 'No backend/API ports match your search' : 'No backend/API ports configured' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore, type TrafficStats } from '../../stores/portfolio'

const router = useRouter()
const store = usePortfolioStore()
const deleting = ref<string | null>(null)
const viewMode = ref<'by-type' | 'by-project'>('by-type')
const trafficStats = ref<TrafficStats[]>([])
const loadingStats = ref(false)
const searchQuery = ref('')

const frontendPorts = computed(() => store.ports.filter(p => p.serverType === 'frontend'))
const backendPorts = computed(() => store.ports.filter(p => p.serverType === 'backend' || p.serverType === 'api'))

// Filter function for ports
function matchesSearch(port: any, query: string): boolean {
  if (!query) return true
  const lowerQuery = query.toLowerCase()
  return (
    port.portNumber.toString().includes(lowerQuery) ||
    (port.name || '').toLowerCase().includes(lowerQuery) ||
    (port.description || '').toLowerCase().includes(lowerQuery) ||
    port.id.toLowerCase().includes(lowerQuery)
  )
}

// Filtered ports for by-type view
const filteredFrontendPorts = computed(() => {
  if (!searchQuery.value) return frontendPorts.value
  return frontendPorts.value.filter(port => matchesSearch(port, searchQuery.value))
})

const filteredBackendPorts = computed(() => {
  if (!searchQuery.value) return backendPorts.value
  return backendPorts.value.filter(port => matchesSearch(port, searchQuery.value))
})

// Filter function for projects
function projectMatchesSearch(project: any, query: string): boolean {
  if (!query) return true
  const lowerQuery = query.toLowerCase()
  return (
    project.name.toLowerCase().includes(lowerQuery) ||
    (project.frontend && matchesSearch(project.frontend, query)) ||
    (project.backend && matchesSearch(project.backend, query))
  )
}

// Filtered projects for by-project view
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projectsGrouped.value
  return projectsGrouped.value.filter(project => projectMatchesSearch(project, searchQuery.value))
})

// Extract project name from port name (e.g., "portfolio Frontend" -> "portfolio")
function extractProjectName(portName: string): string {
  return portName.replace(/\s+(Frontend|Backend|API)$/i, '').trim()
}

// Group ports by project
const projectsGrouped = computed(() => {
  const projectMap = new Map<string, {
    name: string
    frontend: any
    backend: any
    frontendStats: TrafficStats | null
    backendStats: TrafficStats | null
    totalClicks: number
    totalDataTransferMB: number
  }>()

  store.ports.forEach(port => {
    const projectName = extractProjectName(port.name || port.id)
    
    if (!projectMap.has(projectName)) {
      projectMap.set(projectName, {
        name: projectName,
        frontend: null,
        backend: null,
        frontendStats: null,
        backendStats: null,
        totalClicks: 0,
        totalDataTransferMB: 0,
      })
    }

    const project = projectMap.get(projectName)!
    
    if (port.serverType === 'frontend') {
      project.frontend = port
      const stats = trafficStats.value.find(s => s.portId === port.id)
      if (stats) {
        project.frontendStats = stats
        project.totalClicks += stats.totalClicks
        project.totalDataTransferMB += stats.totalDataTransferMB
      }
    } else if (port.serverType === 'backend' || port.serverType === 'api') {
      project.backend = port
      const stats = trafficStats.value.find(s => s.portId === port.id)
      if (stats) {
        project.backendStats = stats
        project.totalClicks += stats.totalClicks
        project.totalDataTransferMB += stats.totalDataTransferMB
      }
    }
  })

  return Array.from(projectMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

async function loadTrafficStats() {
  if (viewMode.value === 'by-project' && store.ports.length > 0) {
    loadingStats.value = true
    try {
      const stats = await store.fetchTrafficStats() as TrafficStats[]
      trafficStats.value = Array.isArray(stats) ? stats : []
    } catch (error) {
      console.error('Error loading traffic stats:', error)
      trafficStats.value = []
    } finally {
      loadingStats.value = false
    }
  }
}

watch(viewMode, () => {
  if (viewMode.value === 'by-project') {
    loadTrafficStats()
  }
})

onMounted(async () => {
  await store.fetchPorts()
  if (viewMode.value === 'by-project') {
    await loadTrafficStats()
  }
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this port?')) {
    return
  }

  deleting.value = id
  try {
    await store.deletePort(id)
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to delete port')
  } finally {
    deleting.value = null
  }
}
</script>

