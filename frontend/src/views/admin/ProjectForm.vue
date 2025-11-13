<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">
          {{ isEdit ? 'Edit Project' : 'Create New Project' }}
        </h1>
        <router-link to="/admin/projects" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Projects</router-link>
      </div>

      <div v-if="loading && isEdit" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-400">Loading...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-8 transition-colors">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ID <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.id"
              type="text"
              required
              :disabled="isEdit"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-100 dark:disabled:bg-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
              placeholder="e.g., my-project"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Slug <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.slug"
              type="text"
              required
              :disabled="isEdit"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-100 dark:disabled:bg-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
              placeholder="e.g., my-project"
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="Project Name"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
          <input
            v-model="form.tagline"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="Short tagline"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <textarea
            v-model="form.shortDescription"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="Brief description"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
          <textarea
            v-model="form.longDescription"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="Detailed description"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Screenshots (for App Store View)
          </label>
          
          <!-- File Upload Section -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div class="flex items-center gap-4">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleFileSelect"
                class="hidden"
              />
              <button
                type="button"
                @click="fileInput?.click()"
                :disabled="uploading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ uploading ? 'Uploading...' : 'Choose Files' }}
              </button>
              <span v-if="uploading" class="text-sm text-gray-600">
                Uploading {{ uploadProgress }}...
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Select one or more image files to upload. Files will be organized by project slug.
            </p>
          </div>

          <!-- Screenshot Previews -->
          <div v-if="screenshotPreviews.length > 0" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Uploaded Screenshots
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(screenshot, index) in screenshotPreviews"
                :key="index"
                class="relative group"
              >
                <img
                  :src="getScreenshotUrl(screenshot)"
                  :alt="`Screenshot ${index + 1}`"
                  class="w-full h-32 object-cover rounded-md border border-gray-300"
                  @error="handleImageError"
                />
                <button
                  type="button"
                  @click="removeScreenshot(index)"
                  class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove screenshot"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Manual URL Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Or Enter URLs Manually
            </label>
            <textarea
              v-model="screenshotsInput"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter screenshot URLs or local paths, one per line:&#10;&#10;Local paths:&#10;/screenshots/project-name/img1.png&#10;&#10;Remote URLs:&#10;https://example.com/screenshot1.png"
            />
            <p class="mt-1 text-sm text-gray-500">
              Enter image URLs or paths, one per line. Uploaded images above will be added automatically.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            >
              <option value="live">Live</option>
              <option value="prototype">Prototype</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">In Portfolio</label>
            <select
              v-model="form.inPortfolio"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            >
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>
        </div>

        <div class="mb-6 p-4 rounded-lg border-2" :class="form.nsfw ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700'">
          <label class="flex items-start gap-4 cursor-pointer">
            <div class="flex-shrink-0 mt-1">
              <input
                v-model="form.nsfw"
                type="checkbox"
                class="h-6 w-6 text-red-600 dark:text-red-400 focus:ring-red-500 dark:focus:ring-red-400 border-gray-300 dark:border-slate-600 rounded transition-colors cursor-pointer"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-base font-semibold" :class="form.nsfw ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-slate-300'">
                  NSFW Content
                </span>
                <span
                  v-if="form.nsfw"
                  class="px-2 py-0.5 text-xs font-semibold rounded bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                >
                  Active
                </span>
              </div>
              <p class="text-sm" :class="form.nsfw ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-slate-400'">
                Mark this project as containing content that may be offensive or inappropriate for users under 18 or sensitive viewers. When enabled, users will see a warning modal before viewing the project.
              </p>
            </div>
          </label>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Primary Repo URL</label>
          <input
            v-model="form.primaryRepoUrl"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="https://github.com/user/repo"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
          <input
            v-model="form.liveUrl"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="https://example.com"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">GitHub Repo Full Name</label>
          <input
            v-model="form.githubRepoFullName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
            placeholder="user/repo"
          />
        </div>

        <!-- Partition Management -->
        <div class="mb-6 border-t pt-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">
            Partitions
          </label>
          <p class="text-sm text-gray-500 mb-4">Select which partitions this project belongs to:</p>
          
          <div v-if="loadingPartitions" class="text-sm text-gray-500 py-4">
            Loading partitions...
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="partition in availablePartitions"
              :key="partition.id"
              class="flex items-start gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <input
                :id="`partition-${partition.id}`"
                v-model="selectedPartitions"
                type="checkbox"
                :value="partition.id"
                class="mt-1 h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-slate-600 rounded transition-colors"
              />
              <label
                :for="`partition-${partition.id}`"
                class="flex-1 cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-900 dark:text-slate-200">{{ partition.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-slate-400">{{ partition.description || 'No description' }}</div>
                  </div>
                  <div class="text-xs text-gray-400 dark:text-slate-500">#{{ partition.sortOrder }}</div>
                </div>
                
                <!-- Partition Settings (shown when checked) -->
                <div v-if="selectedPartitions.includes(partition.id)" class="mt-3 ml-7 space-y-2 border-t pt-2">
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <input
                        v-model="partitionSettings[partition.id].isFeatured"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-slate-600 rounded transition-colors"
                      />
                      <span>Featured</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <span>Sort Order:</span>
                      <input
                        v-model.number="partitionSettings[partition.id].sortOrder"
                        type="number"
                        min="1"
                        class="w-20 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
                      />
                    </label>
                  </div>
                </div>
              </label>
            </div>
            
            <div v-if="availablePartitions.length === 0" class="text-sm text-gray-500 dark:text-slate-400 py-4">
              No partitions available. <router-link to="/admin/partitions/new" class="text-blue-600 dark:text-blue-400 hover:underline transition-colors">Create one</router-link>
            </div>
          </div>
        </div>

        <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded transition-colors">
          <p>{{ error }}</p>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="store.loading"
            class="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {{ store.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
          <router-link
            to="/admin/projects"
            class="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore, type CreateProjectInput, type UpdateProjectInput, type ProjectDetail } from '../../stores/portfolio'

const route = useRoute()
const router = useRouter()
const store = usePortfolioStore()

const isEdit = route.name === 'edit-project'
const projectId = route.params.id as string

const form = ref<CreateProjectInput>({
  id: '',
  slug: '',
  name: '',
  tagline: '',
  shortDescription: '',
  longDescription: '',
  status: 'live',
  primaryRepoUrl: '',
  liveUrl: '',
  githubRepoFullName: '',
  inPortfolio: true,
  nsfw: false,
})

const screenshotsInput = ref('')
const loading = ref(false)
const loadingPartitions = ref(false)
const error = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadProgress = ref('')
const screenshotPreviews = ref<string[]>([])

const availablePartitions = ref<Array<{ id: string; name: string; description: string; sortOrder: number }>>([])
const selectedPartitions = ref<string[]>([])
const partitionSettings = ref<Record<string, { isFeatured: boolean; sortOrder: number }>>({})
const currentProjectPartitions = ref<Array<{ partitionId: string; isFeatured: boolean; sortOrder: number }>>([])

onMounted(async () => {
  // Load partitions
  loadingPartitions.value = true
  try {
    await store.fetchPartitions()
    availablePartitions.value = store.partitions.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sortOrder: p.sortOrder,
    }))
    
    // Initialize partition settings
    availablePartitions.value.forEach(partition => {
      partitionSettings.value[partition.id] = {
        isFeatured: false,
        sortOrder: 1,
      }
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load partitions'
  } finally {
    loadingPartitions.value = false
  }
  
  if (isEdit) {
    loading.value = true
    try {
      // Fetch all projects to find by ID
      const projects = await store.fetchProjects()
      const project = projects.find(p => p.id === projectId) as ProjectDetail | undefined
      
      if (project) {
        // Try to extract screenshots from longDescription if it's JSON
        let screenshots: string[] = []
        let description = project.longDescription || ''
        
        try {
          const parsed = JSON.parse(project.longDescription || '{}')
          if (parsed.screenshots && Array.isArray(parsed.screenshots)) {
            screenshots = parsed.screenshots
            description = parsed.description || ''
          }
        } catch {
          // Not JSON, use as-is
        }
        
        screenshotsInput.value = screenshots.join('\n')
        screenshotPreviews.value = screenshots
        
        form.value = {
          id: project.id,
          slug: project.slug,
          name: project.name,
          tagline: project.tagline,
          shortDescription: project.shortDescription,
          longDescription: description,
          status: project.status,
          primaryRepoUrl: project.primaryRepoUrl,
          liveUrl: project.liveUrl,
          githubRepoFullName: project.githubRepoFullName,
          inPortfolio: project.inPortfolio,
          nsfw: project.nsfw || false,
        }
        
        // Load current project partitions
        if (project.projectPartitions) {
          currentProjectPartitions.value = project.projectPartitions
          selectedPartitions.value = project.projectPartitions.map(pp => pp.partitionId)
          
          // Set partition settings from current data
          project.projectPartitions.forEach(pp => {
            partitionSettings.value[pp.partitionId] = {
              isFeatured: pp.isFeatured,
              sortOrder: pp.sortOrder,
            }
          })
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load project'
    } finally {
      loading.value = false
    }
  }
})

// Sync screenshotPreviews with screenshotsInput
watch(screenshotsInput, (newValue) => {
  const screenshots = newValue
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)
  
  // Only update previews if they're different (to avoid loops)
  const currentPreviews = screenshotPreviews.value.join('\n')
  const newPreviews = screenshots.join('\n')
  if (currentPreviews !== newPreviews) {
    screenshotPreviews.value = screenshots
  }
})

// Initialize default settings when a partition is selected
watch(selectedPartitions, (newSelection) => {
  // For newly selected partitions, initialize default settings if not already set
  newSelection.forEach(partitionId => {
    if (!partitionSettings.value[partitionId]) {
      partitionSettings.value[partitionId] = {
        isFeatured: false,
        sortOrder: newSelection.length,
      }
    }
  })
}, { deep: true })

// Handle file selection and upload
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  uploading.value = true
  uploadProgress.value = ''
  
  try {
    const uploadedPaths: string[] = []
    const projectSlug = form.value.slug || 'uploads'
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      uploadProgress.value = `${i + 1}/${files.length}`
      
      try {
        const path = await store.uploadScreenshot(file, projectSlug)
        uploadedPaths.push(path)
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err)
        error.value = `Failed to upload ${file.name}. ${err instanceof Error ? err.message : 'Unknown error'}`
      }
    }
    
    // Add uploaded paths to screenshots
    const currentScreenshots = screenshotPreviews.value
    const allScreenshots = [...currentScreenshots, ...uploadedPaths]
    screenshotPreviews.value = allScreenshots
    screenshotsInput.value = allScreenshots.join('\n')
    
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to upload files'
  } finally {
    uploading.value = false
    uploadProgress.value = ''
  }
}

