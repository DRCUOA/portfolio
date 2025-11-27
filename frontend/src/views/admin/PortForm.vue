<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">
          {{ isEdit ? 'Edit Port' : 'Create New Port' }}
        </h1>
        <router-link to="/admin/ports" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Ports</router-link>
      </div>

      <div v-if="store.loading && !isEdit" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-400">Loading...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-8 transition-colors">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
            ID <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            v-model="form.id"
            type="text"
            required
            :disabled="isEdit"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-100 dark:disabled:bg-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="e.g., frontend-main"
          />
          <p class="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">Unique identifier (cannot be changed after creation)</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
            Port Number <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            v-model.number="form.portNumber"
            type="number"
            required
            min="1"
            max="65535"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="e.g., 5173"
          />
          <p class="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">Port number between 1 and 65535</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">
            Server Type <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <select
            v-model="form.serverType"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="api">API</option>
          </select>
          <p class="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">Type of server using this port</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="e.g., Main Frontend Server"
          />
          <p class="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">Optional descriptive name for this port</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 transition-colors">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="Optional description or notes about this port"
          />
        </div>

        <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded transition-colors">
          <p>{{ error }}</p>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="store.loading"
            class="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {{ store.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
          <router-link
            to="/admin/ports"
            class="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore, type CreatePortInput, type UpdatePortInput } from '../../stores/portfolio'

const route = useRoute()
const router = useRouter()
const store = usePortfolioStore()

const isEdit = route.name === 'edit-port'
const portId = route.params.id as string

const form = ref<CreatePortInput>({
  id: '',
  portNumber: 3000,
  serverType: 'frontend',
  name: '',
  description: '',
})

const error = ref<string | null>(null)

onMounted(async () => {
  if (isEdit) {
    await store.fetchPorts()
    const port = store.ports.find(p => p.id === portId)
    if (port) {
      form.value = {
        id: port.id,
        portNumber: port.portNumber,
        serverType: port.serverType,
        name: port.name || '',
        description: port.description || '',
      }
    }
  }
})

async function handleSubmit() {
  error.value = null
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
      await store.createPort(form.value)
    }
    router.push('/admin/ports')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save port'
  }
}
</script>


