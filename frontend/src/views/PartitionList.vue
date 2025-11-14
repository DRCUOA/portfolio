<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Header -->
      <div class="mb-16 fade-in-up">
        <div class="flex items-center gap-4 mb-6">
          <img 
            src="/logo.svg" 
            alt="Portfolio Logo" 
            class="w-16 h-16 md:w-20 md:h-20 transition-opacity hover:opacity-80"
          />
          <div>
            <h1 class="text-6xl md:text-7xl font-bold text-white dark:text-slate-300 mb-2 tracking-tight transition-colors">
              Portfolio
            </h1>
            <p class="text-xl text-white/60 dark:text-slate-500 font-light transition-colors">Showcasing innovation and creativity</p>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="store.loading" class="text-center py-24">
          <div class="inline-block glass-strong rounded-3xl px-8 py-6">
                  <p class="text-white/90 dark:text-slate-300 text-lg font-medium transition-colors">Loading partitions...</p>
                </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="store.error" class="glass-strong rounded-3xl p-6 mb-8 border-red-300/30">
        <p class="text-red-100 font-medium">Error: {{ store.error }}</p>
      </div>
      
      <!-- Partitions Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <router-link
          v-for="(partition, index) in store.partitions"
          :key="partition.id"
          :to="`/partitions/${partition.slug}`"
          class="glass-card rounded-3xl p-8 block fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-xl font-bold transition-colors">
              {{ partition.name.charAt(0) }}
            </div>
            <div class="text-white/40 dark:text-slate-500 text-sm font-medium transition-colors">#{{ partition.sortOrder }}</div>
          </div>
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-3 leading-tight transition-colors">{{ partition.name }}</h2>
          <p class="text-white/60 dark:text-slate-500 text-sm font-light leading-relaxed transition-colors">{{ partition.description }}</p>
          <div class="mt-6 flex items-center text-white/60 dark:text-slate-500 text-sm font-medium transition-colors">
            <span>Explore →</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'

const store = usePortfolioStore()

onMounted(() => {
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'instant' })
  
  store.fetchPartitions()
  
  // Ensure we're at the top after data loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 0)
})
</script>

