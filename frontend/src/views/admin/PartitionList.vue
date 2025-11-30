<template>
  <div class="relative min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 fade-in-up">
        <div>
          <router-link 
            to="/admin" 
            class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-4 inline-flex items-center gap-2"
          >
            <span>←</span> Back to Dashboard
          </router-link>
          <h1 class="text-4xl md:text-5xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">Manage Partitions</h1>
        </div>
        <router-link
          to="/admin/partitions/new"
          class="btn-glass px-6 py-3 rounded-xl font-semibold transition-all"
        >
          + New Partition
        </router-link>
      </div>

      <div v-if="store.loading" class="text-center py-12 glass-card rounded-3xl p-8 animate-fade-in-up">
        <p class="text-white/80 dark:text-slate-400">Loading partitions...</p>
      </div>

      <div v-else-if="store.error" class="glass-strong rounded-xl border-red-400/30 text-red-200 dark:text-red-300 px-4 py-3 mb-4 transition-colors animate-fade-in-up">
        <p>Error: {{ store.error }}</p>
      </div>

      <div v-else class="glass-card rounded-3xl overflow-hidden animate-fade-in-up">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-white/10 dark:divide-slate-700/50">
            <thead class="glass-strong">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">ID</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Description</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Sort Order</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-white dark:text-slate-300 uppercase tracking-wider transition-colors">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10 dark:divide-slate-700/50">
              <tr v-for="(partition, index) in store.partitions" :key="partition.id" class="hover:bg-white/5 dark:hover:bg-slate-700/30 transition-colors animate-fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-slate-200 transition-colors">{{ partition.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-slate-200 transition-colors">{{ partition.name }}</td>
                <td class="px-6 py-4 text-sm text-white/70 dark:text-slate-400 transition-colors">{{ partition.description || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white/70 dark:text-slate-400 transition-colors">{{ partition.sortOrder }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link
                    :to="`/admin/partitions/${partition.id}/edit`"
                    class="btn-glass px-3 py-1.5 rounded-lg text-xs font-semibold mr-2 transition-all"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="handleDelete(partition.id)"
                    class="btn-glass px-3 py-1.5 rounded-lg text-xs font-semibold text-red-200 dark:text-red-300 hover:text-red-100 dark:hover:text-red-200 transition-all"
                    :disabled="deleting === partition.id"
                  >
                    {{ deleting === partition.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '../../stores/portfolio'

const router = useRouter()
const store = usePortfolioStore()
const deleting = ref<string | null>(null)

onMounted(() => {
  store.fetchPartitions()
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this partition? This will also delete all associated project-partition relationships.')) {
    return
  }

  deleting.value = id
  try {
    await store.deletePartition(id)
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to delete partition')
  } finally {
    deleting.value = null
  }
}
</script>

