<template>
  <div class="relative min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div class="mb-6 sm:mb-8 fade-in-up">
        <router-link 
          to="/admin/ports" 
          class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-4 inline-flex items-center gap-2"
        >
          <span>←</span> Back to Ports
        </router-link>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl md:text-5xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">
          {{ isEdit ? 'Edit Port' : 'Create New Port' }}
        </h1>
      </div>

      <div v-if="store.loading && !isEdit" class="text-center py-12 glass-card rounded-3xl p-8">
        <p class="text-white/80 dark:text-slate-400">Loading...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
              Port Number <span class="text-red-400 dark:text-red-400">*</span>
            </label>
            <input
              v-model.number="form.portNumber"
              type="number"
              required
              min="1"
              max="65535"
              class="w-full px-4 py-3 text-sm sm:text-base rounded-xl glass-input transition-colors font-mono"
              placeholder="e.g., 5173"
              @input="updatePortOptions"
            />
            <p class="mt-1 text-xs sm:text-sm text-white/70 dark:text-slate-400 transition-colors">Port number between 1 and 65535</p>
          </div>

          <div v-if="form.portNumber && form.portNumber >= 1 && form.portNumber <= 65535 && portOptions.length > 0">
            <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
              Select from nearby ports:
            </label>
            <div class="relative">
              <div
                class="w-full px-4 py-3 text-sm sm:text-base rounded-xl glass-input cursor-pointer transition-colors"
                @click="showDropdown = !showDropdown"
                tabindex="0"
                @blur="setTimeout(() => showDropdown = false, 200)"
              >
                <div class="flex items-center justify-between">
                  <span class="text-white dark:text-slate-100 truncate font-mono">{{ form.portNumber }}</span>
                  <svg class="w-5 h-5 text-white/60 dark:text-slate-400 transition-transform flex-shrink-0 ml-2" :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div
                v-if="showDropdown"
                class="absolute z-10 w-full mt-1 glass-strong rounded-xl shadow-lg max-h-60 overflow-auto"
              >
                <button
                  v-for="option in portOptions"
                  :key="option.port"
                  type="button"
                  @click="selectPort(option.port)"
                  @mousedown.prevent
                  :disabled="!option.available"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors rounded-lg',
                    option.available
                      ? 'text-green-200 dark:text-green-400 hover:bg-white/10 dark:hover:bg-slate-700/50 cursor-pointer'
                      : 'text-red-300 dark:text-red-400 opacity-60 cursor-not-allowed',
                    option.port === form.portNumber ? 'font-semibold bg-white/10 dark:bg-slate-700/50' : ''
                  ]"
                >
                  <span class="font-mono">{{ option.port }}</span> {{ option.available ? '(Available)' : `(${option.reason})` }}
                </button>
              </div>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-white/70 dark:text-slate-400 transition-colors">
              <span class="text-green-300 dark:text-green-400">●</span> Available
              <span class="ml-3 text-red-300 dark:text-red-400">●</span> Unavailable
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
              Server Type <span class="text-red-400 dark:text-red-400">*</span>
            </label>
            <select
              v-model="form.serverType"
              required
              class="w-full px-4 py-3 text-sm sm:text-base rounded-xl glass-input transition-colors"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="api">API</option>
            </select>
            <p class="mt-1 text-xs sm:text-sm text-white/70 dark:text-slate-400 transition-colors">Server type</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
              Project ID <span class="text-red-400 dark:text-red-400">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.name"
                required
                class="w-full px-4 py-3 text-sm sm:text-base rounded-xl glass-input transition-colors"
              >
                <option value="">Select a project...</option>
                <option
                  v-for="project in availableProjects"
                  :key="project.id"
                  :value="project.id"
                >
                  {{ project.name }} ({{ project.id }})
                </option>
              </select>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-white/70 dark:text-slate-400 transition-colors">Project</p>
            <p v-if="form.name && selectedProject" class="mt-1 text-xs text-blue-300 dark:text-blue-400 transition-colors">
              Status: <span :class="{
                'text-green-300 dark:text-green-400': selectedProject.status === 'live',
                'text-yellow-300 dark:text-yellow-400': selectedProject.status === 'prototype',
                'text-white/60 dark:text-gray-400': selectedProject.status === 'archived'
              }">{{ selectedProject.status }}</span>
            </p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-4 py-3 text-sm sm:text-base rounded-xl glass-input transition-colors resize-y"
            placeholder="Optional description or notes about this port"
          />
        </div>

        <div v-if="error" class="mb-6 glass-strong rounded-xl border-red-400/30 text-red-200 dark:text-red-300 px-4 py-3 text-sm sm:text-base transition-colors">
          <p>{{ error }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-white/10 dark:border-slate-700/50">
          <button
            type="submit"
            :disabled="store.loading"
            class="w-full sm:w-auto btn-glass px-6 py-3 text-sm sm:text-base rounded-xl font-semibold disabled:opacity-50 transition-all"
          >
            {{ store.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
          <router-link
            to="/admin/ports"
            class="w-full sm:w-auto btn-glass px-6 py-3 text-sm sm:text-base rounded-xl font-semibold text-center transition-all"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore, type CreatePortInput, type UpdatePortInput } from '../../stores/portfolio'

const route = useRoute()
const router = useRouter()
const store = usePortfolioStore()

const isEdit = route.name === 'edit-port'
const portId = route.params.id as string

const form = ref<Omit<CreatePortInput, 'id'>>({
  portNumber: 3000,
  serverType: 'frontend',
  name: '',
  description: '',
})

const error = ref<string | null>(null)
const showDropdown = ref(false)
const projects = ref<any[]>([])

interface PortOption {
  port: number
  available: boolean
  reason: string
}

const portOptions = ref<PortOption[]>([])

const availableProjects = computed(() => {
  return projects.value.sort((a, b) => a.name.localeCompare(b.name))
})

const selectedProject = computed(() => {
  if (!form.value.name) return null
  return projects.value.find(p => p.id === form.value.name)
})

// Generate port ID from project ID and server type
function generatePortId(): string {
  if (form.value.name && form.value.serverType) {
    return `${form.value.name}-${form.value.serverType}`
  }
  return ''
}

function selectPort(port: number) {
  form.value.portNumber = port
  showDropdown.value = false
  updatePortOptions()
}

async function updatePortOptions() {
  if (!form.value.portNumber || form.value.portNumber < 1 || form.value.portNumber > 65535) {
    portOptions.value = []
    return
  }

  // CRITICAL: Always refresh ports from server to get latest state
  await store.fetchPorts()

  const basePort = form.value.portNumber
  const ports = [
    basePort - 2,
    basePort - 1,
    basePort,
    basePort + 1,
    basePort + 2,
  ].filter(p => p >= 1 && p <= 65535)

  // Check availability for each port using authoritative API
  portOptions.value = await Promise.all(ports.map(async (port) => {
    // Check if this project already has a port allocated for this server type
    const projectId = form.value.name
    const serverType = form.value.serverType
    let projectAlreadyHasPort = false
    
    if (projectId && serverType) {
      const projectPorts = store.ports.filter(p => {
        if (!p.name) return false
        // New format: direct match
        if (p.name === projectId && p.serverType === serverType) {
          return true
        }
        // Legacy format: "project-slug Backend" or "project-slug Frontend"
        const parts = p.name.split(' ')
        if (parts.length >= 2) {
          const projectIdentifier = parts.slice(0, -1).join(' ')
          const serverTypeInName = parts[parts.length - 1].toLowerCase()
          const expectedServerType = serverType === 'api' ? 'backend' : serverType
          const selectedProject = projects.value.find(proj => proj.id === projectId)
          if (selectedProject && 
              (projectIdentifier === projectId || projectIdentifier === selectedProject.slug) &&
              serverTypeInName === expectedServerType &&
              p.serverType === serverType) {
            return true
          }
        }
        return false
      })
      
      // If editing, exclude the current port from the check
      if (isEdit) {
        projectAlreadyHasPort = projectPorts.some(p => p.id !== portId && p.portNumber !== port)
      } else {
        projectAlreadyHasPort = projectPorts.length > 0
      }
    }
    
    // CRITICAL: Use authoritative API to check if port is reserved OR active
    const availability = await store.checkPortAvailability(port)
    
    // Port is unavailable if:
    // 1. Reserved in database (allocated to another project)
    // 2. Active at runtime (currently in use)
    // 3. Project already has this server type allocated
    const unavailable = availability.isReserved || availability.isActive || projectAlreadyHasPort
    
    if (unavailable) {
      let reason = ''
      if (projectAlreadyHasPort) {
        reason = 'Project already has this server type'
      } else if (availability.isReserved) {
        reason = `Reserved by ${availability.reservedBy?.name || 'unknown'}`
      } else if (availability.isActive) {
        reason = `Active (PID: ${availability.activePid || 'unknown'})`
      } else {
        reason = 'Unavailable'
      }
      
      return {
        port,
        available: false,
        reason
      }
    }
    
    return {
      port,
      available: true,
      reason: ''
    }
  }))
}

watch(() => form.value.portNumber, updatePortOptions)
watch(() => form.value.name, updatePortOptions)
watch(() => form.value.serverType, updatePortOptions)

onMounted(async () => {
  await store.fetchPorts()
  const fetchedProjects = await store.fetchProjects()
  projects.value = Array.isArray(fetchedProjects) ? fetchedProjects : []
  
  if (isEdit) {
    const port = store.ports.find(p => p.id === portId)
    if (port) {
      form.value = {
        portNumber: port.portNumber,
        serverType: port.serverType,
        name: port.name || '',
        description: port.description || '',
      }
      updatePortOptions()
    }
  } else {
    updatePortOptions()
  }
})

async function handleSubmit() {
  error.value = null
  
  // Generate ID from project ID and server type
  const generatedId = generatePortId()
  if (!generatedId) {
    error.value = 'Project ID and Server Type are required to generate port ID'
    return
  }
  
  // CRITICAL: Final validation - check port availability one more time before submission
  // This ensures we have the absolute latest state (prevents race conditions)
  const availability = await store.checkPortAvailability(form.value.portNumber)
  if (availability.isReserved) {
    error.value = `Port ${form.value.portNumber} is already reserved by ${availability.reservedBy?.name || 'another project'}. Please refresh and try again.`
    // Refresh ports to update UI
    await store.fetchPorts()
    return
  }
  if (availability.isActive) {
    error.value = `Port ${form.value.portNumber} is currently active (PID: ${availability.activePid || 'unknown'}). Cannot allocate active port.`
    // Refresh ports to update UI
    await store.fetchPorts()
    return
  }
  
  try {
    if (isEdit) {
      const updateData: UpdatePortInput = {
        portNumber: form.value.portNumber,
        serverType: form.value.serverType,
        name: form.value.name || undefined,
        description: form.value.description || undefined,
      }
      await store.updatePort(portId, updateData)
    } else {
      const createData: CreatePortInput = {
        ...form.value,
        id: generatedId,
      }
      await store.createPort(createData)
    }
    router.push('/admin/ports')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save port'
    // Refresh ports on error to show current state
    await store.fetchPorts()
  }
}
</script>



