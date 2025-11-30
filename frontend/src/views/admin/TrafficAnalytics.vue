<template>
  <div class="relative min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8 fade-in-up">
        <router-link 
          to="/admin" 
          class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-4 inline-flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </router-link>
        <h1 class="text-4xl md:text-5xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">Traffic Analytics</h1>
      </div>

      <div v-if="loading" class="text-center py-12 glass-card rounded-3xl p-8 animate-fade-in-up">
        <p class="text-white/80 dark:text-slate-400">Loading traffic statistics...</p>
      </div>

      <div v-else-if="error" class="glass-strong rounded-xl border-red-400/30 text-red-200 dark:text-red-300 px-4 py-3 mb-4 transition-colors animate-fade-in-up">
        <p>Error: {{ error }}</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-card rounded-3xl p-6 animate-fade-in-up" style="animation-delay: 0.1s">
            <h3 class="text-sm font-medium text-white/70 dark:text-slate-400 mb-2 transition-colors">Total Clicks</h3>
            <p class="text-3xl font-bold text-white dark:text-slate-100 transition-colors">{{ totalClicks }}</p>
          </div>
          <div class="glass-card rounded-3xl p-6 animate-fade-in-up" style="animation-delay: 0.2s">
            <h3 class="text-sm font-medium text-white/70 dark:text-slate-400 mb-2 transition-colors">Total Data Transfer</h3>
            <p class="text-3xl font-bold text-white dark:text-slate-100 transition-colors">{{ totalDataTransferMB.toFixed(2) }} MB</p>
          </div>
          <div class="glass-card rounded-3xl p-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <h3 class="text-sm font-medium text-white/70 dark:text-slate-400 mb-2 transition-colors">Active Ports</h3>
            <p class="text-3xl font-bold text-white dark:text-slate-100 transition-colors">{{ activePorts }}</p>
          </div>
        </div>

        <!-- Port Statistics Table -->
        <div class="glass-card rounded-3xl overflow-hidden animate-fade-in-up">
          <div class="px-6 py-4 glass-strong border-b border-white/10 dark:border-slate-700/50">
            <h2 class="text-xl font-bold text-white dark:text-slate-100 transition-colors">Traffic by Port</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/10 dark:divide-slate-700/50">
              <thead class="glass-strong">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Port</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Clicks</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Data Transfer</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Click Events</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Transfer Events</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Last Activity</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10 dark:divide-slate-700/50">
                <tr v-for="(stat, index) in stats" :key="stat.portId || 'none'" class="hover:bg-white/5 dark:hover:bg-slate-700/30 transition-colors animate-fade-in-up" :style="{ animationDelay: `${index * 0.05}s` }">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-slate-200 transition-colors">
                    {{ stat.portName || (stat.portId ? `Port ${stat.portId}` : 'General') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-slate-200 transition-colors">
                    {{ stat.totalClicks }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-slate-200 transition-colors">
                    {{ stat.totalDataTransferMB.toFixed(2) }} MB
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-white/70 dark:text-slate-400 transition-colors">
                    {{ stat.clickCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-white/70 dark:text-slate-400 transition-colors">
                    {{ stat.dataTransferCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-white/70 dark:text-slate-400 transition-colors">
                    {{ stat.lastActivity ? new Date(stat.lastActivity).toLocaleString() : 'Never' }}
                  </td>
                </tr>
                <tr v-if="stats.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-white/70 dark:text-slate-400 transition-colors">No traffic data available</td>
                </tr>
              </tbody>
            </table>
          </div>
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






