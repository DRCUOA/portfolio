<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Back Button -->
      <router-link 
        to="/" 
        class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-8 inline-flex items-center gap-2 fade-in-up"
      >
        <span>←</span> Back to Portfolio
      </router-link>
      
      <!-- Loading State -->
      <div v-if="store.loading" class="text-center py-24">
        <div class="inline-block glass-strong rounded-3xl px-8 py-6">
          <p class="text-white/90 dark:text-slate-300 text-lg font-medium transition-colors">Loading partition...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="store.error" class="glass-strong rounded-3xl p-6 mb-8 border-red-300/30">
        <p class="text-red-100 font-medium">Error: {{ store.error }}</p>
      </div>
      
      <!-- Partition Content -->
      <div v-else-if="partition" class="fade-in-up">
        <!-- Header Card -->
        <div class="glass-strong rounded-3xl p-10 md:p-12 mb-12">
          <div class="flex items-start justify-between mb-6">
            <div class="w-20 h-20 rounded-3xl glass flex items-center justify-center text-white dark:text-slate-300 text-3xl font-bold mb-4 transition-colors">
              {{ partition.name.charAt(0) }}
            </div>
            <div class="text-white/40 dark:text-slate-500 text-sm font-medium transition-colors">Partition #{{ partition.sortOrder }}</div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white dark:text-slate-300 mb-6 leading-tight transition-colors">{{ partition.name }}</h1>
          <p class="text-white/60 dark:text-slate-500 text-xl font-light leading-relaxed max-w-3xl transition-colors">{{ partition.description }}</p>
        </div>
        
        <!-- Projects Section -->
        <div v-if="partition.projects && partition.projects.length > 0">
          <h2 class="text-3xl font-bold text-white dark:text-slate-300 mb-8 fade-in-up transition-colors">Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(project, index) in partition.projects"
              :key="project.id"
              class="glass-card rounded-3xl p-8 fade-in-up relative group"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <router-link
                :to="`/projects/${project.slug}`"
                class="block"
              >
                <div class="flex items-start justify-between mb-4">
                  <div 
                    v-if="project.name.toLowerCase() === 'e-artem'"
                    class="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center overflow-hidden transition-colors"
                  >
                    <img
                      src="/favicon.svg"
                      :alt="`${project.name} logo`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    v-else-if="project.name.toLowerCase() === 'simples'"
                    class="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center overflow-hidden transition-colors"
                  >
                    <img
                      src="/simples-icon.png"
                      :alt="`${project.name} logo`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    v-else
                    class="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-lg font-bold transition-colors"
                  >
                    {{ project.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <span
                      :class="{
                        'bg-green-500/30 text-green-100 border-green-400/30': project.status === 'live',
                        'bg-yellow-500/30 text-yellow-100 border-yellow-400/30': project.status === 'prototype',
                        'bg-gray-500/30 text-gray-100 border-gray-400/30': project.status === 'archived'
                      }"
                      class="px-3 py-1.5 text-xs font-semibold rounded-xl border backdrop-blur-sm"
                    >
                      {{ project.status }}
                    </span>
                    <span
                      v-if="project.nsfw"
                      class="px-2 py-1 text-xs font-semibold rounded-lg bg-red-500/30 text-red-100 border border-red-400/30 backdrop-blur-sm flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      NSFW
                    </span>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-white dark:text-slate-300 mb-3 leading-tight transition-colors">{{ project.name }}</h3>
                        <p v-if="project.shortDescription" class="text-white/60 dark:text-slate-500 text-sm font-light mb-3 leading-relaxed transition-colors">
                          {{ project.shortDescription }}
                        </p>
                        <p v-if="project.tagline" class="text-white/60 dark:text-slate-500 text-xs font-light italic mb-4 transition-colors">
                          {{ project.tagline }}
                        </p>
              </router-link>
              
              <!-- GitHub Link -->
              <div v-if="project.primaryRepoUrl" class="mt-6 pt-6 border-t border-white/10 dark:border-slate-700/50">
                <a
                  :href="project.primaryRepoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                  class="flex items-center gap-2 text-white/70 dark:text-slate-400 hover:text-white dark:hover:text-slate-300 transition-colors group/github"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium">{{ project.githubRepoFullName || 'View on GitHub' }}</span>
                  <span class="text-white/40 dark:text-slate-600 group-hover/github:text-white/60 dark:group-hover/github:text-slate-400 transition-colors">↗</span>
                </a>
              </div>
              
              <div class="flex items-center gap-3 mt-4">
                <router-link
                  :to="`/projects/${project.slug}`"
                  class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium hover:text-white dark:hover:text-slate-300 transition-colors"
                >
                  <span>View Details →</span>
                </router-link>
                <span class="text-white/30 dark:text-slate-600">•</span>
                <router-link
                  :to="`/apps/${project.slug}`"
                  class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium hover:text-white dark:hover:text-slate-300 transition-colors"
                >
                  <span>App Store View →</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
                <div v-else class="glass-strong rounded-3xl p-12 text-center">
                  <p class="text-white/60 dark:text-slate-500 text-lg font-light transition-colors">No projects found in this partition.</p>
                </div>
              </div>
              
              <!-- Not Found State -->
              <div v-else class="glass-strong rounded-3xl p-12 text-center">
                <p class="text-white/60 dark:text-slate-500 text-lg font-light transition-colors">Partition not found.</p>
              </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioStore, type PartitionDetail } from '../stores/portfolio'

const route = useRoute()
const store = usePortfolioStore()
const partition = ref<PartitionDetail | null>(null)

onMounted(async () => {
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'instant' })
  
  const slug = route.params.slug as string
  partition.value = await store.fetchPartitionBySlug(slug)
  
  // Ensure we're at the top after data loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 0)
})
</script>