// Get full URL for screenshot display
function getScreenshotUrl(path: string): string {
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If it starts with /, it's a local path
  // In development, Vite serves files from public folder, so relative paths work
  // In production, we may need to construct full URLs
  if (path.startsWith('/')) {
    // Check if we're in development (Vite serves public folder)
    if (import.meta.env.DEV) {
      // In development, Vite serves /screenshots/ directly from public folder
      return path
    } else {
      // In production, construct URL using API base (backend serves static files)
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const baseUrl = apiBase.replace('/api', '')
      return `${baseUrl}${path}`
    }
  }
  
  // Otherwise, prepend / and use relative path
  return `/${path}`
}

// Remove screenshot from list
function removeScreenshot(index: number) {
  const screenshot = screenshotPreviews.value[index]
  
  // If it's an uploaded file (starts with /screenshots/), try to delete it
  if (screenshot.startsWith('/screenshots/')) {
    store.deleteScreenshot(screenshot).catch(err => {
      console.error('Failed to delete file:', err)
      // Continue with removal from UI even if server deletion fails
    })
  }
  
  screenshotPreviews.value.splice(index, 1)
  screenshotsInput.value = screenshotPreviews.value.join('\n')
}

// Handle image load errors
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// Helper to normalize screenshot paths - ensure we store relative paths, not full URLs
function normalizeScreenshotPath(path: string): string {
  // If it's a full URL, extract just the path part
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path)
      return url.pathname
    } catch {
      // If URL parsing fails, return as-is
      return path
    }
  }
  // If it's already a relative path, return as-is
  return path
}

