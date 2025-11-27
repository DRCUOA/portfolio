<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">
          {{ isEdit ? 'Edit Port' : 'Create New Port' }}
        </h1>
        <router-link to="/admin/ports" class="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Ports</router-link>
      </div>

      <div v-if="store.loading && !isEdit" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-400">Loading...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-4 sm:p-6 lg:p-8 transition-colors">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
            Port Number <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <div class="flex flex-col lg:flex-row gap-4 lg:items-start">
            <div class="lg:w-2/5 min-w-0">
              <input
                v-model.number="form.portNumber"
                type="number"
                required
                min="1"
                max="65535"
                class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
                placeholder="e.g., 5173"
                @input="updatePortOptions"
              />
              <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400 transition-colors">Port number between 1 and 65535</p>
            </div>
            <div v-if="form.portNumber && form.portNumber >= 1 && form.portNumber <= 65535 && portOptions.length > 0" class="lg:flex-1 min-w-0">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
                Select from nearby ports:
              </label>
              <div class="relative">
                <div
                  class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400"
                  @click="showDropdown = !showDropdown"
                  tabindex="0"
                  @blur="setTimeout(() => showDropdown = false, 200)"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-gray-900 dark:text-slate-100 truncate">{{ form.portNumber }}</span>
                    <svg class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2" :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div
                  v-if="showDropdown"
                  class="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  <button
                    v-for="option in portOptions"
                    :key="option.port"
                    type="button"
                    @click="selectPort(option.port)"
                    @mousedown.prevent
                    :disabled="!option.available"
                    :class="[
                      'w-full text-left px-3 py-2 text-sm transition-colors',
                      option.available
                        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer'
                        : 'text-red-500 dark:text-red-500 bg-red-50 dark:bg-red-900/20 opacity-60 cursor-not-allowed',
                      option.port === form.portNumber ? 'font-semibold bg-blue-50 dark:bg-blue-900/20' : ''
                    ]"
                  >
                    {{ option.port }} {{ option.available ? '(Available)' : `(${option.reason})` }}
                  </button>
                </div>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-slate-400 transition-colors">
                <span class="text-green-600 dark:text-green-400">●</span> Available
                <span class="ml-3 text-red-500 dark:text-red-500">●</span> Unavailable
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
              Server Type <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              v-model="form.serverType"
              required
              class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="api">API</option>
            </select>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400 transition-colors">Server type</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
              Project ID <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.name"
                required
                class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
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
            <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400 transition-colors">Project</p>
            <p v-if="form.name && selectedProject" class="mt-1 text-xs text-blue-600 dark:text-blue-400 transition-colors">
              Status: <span :class="{
                'text-green-600 dark:text-green-400': selectedProject.status === 'live',
                'text-yellow-600 dark:text-yellow-400': selectedProject.status === 'prototype',
                'text-gray-600 dark:text-gray-400': selectedProject.status === 'archived'
              }">{{ selectedProject.status }}</span>
            </p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors resize-y"
            placeholder="Optional description or notes about this port"
          />
        </div>

        <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded text-sm sm:text-base transition-colors">
          <p>{{ error }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            type="submit"
            :disabled="store.loading"
            class="w-full sm:w-auto bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 text-sm sm:text-base rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
          >
            {{ store.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
          <router-link
            to="/admin/ports"
            class="w-full sm:w-auto bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 px-6 py-2.5 text-sm sm:text-base rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium text-center"
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

function updatePortOptions() {
  if (!form.value.portNumber || form.value.portNumber < 1 || form.value.portNumber > 65535) {
    portOptions.value = []
    return
  }

  const basePort = form.value.portNumber
  const ports = [
    basePort - 2,
    basePort - 1,
    basePort,
    basePort + 1,
    basePort + 2,
  ].filter(p => p >= 1 && p <= 65535)

  portOptions.value = ports.map(port => {
    const existingPort = store.ports.find(p => p.portNumber === port)
    const isAllocated = existingPort && existingPort.name
    const isInUse = existingPort && existingPort.inUse
    
    if (isAllocated || isInUse) {
      return {
        port,
        available: false,
        reason: isAllocated ? 'Allocated' : 'In Use'
      }
    }
    
    return {
      port,
      available: true,
      reason: ''
    }
  })
}

watch(() => form.value.portNumber, updatePortOptions)

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
  }
}
</script>



