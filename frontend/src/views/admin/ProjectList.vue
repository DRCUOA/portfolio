<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Manage Projects</h1>
          <router-link to="/admin" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Dashboard</router-link>
        </div>
        <router-link
          to="/admin/projects/new"
          class="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          + New Project
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-400">Loading projects...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 transition-colors">
        <p>Error: {{ error }}</p>
      </div>

      <div v-else class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl overflow-hidden transition-colors">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-200 transition-colors">{{ project.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': project.status === 'live',
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': project.status === 'prototype',
                    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300': project.status === 'archived'
                  }"
                  class="px-2 py-1 text-xs font-semibold rounded transition-colors"
                >
                  {{ project.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-slate-400 transition-colors">{{ project.shortDescription || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 transition-colors">
                {{ new Date(project.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link
                  :to="`/admin/projects/${project.id}/edit`"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors"
                >
                  Edit
                </router-link>
                <button
                  @click="handleDelete(project.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                  :disabled="deleting === project.id"
                >
                  {{ deleting === project.id ? 'Deleting...' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore, type Project } from '../../stores/portfolio'

const router = useRouter()
const store = usePortfolioStore()
const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const deleting = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    projects.value = await store.fetchProjects()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load projects'
  } finally {
    loading.value = false
  }
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this project? This will also delete all associated project-partition relationships.')) {
    return
  }

  deleting.value = id
  try {
    await store.deleteProject(id)
    projects.value = projects.value.filter(p => p.id !== id)
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete project')
  } finally {
    deleting.value = null
  }
}
</script>

