<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Traffic Analytics</h1>
        <router-link to="/admin" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Dashboard</router-link>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-400">Loading traffic statistics...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 transition-colors">
        <p>Error: {{ error }}</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-6 transition-colors">
            <h3 class="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 transition-colors">Total Clicks</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">{{ totalClicks }}</p>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-6 transition-colors">
            <h3 class="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 transition-colors">Total Data Transfer</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">{{ totalDataTransferMB.toFixed(2) }} MB</p>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-6 transition-colors">
            <h3 class="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 transition-colors">Active Ports</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">{{ activePorts }}</p>
          </div>
        </div>

        <!-- Port Statistics Table -->
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl overflow-hidden transition-colors">
          <div class="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Traffic by Port</h2>
          </div>
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Port</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Clicks</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Data Transfer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Click Events</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Transfer Events</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Last Activity</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="stat in stats" :key="stat.portId || 'none'" class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-200 transition-colors">
                  {{ stat.portName || (stat.portId ? `Port ${stat.portId}` : 'General') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-200 transition-colors">
                  {{ stat.totalClicks }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-200 transition-colors">
                  {{ stat.totalDataTransferMB.toFixed(2) }} MB
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 transition-colors">
                  {{ stat.clickCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 transition-colors">
                  {{ stat.dataTransferCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 transition-colors">
                  {{ stat.lastActivity ? new Date(stat.lastActivity).toLocaleString() : 'Never' }}
                </td>
              </tr>
              <tr v-if="stats.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-slate-400 transition-colors">No traffic data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePortfolioStore, type TrafficStats } from '../../stores/portfolio'

const store = usePortfolioStore()
const loading = ref(false)
const error = ref<string | null>(null)
const stats = ref<TrafficStats[]>([])

const totalClicks = computed(() => {
  return stats.value.reduce((sum, stat) => sum + stat.totalClicks, 0)
})

const totalDataTransferMB = computed(() => {
  return stats.value.reduce((sum, stat) => sum + stat.totalDataTransferMB, 0)
})

const activePorts = computed(() => {
  return stats.value.filter(stat => stat.lastActivity !== null).length
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const result = await store.fetchTrafficStats()
    stats.value = Array.isArray(result) ? result : []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load traffic statistics'
    console.error('Error loading traffic stats:', err)
  } finally {
    loading.value = false
  }
})
</script>