async function handleSubmit() {
  error.value = null
  try {
    // Use screenshotPreviews if available, otherwise parse from input
    const screenshots = screenshotPreviews.value.length > 0
      ? screenshotPreviews.value
      : screenshotsInput.value
          .split('\n')
          .map(url => url.trim())
          .filter(url => url.length > 0)
    
    // Normalize all screenshot paths to ensure we store relative paths, not full URLs
    const normalizedScreenshots = screenshots.map(normalizeScreenshotPath)
    
    // Combine description and screenshots into JSON if screenshots exist
    let longDescription = form.value.longDescription
    if (normalizedScreenshots.length > 0) {
      longDescription = JSON.stringify({
        description: form.value.longDescription,
        screenshots: normalizedScreenshots
      })
    }
    
    let savedProjectId = projectId
    
    if (isEdit) {
      const updateData: UpdateProjectInput = {
        name: form.value.name,
        tagline: form.value.tagline,
        shortDescription: form.value.shortDescription,
        longDescription: longDescription,
        status: form.value.status,
        primaryRepoUrl: form.value.primaryRepoUrl,
        liveUrl: form.value.liveUrl,
        githubRepoFullName: form.value.githubRepoFullName,
        inPortfolio: form.value.inPortfolio,
        nsfw: form.value.nsfw,
      }
      await store.updateProject(projectId, updateData)
      savedProjectId = projectId
    } else {
      const projectData: CreateProjectInput = {
        ...form.value,
        longDescription: longDescription,
      }
      const created = await store.createProject(projectData)
      savedProjectId = created.id
    }
    
    // Sync partition relationships
    if (savedProjectId) {
      // Get current partitions for this project
      const currentPartitionIds = new Set(currentProjectPartitions.value.map(pp => pp.partitionId))
      const newPartitionIds = new Set(selectedPartitions.value)
      
      // Remove partitions that are no longer selected
      for (const partitionId of currentPartitionIds) {
        if (!newPartitionIds.has(partitionId)) {
          try {
            await store.deleteProjectPartition(savedProjectId, partitionId)
          } catch (err) {
            console.error(`Failed to remove project from partition ${partitionId}:`, err)
          }
        }
      }
      
      // Add or update partitions that are selected
      for (const partitionId of selectedPartitions.value) {
        const settings = partitionSettings.value[partitionId] || { isFeatured: false, sortOrder: 1 }
        
        if (currentPartitionIds.has(partitionId)) {
          // Update existing relationship
          try {
            await store.updateProjectPartition(savedProjectId, partitionId, {
              isFeatured: settings.isFeatured,
              sortOrder: settings.sortOrder,
            })
          } catch (err) {
            console.error(`Failed to update project partition ${partitionId}:`, err)
          }
        } else {
          // Create new relationship
          try {
            await store.createProjectPartition({
              projectId: savedProjectId,
              partitionId: partitionId,
              isFeatured: settings.isFeatured,
              sortOrder: settings.sortOrder,
            })
          } catch (err) {
            console.error(`Failed to add project to partition ${partitionId}:`, err)
          }
        }
      }
    }
    
    router.push('/admin/projects')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save project'
  }
}
</script>

