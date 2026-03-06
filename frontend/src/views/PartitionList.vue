<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Header -->
      <div class="mb-16 fade-in-up flex flex-col items-center text-center">
        <div class="flex items-center justify-center gap-4 mb-6">
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

        <!-- Hero project search / selection -->
        <div class="relative max-w-2xl mt-10 w-full">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects..."
              class="w-full px-6 py-4 pl-14 pr-12 rounded-2xl glass-strong text-white dark:text-slate-300 placeholder-white/50 dark:placeholder-slate-500 text-lg font-medium focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
              @keyup="onSearchKeyup"
              @keydown="onSearchKeydown"
              @focus="showDropdown = true"
              @blur="onSearchBlur"
              autocomplete="off"
            />
            <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 dark:text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <transition name="dropdown">
            <div
              ref="dropdownRef"
              v-if="showDropdown && (searchQuery.length > 0 || filteredProjects.length > 0)"
              class="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl glass-strong border border-white/20 dark:border-slate-600/50 shadow-2xl z-50"
            >
              <div v-if="filteredProjects.length === 0" class="px-6 py-8 text-center text-white/60 dark:text-slate-500">
                No projects match "{{ searchQuery }}"
              </div>
              <button
                v-for="(project, index) in filteredProjects"
                :key="project.id"
                :data-index="index"
                type="button"
                :class="[
                  'w-full px-6 py-4 text-left transition-colors flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl',
                  highlightedIndex === index ? 'bg-white/15 dark:bg-slate-600/40' : 'hover:bg-white/10 dark:hover:bg-slate-700/30'
                ]"
                @mousedown.prevent="selectProject(project)"
              >
                <span class="text-white dark:text-slate-300 font-medium">{{ project.name }}</span>
                <span v-if="project.tagline" class="text-white/50 dark:text-slate-500 text-sm truncate flex-1">{{ project.tagline }}</span>
              </button>
            </div>
          </transition>
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
            <div 
              v-if="getPartitionLogo(partition)"
              class="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center overflow-hidden transition-colors"
            >
              <img
                :src="getPartitionLogo(partition)"
                :alt="`${partition.name} logo`"
                class="w-full h-full object-cover"
              />
            </div>
            <div 
              v-else
              class="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-xl font-bold transition-colors"
            >
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore, type Project } from '../stores/portfolio'

const store = usePortfolioStore()
const router = useRouter()

const projects = ref<Project[]>([])
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(0)
const dropdownRef = ref<HTMLElement | null>(null)

const filteredProjects = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return projects.value
  return projects.value.filter((p) => p.name.toLowerCase().includes(q))
})

watch([searchQuery, filteredProjects], () => {
  highlightedIndex.value = filteredProjects.value.length > 0 ? 0 : -1
})

watch(showDropdown, (visible) => {
  if (visible && filteredProjects.value.length > 0) {
    highlightedIndex.value = 0
  } else if (!visible) {
    highlightedIndex.value = -1
  }
})

function onSearchKeyup() {
  showDropdown.value = true
}

function onSearchKeydown(e: KeyboardEvent) {
  if (!showDropdown.value || filteredProjects.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % filteredProjects.value.length
    scrollHighlightedIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value =
      highlightedIndex.value <= 0
        ? filteredProjects.value.length - 1
        : highlightedIndex.value - 1
    scrollHighlightedIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const project = filteredProjects.value[highlightedIndex.value]
    if (project) selectProject(project)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    showDropdown.value = false
    highlightedIndex.value = -1
  }
}

function scrollHighlightedIntoView() {
  if (!dropdownRef.value || highlightedIndex.value < 0) return
  const el = dropdownRef.value.querySelector(`[data-index="${highlightedIndex.value}"]`)
  el?.scrollIntoView({ block: 'nearest' })
}

function onSearchBlur() {
  // Delay to allow mousedown on dropdown item to fire first
  setTimeout(() => { showDropdown.value = false }, 150)
}

function selectProject(project: Project) {
  searchQuery.value = ''
  showDropdown.value = false
  highlightedIndex.value = -1
  router.push(`/projects/${project.slug}`)
}

// Map partition names/slugs to logo files
const getPartitionLogo = (partition: any): string | null => {
  const name = partition.name.toLowerCase()
  const slug = partition.slug.toLowerCase()
  
  // Mental Health
  if (name.includes('mental health') || name.includes('peer support') || slug.includes('mental-health') || slug.includes('peer-support')) {
    return '/mental-health.png'
  }
  
  // Finances
  if (name.includes('finance') || slug.includes('finance')) {
    return '/finance.png'
  }
  
  // Creative
  if (name.includes('creative') || slug.includes('creative')) {
    return '/creative.png'
  }
  
  // Research & Development
  if (name.includes('research') || name.includes('r&d') || name.includes('experiments') || slug.includes('research') || slug.includes('experiments')) {
    return '/researchdev.png'
  }
  
  return null
}

onMounted(async () => {
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'instant' })
  
  store.fetchPartitions()
  const fetched = await store.fetchProjects()
  projects.value = Array.isArray(fetched) ? fetched : []

  // Ensure we're at the top after data loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 0)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

