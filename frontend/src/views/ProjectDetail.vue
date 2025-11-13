<template>
  <div class="relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
          <p class="text-white/90 dark:text-slate-300 text-lg font-medium transition-colors">Loading project...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="store.error" class="glass-strong rounded-3xl p-6 mb-8 border-red-300/30">
        <p class="text-red-100 font-medium">Error: {{ store.error }}</p>
      </div>
      
      <!-- NSFW Warning Modal -->
      <div
        v-if="project && project.nsfw && !nsfwAccepted"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="showNsfwWarning = false"
      >
        <div class="glass-strong rounded-3xl p-8 max-w-md w-full border-2 border-red-500/50">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-2">Content Warning</h2>
            <p class="text-white/80 dark:text-slate-400">
              This project may contain content that is offensive or inappropriate for users under 18 or sensitive viewers.
            </p>
          </div>
          <div class="flex gap-4">
            <button
              @click="$router.push('/')"
              class="flex-1 px-6 py-3 rounded-2xl bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
            >
              Go Back
            </button>
            <button
              @click="nsfwAccepted = true; showNsfwWarning = false"
              class="flex-1 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <!-- Project Content -->
      <div v-else-if="project && (!project.nsfw || nsfwAccepted)" class="fade-in-up">
        <!-- Hero Card -->
        <div class="glass-strong rounded-3xl p-10 md:p-12 mb-8">
          <div class="flex items-start justify-between mb-6">
            <div class="w-24 h-24 rounded-3xl glass flex items-center justify-center text-white dark:text-slate-300 text-4xl font-bold transition-colors">
              {{ project.name.charAt(0) }}
            </div>
            <div class="flex flex-col items-end gap-2">
              <span
                :class="{
                  'bg-green-500/30 text-green-100 border-green-400/30': project.status === 'live',
                  'bg-yellow-500/30 text-yellow-100 border-yellow-400/30': project.status === 'prototype',
                  'bg-gray-500/30 text-gray-100 border-gray-400/30': project.status === 'archived'
                }"
                class="px-4 py-2 text-sm font-semibold rounded-xl border backdrop-blur-sm"
              >
                {{ project.status }}
              </span>
              <span
                v-if="project.nsfw"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/30 text-red-100 border border-red-400/30 backdrop-blur-sm flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                NSFW
              </span>
            </div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white dark:text-slate-300 mb-4 leading-tight transition-colors">{{ project.name }}</h1>
          <p v-if="project.tagline" class="text-white/60 dark:text-slate-500 text-2xl font-light mb-6 transition-colors">{{ project.tagline }}</p>
        </div>
        
        <!-- Description Section -->
        <div v-if="project.shortDescription" class="glass-card rounded-3xl p-8 mb-6">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">Description</h2>
          <p class="text-white/60 dark:text-slate-500 text-lg font-light leading-relaxed transition-colors">{{ project.shortDescription }}</p>
        </div>
        
        <!-- Details Section -->
        <div v-if="longDescriptionText" class="glass-card rounded-3xl p-8 mb-6">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">Details</h2>
          <p class="text-white/60 dark:text-slate-500 text-lg font-light leading-relaxed whitespace-pre-line transition-colors">{{ longDescriptionText }}</p>
        </div>
        
        <!-- GitHub & Live Links -->
        <div v-if="project.primaryRepoUrl || project.liveUrl" class="flex flex-wrap gap-4 mb-8">
          <a
            v-if="project.primaryRepoUrl"
            :href="project.primaryRepoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 hover:bg-white/20 transition-all group"
          >
            <svg class="w-6 h-6 text-white dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <div>
              <div class="text-xs text-white/60 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">GitHub Repository</div>
              <div class="text-white dark:text-slate-300 font-semibold flex items-center gap-2 transition-colors">
                {{ project.githubRepoFullName }}
                <span class="text-white/40 dark:text-slate-600 group-hover:text-white/60 dark:group-hover:text-slate-400 transition-colors">↗</span>
              </div>
            </div>
          </a>
          
          <a
            v-if="project.liveUrl"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 hover:bg-white/20 transition-all group"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <div>
              <div class="text-xs text-white/60 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">Live Demo</div>
              <div class="text-white dark:text-slate-300 font-semibold flex items-center gap-2 transition-colors">
                Visit Site
                <span class="text-white/40 dark:text-slate-600 group-hover:text-white/60 dark:group-hover:text-slate-400 transition-colors">↗</span>
              </div>
            </div>
          </a>
        </div>
        
        <!-- Metadata Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-semibold text-white/60 dark:text-slate-500 mb-2 uppercase tracking-wider transition-colors">Created</h3>
            <p class="text-white dark:text-slate-300 font-medium transition-colors">{{ formatDate(project.createdAt) }}</p>
          </div>
          
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-semibold text-white/60 dark:text-slate-500 mb-2 uppercase tracking-wider transition-colors">Updated</h3>
            <p class="text-white dark:text-slate-300 font-medium transition-colors">{{ formatDate(project.updatedAt) }}</p>
          </div>
        </div>
        
        <!-- View Options -->
        <div class="glass-card rounded-3xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-white dark:text-slate-300 mb-4 transition-colors">View Options</h3>
          <div class="flex flex-wrap gap-3">
            <router-link
              :to="`/apps/${project.slug}`"
              class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              App Store View
            </router-link>
          </div>
        </div>
        
        <!-- Partitions Section -->
        <div v-if="project.partitions && project.partitions.length > 0" class="glass-card rounded-3xl p-8">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6 transition-colors">Partitions</h2>
          <div class="flex flex-wrap gap-3">
            <router-link
              v-for="partition in project.partitions"
              :key="partition.id"
              :to="`/partitions/${partition.slug}`"
              class="glass-strong px-5 py-2.5 rounded-2xl text-white dark:text-slate-300 font-medium hover:bg-white/20 dark:hover:bg-slate-700/30 transition-all backdrop-blur-sm"
            >
              {{ partition.name }}
            </router-link>
          </div>
        </div>
      </div>
      
              <!-- Not Found State -->
              <div v-else class="glass-strong rounded-3xl p-12 text-center">
                <p class="text-white/60 dark:text-slate-500 text-lg font-light transition-colors">Project not found.</p>
              </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioStore, type ProjectDetail } from '../stores/portfolio'

const route = useRoute()
const store = usePortfolioStore()
const project = ref<ProjectDetail | null>(null)
const showNsfwWarning = ref(false)
const nsfwAccepted = ref(false)

// Extract description text (handles both JSON and plain text)
const longDescriptionText = computed(() => {
  if (!project.value) return ''
  
  // Try to parse description from longDescription if it's JSON
  try {
    const parsed = JSON.parse(project.value.longDescription || '{}')
    // Only return the description field, ignore screenshots
    if (parsed.description && parsed.description.trim().length > 0) {
      return parsed.description
    }
    // If description is empty but JSON exists, return empty string (don't show JSON)
    return ''
  } catch {
    // Not JSON, use as-is (plain text description)
    return project.value.longDescription || ''
  }
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const slug = route.params.slug as string
  project.value = await store.fetchProjectBySlug(slug)
  
  // Show NSFW warning if project is marked as NSFW
  if (project.value && project.value.nsfw) {
    showNsfwWarning.value = true
    nsfwAccepted.value = false
  }
})
</script>

