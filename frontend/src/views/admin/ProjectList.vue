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
          <h1 class="text-4xl md:text-5xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">Manage Projects</h1>
        </div>
        <router-link
          to="/admin/projects/new"
          class="btn-glass px-6 py-3 rounded-xl font-semibold transition-all"
        >
          + New Project
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12 glass-card rounded-3xl p-8 animate-fade-in-up">
        <p class="text-white/80 dark:text-slate-400">Loading projects...</p>
      </div>

      <div v-else-if="error" class="glass-strong rounded-xl border-red-400/30 text-red-200 dark:text-red-300 px-4 py-3 mb-4 transition-colors animate-fade-in-up">
        <p>Error: {{ error }}</p>
      </div>

      <div v-else-if="projects.length === 0" class="glass-card rounded-3xl p-12 text-center animate-fade-in-up">
        <p class="text-white/80 dark:text-slate-400 text-lg mb-4">No projects found</p>
        <router-link
          to="/admin/projects/new"
          class="btn-glass px-6 py-3 rounded-xl font-semibold inline-block transition-all"
        >
          Create Your First Project
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="glass-card rounded-3xl p-6 cursor-pointer animate-fade-in-up hover:scale-105 transition-all flex flex-col"
          :style="{ animationDelay: `${index * 0.1}s`, height: '400px' }"
          @click="openModal(project)"
        >
          <!-- Header Section - Fixed -->
          <div class="flex items-start justify-between mb-4 flex-shrink-0">
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-bold text-white dark:text-slate-200 mb-2 transition-colors flex items-center gap-2 truncate">
                {{ project.name }}
                <span v-if="project.nsfw" class="text-red-300 text-sm flex-shrink-0" title="NSFW Content">⚠️</span>
              </h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  :class="{
                    'glass-strong text-green-200 dark:text-green-300': project.status === 'live',
                    'glass-strong text-yellow-200 dark:text-yellow-300': project.status === 'prototype',
                    'glass-strong text-white/80 dark:text-gray-300': project.status === 'archived'
                  }"
                  class="px-2 py-1 text-xs font-semibold rounded transition-colors flex-shrink-0"
                >
                  {{ project.status }}
                </span>
                <span
                  v-if="project.nsfw"
                  class="px-2 py-1 text-xs font-semibold rounded glass-strong text-red-200 dark:text-red-300 border border-red-400/30 dark:border-red-700/50 transition-colors flex-shrink-0"
                >
                  NSFW
                </span>
              </div>
            </div>
          </div>
          
          <!-- Body Section - Fixed height with scroll -->
          <div class="flex-1 min-h-0 mb-4 overflow-y-auto scrollbar-thin pr-2">
            <p class="text-sm text-white/70 dark:text-slate-400 transition-colors leading-relaxed">
              {{ project.shortDescription || project.tagline || 'No description' }}
            </p>
          </div>
          
          <!-- Footer Section - Fixed at bottom -->
          <div class="flex-shrink-0 space-y-3 pt-4 border-t border-white/10 dark:border-slate-700/50">
            <div class="flex items-center justify-between text-xs text-white/60 dark:text-slate-500 transition-colors">
              <span>Created: {{ new Date(project.createdAt).toLocaleDateString() }}</span>
            </div>
            
            <div class="flex gap-2" @click.stop>
              <router-link
                :to="`/admin/projects/${project.id}/edit`"
                class="flex-1 btn-glass px-4 py-2 rounded-xl text-xs font-semibold text-center transition-all"
                @click.stop
              >
                Edit
              </router-link>
              <button
                @click.stop="handleDelete(project.id)"
                class="flex-1 btn-glass px-4 py-2 rounded-xl text-xs font-semibold text-red-200 dark:text-red-300 hover:text-red-100 dark:hover:text-red-200 transition-all"
                :disabled="deleting === project.id"
              >
                {{ deleting === project.id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Project Details Modal -->
      <transition name="modal-fade">
        <div
          v-if="selectedProject"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          @click.self="closeModal"
          @keyup.escape="closeModal"
        >
          <div class="glass-card rounded-3xl shadow-xl max-w-4xl w-full my-8 p-8 transform transition-all">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <h2 class="text-3xl font-bold text-white dark:text-slate-200 mb-2 transition-colors flex items-center gap-2">
                  {{ selectedProject.name }}
                  <span v-if="selectedProject.nsfw" class="text-red-300" title="NSFW Content">⚠️</span>
                </h2>
                <div class="flex items-center gap-3 flex-wrap">
                  <span
                    :class="{
                      'glass-strong text-green-200 dark:text-green-300': selectedProject.status === 'live',
                      'glass-strong text-yellow-200 dark:text-yellow-300': selectedProject.status === 'prototype',
                      'glass-strong text-white/80 dark:text-gray-300': selectedProject.status === 'archived'
                    }"
                    class="px-3 py-1 text-sm font-semibold rounded transition-colors"
                  >
                    {{ selectedProject.status }}
                  </span>
                  <span
                    v-if="selectedProject.nsfw"
                    class="px-3 py-1 text-sm font-semibold rounded glass-strong text-red-200 dark:text-red-300 border border-red-400/30 dark:border-red-700/50 transition-colors"
                  >
                    NSFW
                  </span>
                  <span
                    v-if="selectedProject.inPortfolio"
                    class="px-3 py-1 text-sm font-semibold rounded glass-strong text-blue-200 dark:text-blue-300 transition-colors"
                  >
                    In Portfolio
                  </span>
                </div>
              </div>
              <button
                @click="closeModal"
                class="btn-glass p-2 rounded-xl transition-all"
                title="Close"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto scrollbar-thin pr-2">
              <!-- Basic Info -->
              <div class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-4 transition-colors">Basic Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-white/60 dark:text-slate-400 transition-colors">ID:</span>
                    <span class="ml-2 text-white dark:text-slate-200 font-mono transition-colors">{{ selectedProject.id }}</span>
                  </div>
                  <div>
                    <span class="text-white/60 dark:text-slate-400 transition-colors">Slug:</span>
                    <span class="ml-2 text-white dark:text-slate-200 font-mono transition-colors">{{ selectedProject.slug }}</span>
                  </div>
                  <div>
                    <span class="text-white/60 dark:text-slate-400 transition-colors">Created:</span>
                    <span class="ml-2 text-white dark:text-slate-200 transition-colors">{{ new Date(selectedProject.createdAt).toLocaleString() }}</span>
                  </div>
                  <div>
                    <span class="text-white/60 dark:text-slate-400 transition-colors">Updated:</span>
                    <span class="ml-2 text-white dark:text-slate-200 transition-colors">{{ new Date(selectedProject.updatedAt).toLocaleString() }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Tagline & Descriptions -->
              <div v-if="selectedProject.tagline" class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-2 transition-colors">Tagline</h3>
                <p class="text-white/90 dark:text-slate-300 transition-colors">{{ selectedProject.tagline }}</p>
              </div>
              
              <div v-if="selectedProject.shortDescription" class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-2 transition-colors">Short Description</h3>
                <p class="text-white/90 dark:text-slate-300 transition-colors">{{ selectedProject.shortDescription }}</p>
              </div>
              
              <div v-if="selectedProject.longDescription" class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-2 transition-colors">Long Description</h3>
                <div class="text-white/90 dark:text-slate-300 whitespace-pre-wrap transition-colors">
                  {{ parseLongDescription(selectedProject.longDescription) }}
                </div>
              </div>
              
              <!-- URLs -->
              <div v-if="selectedProject.primaryRepoUrl || selectedProject.liveUrl || selectedProject.githubRepoFullName" class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-4 transition-colors">Links</h3>
                <div class="space-y-2">
                  <div v-if="selectedProject.primaryRepoUrl" class="flex items-center gap-2">
                    <span class="text-white/60 dark:text-slate-400 text-sm transition-colors">Primary Repo:</span>
                    <a :href="selectedProject.primaryRepoUrl" target="_blank" rel="noopener noreferrer" class="text-blue-300 dark:text-blue-400 hover:underline text-sm transition-colors">
                      {{ selectedProject.primaryRepoUrl }}
                    </a>
                  </div>
                  <div v-if="selectedProject.liveUrl" class="flex items-center gap-2">
                    <span class="text-white/60 dark:text-slate-400 text-sm transition-colors">Live URL:</span>
                    <a :href="selectedProject.liveUrl" target="_blank" rel="noopener noreferrer" class="text-blue-300 dark:text-blue-400 hover:underline text-sm transition-colors">
                      {{ selectedProject.liveUrl }}
                    </a>
                  </div>
                  <div v-if="selectedProject.githubRepoFullName" class="flex items-center gap-2">
                    <span class="text-white/60 dark:text-slate-400 text-sm transition-colors">GitHub Repo:</span>
                    <span class="text-white dark:text-slate-200 font-mono text-sm transition-colors">{{ selectedProject.githubRepoFullName }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Partitions -->
              <div v-if="projectDetail && projectDetail.projectPartitions && projectDetail.projectPartitions.length > 0" class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-4 transition-colors">Partitions</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="pp in projectDetail.projectPartitions"
                    :key="pp.partitionId"
                    class="px-3 py-1 rounded-lg glass text-white/90 dark:text-slate-200 text-sm transition-colors"
                  >
                    {{ getPartitionName(pp.partitionId) }}
                    <span v-if="pp.isFeatured" class="ml-2 text-yellow-300">⭐</span>
                    <span class="ml-2 text-white/60 dark:text-slate-400">(Order: {{ pp.sortOrder }})</span>
                  </span>
                </div>
              </div>
              
              <!-- Ports -->
              <div class="glass-strong rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white dark:text-slate-200 mb-4 transition-colors">Assigned Ports</h3>
                <div v-if="getProjectPorts(selectedProject.id).length > 0" class="space-y-3">
                  <div
                    v-for="port in getProjectPorts(selectedProject.id)"
                    :key="port.id"
                    class="glass rounded-xl p-4 border border-white/10 dark:border-slate-700/50"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-3">
                        <span class="text-lg font-bold text-white dark:text-slate-200 transition-colors">
                          Port {{ port.portNumber }}
                        </span>
                        <span
                          :class="{
                            'px-2 py-1 text-xs font-semibold rounded glass-strong': true,
                            'text-green-200 dark:text-green-300': port.serverType === 'frontend',
                            'text-blue-200 dark:text-blue-300': port.serverType === 'backend',
                            'text-purple-200 dark:text-purple-300': port.serverType === 'api'
                          }"
                        >
                          {{ port.serverType }}
                        </span>
                      </div>
                      <span
                        :class="port.inUse ? 'text-green-300 dark:text-green-400' : 'text-red-300 dark:text-red-400'"
                        class="text-sm font-medium"
                      >
                        {{ port.inUse ? (port.pid ? `ACTIVE (PID: ${port.pid})` : 'ACTIVE') : 'INACTIVE' }}
                      </span>
                    </div>
                    <div v-if="port.description" class="text-sm text-white/70 dark:text-slate-400 mt-2 transition-colors">
                      {{ port.description }}
                    </div>
                    <div class="flex gap-2 mt-3">
                      <router-link
                        :to="`/admin/ports/${port.id}/edit`"
                        class="btn-glass px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        @click.stop
                      >
                        Edit Port
                      </router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                  <svg 
                    class="w-24 h-24 text-white/20 dark:text-slate-600 mb-4 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="1.5" 
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                  <p class="text-white/50 dark:text-slate-500 text-sm transition-colors">No ports assigned to this project</p>
                  <router-link
                    to="/admin/ports/new"
                    class="btn-glass px-4 py-2 rounded-xl text-xs font-semibold mt-4 transition-all"
                    @click.stop
                  >
                    Assign a Port
                  </router-link>
                </div>
              </div>
            </div>
            
            <div class="flex gap-4 mt-6 pt-6 border-t border-white/10 dark:border-slate-700/50">
              <router-link
                :to="`/admin/projects/${selectedProject.id}/edit`"
                class="flex-1 btn-glass px-6 py-3 rounded-xl font-semibold text-center transition-all"
                @click="closeModal"
              >
                Edit Project
              </router-link>
              <button
                @click="handleDelete(selectedProject.id); closeModal()"
                class="flex-1 btn-glass px-6 py-3 rounded-xl font-semibold text-red-200 dark:text-red-300 hover:text-red-100 dark:hover:text-red-200 transition-all"
                :disabled="deleting === selectedProject.id"
              >
                {{ deleting === selectedProject.id ? 'Deleting...' : 'Delete Project' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore, type Project, type ProjectDetail } from '../../stores/portfolio'

const router = useRouter()
const store = usePortfolioStore()
const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const deleting = ref<string | null>(null)
const selectedProject = ref<Project | null>(null)
const projectDetail = ref<ProjectDetail | null>(null)
const loadingDetail = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // Load projects first, then partitions and ports in parallel (non-blocking)
    const projectsData = await store.fetchProjects()
    projects.value = Array.isArray(projectsData) ? projectsData : []
    console.log('Loaded projects:', projects.value.length)
    
    // Load partitions and ports in parallel, but don't fail if they error
    Promise.all([
      store.fetchPartitions().catch(err => console.warn('Failed to load partitions:', err)),
      store.fetchPorts().catch(err => console.warn('Failed to load ports:', err))
    ]).catch(() => {
      // Silently handle errors for partitions/ports
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load projects'
    console.error('Error loading projects:', err)
    projects.value = []
  } finally {
    loading.value = false
  }
})

async function openModal(project: Project) {
  selectedProject.value = project
  loadingDetail.value = true
  
  try {
    // Try to fetch full project details by slug
    const detail = await store.fetchProjectBySlug(project.slug)
    if (detail) {
      projectDetail.value = detail
    } else {
      // If fetchProjectBySlug doesn't work, use the basic project data
      projectDetail.value = null
    }
  } catch (err) {
    console.error('Failed to load project details:', err)
    projectDetail.value = null
  } finally {
    loadingDetail.value = false
  }
}

function closeModal() {
  selectedProject.value = null
  projectDetail.value = null
}

function parseLongDescription(description: string): string {
  try {
    const parsed = JSON.parse(description)
    if (parsed.description) {
      return parsed.description
    }
  } catch {
    // Not JSON, return as-is
  }
  return description
}

function getPartitionName(partitionId: string): string {
  const partition = store.partitions.find(p => p.id === partitionId)
  return partition ? partition.name : partitionId
}

function getProjectPorts(projectId: string) {
  // Ports are linked to projects via the port.name field
  // New format: port.name === projectId (direct match)
  // Legacy format: port.name === "project-slug Backend" or "project-slug Frontend"
  // We need to check both formats
  const project = projects.value.find(p => p.id === projectId)
  if (!project) return []
  
  return store.ports.filter(port => {
    if (!port.name) return false
    
    // New format: direct match with project ID
    if (port.name === projectId) return true
    
    // Legacy format: "project-slug Backend" or "project-slug Frontend"
    // Check if port name starts with project slug or project ID
    const parts = port.name.split(' ')
    if (parts.length >= 2) {
      const projectIdentifier = parts.slice(0, -1).join(' ') // Everything except last word
      if (projectIdentifier === project.slug || projectIdentifier === project.id) {
        return true
      }
    }
    
    // Also check direct slug/id match
    if (port.name === project.slug || port.name === project.id) {
      return true
    }
    
    return false
  })
}

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this project? This will also delete all associated project-partition relationships.')) {
    return
  }

  deleting.value = id
  try {
    await store.deleteProject(id)
    projects.value = projects.value.filter(p => p.id !== id)
    if (selectedProject.value?.id === id) {
      closeModal()
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete project')
  } finally {
    deleting.value = null
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .glass-card,
.modal-fade-leave-active .glass-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .glass-card,
.modal-fade-leave-to .glass-card {
  transform: scale(0.95);
  opacity: 0;
}
</style>

