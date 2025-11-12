<template>
  <div class="relative">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <router-link 
        to="/" 
        class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-6 inline-flex items-center gap-2 fade-in-up"
      >
        <span>←</span> Back to Portfolio
      </router-link>
      
      <!-- Loading State -->
      <div v-if="store.loading" class="text-center py-24">
        <div class="inline-block glass-strong rounded-3xl px-8 py-6">
          <p class="text-white/90 dark:text-slate-300 text-lg font-medium transition-colors">Loading app...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="store.error" class="glass-strong rounded-3xl p-6 mb-8 border-red-300/30">
        <p class="text-red-100 font-medium">Error: {{ store.error }}</p>
      </div>
      
      <!-- App Store View -->
      <div v-else-if="project" class="fade-in-up">
        <!-- Hero Section -->
        <div class="glass-strong rounded-3xl p-8 md:p-12 mb-8">
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <!-- App Icon -->
            <div class="flex-shrink-0">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-3xl glass flex items-center justify-center text-white dark:text-slate-300 text-5xl md:text-6xl font-bold shadow-2xl transition-colors">
                {{ project.name.charAt(0) }}
              </div>
            </div>
            
            <!-- App Info -->
            <div class="flex-1">
              <h1 class="text-4xl md:text-5xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">{{ project.name }}</h1>
                      <p v-if="project.tagline" class="text-white/60 dark:text-slate-500 text-xl font-light mb-4 transition-colors">{{ project.tagline }}</p>
              
              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-4 mt-6">
                <a
                  v-if="project.primaryRepoUrl"
                  :href="project.primaryRepoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-glass px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-glass px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open App
                </a>
                <span
                  :class="{
                    'bg-green-500/30 text-green-100 border-green-400/30': project.status === 'live',
                    'bg-yellow-500/30 text-yellow-100 border-yellow-400/30': project.status === 'prototype',
                    'bg-gray-500/30 text-gray-100 border-gray-400/30': project.status === 'archived'
                  }"
                  class="px-4 py-3 text-sm font-semibold rounded-2xl border backdrop-blur-sm"
                >
                  {{ project.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Live App Showcase Section -->
        <div v-if="project.liveUrl" class="glass-strong rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
          </div>
          
          <div class="relative z-10">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                    <svg class="w-6 h-6 text-white dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-3xl md:text-4xl font-bold text-white dark:text-slate-300 mb-1 transition-colors">Try It Live</h2>
                            <p class="text-white/60 dark:text-slate-500 text-base font-light transition-colors">Experience the app directly in your browser</p>
                  </div>
                </div>
              </div>
              
              <a
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-glass px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Launch App</span>
              </a>
            </div>
            
            <!-- Preview Card -->
            <div class="glass-card rounded-2xl overflow-hidden shadow-2xl">
              <div class="aspect-video bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 dark:from-slate-900/50 dark:via-slate-800/40 dark:to-slate-900/50 relative group transition-colors">
                <!-- Iframe Preview (may be blocked by some sites) -->
                <iframe
                  :src="project.liveUrl"
                  class="w-full h-full border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"
                  @error="iframeError = true"
                ></iframe>
                
                <!-- Preview Overlay -->
                <div class="absolute inset-0 flex flex-col items-center justify-center p-8 group-hover:opacity-0 transition-opacity duration-300">
                  <div class="w-20 h-20 rounded-3xl glass-strong flex items-center justify-center mb-6">
                    <svg class="w-10 h-10 text-white dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">{{ project.name }}</h3>
                          <p class="text-white/60 dark:text-slate-500 text-center font-light mb-6 max-w-md transition-colors">{{ project.shortDescription || 'Click to explore this live application' }}</p>
                  <a
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="glass-strong px-6 py-3 rounded-2xl text-white dark:text-slate-300 font-semibold flex items-center gap-2 hover:bg-white/20 dark:hover:bg-slate-700/30 transition-all"
                  >
                    <span>Open in New Tab</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- URL Display -->
            <div class="mt-6 flex items-center justify-center">
              <div class="glass rounded-2xl px-6 py-3 flex items-center gap-3">
                <svg class="w-5 h-5 text-white/60 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-white/80 dark:text-slate-400 hover:text-white dark:hover:text-slate-300 text-sm font-medium transition-colors break-all"
                >
                  {{ project.liveUrl }}
                </a>
                <svg class="w-4 h-4 text-white/40 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Screenshots Section -->
        <div class="glass-card rounded-3xl p-6 md:p-8 mb-8">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6 transition-colors">Screenshots</h2>
          <div class="relative">
            <div 
              ref="screenshotContainer"
              class="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
              style="scrollbar-width: none; -ms-overflow-style: none;"
            >
              <div
                v-for="(screenshot, index) in screenshots"
                :key="index"
                class="flex-shrink-0 snap-center"
              >
                <div class="glass-strong rounded-2xl overflow-hidden w-64 md:w-80 h-auto shadow-2xl">
                  <img
                    :src="screenshot"
                    :alt="`${project.name} screenshot ${index + 1}`"
                    class="w-full h-auto object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>
              <!-- Placeholder if no screenshots -->
              <div v-if="screenshots.length === 0" class="flex-shrink-0 snap-center">
                <div class="glass-strong rounded-2xl w-64 md:w-80 h-96 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-white/40 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-white/60 dark:text-slate-500 text-sm transition-colors">No screenshots available</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Scroll indicators -->
            <div v-if="screenshots.length > 0" class="flex justify-center gap-2 mt-4">
              <div
                v-for="(_, index) in screenshots"
                :key="index"
                :class="currentScreenshot === index ? 'bg-white/60 dark:bg-slate-500/60' : 'bg-white/20 dark:bg-slate-600/30'"
                class="w-2 h-2 rounded-full transition-all"
              />
            </div>
          </div>
        </div>
        
        <!-- Description Section -->
        <div v-if="project.shortDescription || descriptionText" class="glass-card rounded-3xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6 transition-colors">About</h2>
          <div class="space-y-4">
            <p v-if="project.shortDescription" class="text-white/60 dark:text-slate-500 text-lg font-light leading-relaxed transition-colors">
              {{ project.shortDescription }}
            </p>
            <p v-if="descriptionText" class="text-white/60 dark:text-slate-500 text-base font-light leading-relaxed whitespace-pre-line transition-colors">
              {{ descriptionText }}
            </p>
          </div>
        </div>
        
        <!-- What's New / Updates Section -->
        <div class="glass-card rounded-3xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6 transition-colors">What's New</h2>
          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="text-white/60 dark:text-slate-500 text-sm font-semibold min-w-[80px] transition-colors">
                {{ formatDate(project.updatedAt) }}
              </div>
              <div class="flex-1">
                        <p class="text-white/60 dark:text-slate-500 text-base font-light leading-relaxed transition-colors">
                          Latest update: {{ project.updatedAt !== project.createdAt ? 'Project updated' : 'Initial release' }}
                        </p>
                        <p class="text-white/60 dark:text-slate-500 text-sm font-light mt-2 transition-colors">
                  Version {{ project.status === 'live' ? '1.0' : '0.1' }} • 
                  {{ project.status === 'live' ? 'Production' : project.status === 'prototype' ? 'Beta' : 'Archived' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-semibold text-white/60 dark:text-slate-500 mb-3 uppercase tracking-wider transition-colors">Developer</h3>
            <p class="text-white dark:text-slate-300 font-medium text-lg transition-colors">{{ project.githubRepoFullName?.split('/')[0] || 'Portfolio' }}</p>
          </div>
          
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-semibold text-white/60 dark:text-slate-500 mb-3 uppercase tracking-wider transition-colors">Category</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="partition in project.partitions"
                :key="partition.id"
                class="px-3 py-1.5 glass-strong rounded-xl text-white dark:text-slate-300 text-sm font-medium transition-colors"
              >
                {{ partition.name }}
              </span>
            </div>
          </div>
          
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-semibold text-white/60 dark:text-slate-500 mb-3 uppercase tracking-wider transition-colors">Released</h3>
            <p class="text-white dark:text-slate-300 font-medium transition-colors">{{ formatDate(project.createdAt) }}</p>
          </div>
          
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-semibold text-white/60 dark:text-slate-500 mb-3 uppercase tracking-wider transition-colors">Last Updated</h3>
            <p class="text-white dark:text-slate-300 font-medium transition-colors">{{ formatDate(project.updatedAt) }}</p>
          </div>
        </div>
        
        <!-- Related Projects / Partitions -->
        <div v-if="project.partitions && project.partitions.length > 0" class="glass-card rounded-3xl p-8">
          <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6 transition-colors">Also in</h2>
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
const screenshotContainer = ref<HTMLElement | null>(null)
const currentScreenshot = ref(0)
const iframeError = ref(false)

// Extract screenshots and description from project data
const screenshots = computed(() => {
  if (!project.value) return []
  
  // Try to parse screenshots from longDescription if it's JSON
  try {
    const parsed = JSON.parse(project.value.longDescription || '{}')
    if (parsed.screenshots && Array.isArray(parsed.screenshots)) {
      return parsed.screenshots.filter((url: string) => url && url.trim().length > 0)
    }
  } catch {
    // Not JSON, continue
  }
  
  return []
})

// Extract description text (handles both JSON and plain text)
const descriptionText = computed(() => {
  if (!project.value) return ''
  
  // Try to parse description from longDescription if it's JSON
  try {
    const parsed = JSON.parse(project.value.longDescription || '{}')
    if (parsed.description) {
      return parsed.description
    }
  } catch {
    // Not JSON, use as-is
  }
  
  return project.value.longDescription || ''
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

onMounted(async () => {
  const slug = route.params.slug as string
  project.value = await store.fetchProjectBySlug(slug)
  
  // Set up screenshot scrolling
  if (screenshotContainer.value && screenshots.value.length > 0) {
    screenshotContainer.value.addEventListener('scroll', () => {
      if (screenshotContainer.value) {
        const scrollLeft = screenshotContainer.value.scrollLeft
        const itemWidth = screenshotContainer.value.querySelector('div')?.offsetWidth || 0
        currentScreenshot.value = Math.round(scrollLeft / (itemWidth + 16)) // 16 is gap
      }
    })
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.snap-x {
  scroll-snap-type: x mandatory;
}

.snap-center {
  scroll-snap-align: center;
}
</style>

