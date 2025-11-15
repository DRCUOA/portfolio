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
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Project Logo
          </label>
          
          <!-- Logo Preview -->
          <div v-if="logoPreview" class="mb-4">
            <div class="relative inline-block">
              <img
                :src="logoPreview"
                alt="Logo preview"
                class="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-2 border-gray-300 dark:border-slate-600"
              />
              <button
                type="button"
                @click="removeLogo"
                class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                title="Remove logo"
              >
                ×
              </button>
            </div>
          </div>
          
          <!-- Logo Upload -->
          <div class="flex items-center gap-4">
            <input
              ref="logoInput"
              type="file"
              accept="image/*"
              @change="handleLogoSelect"
              class="hidden"
            />
            <button
              type="button"
              @click="logoInput?.click()"
              :disabled="uploadingLogo"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ uploadingLogo ? 'Uploading...' : (logoPreview ? 'Change Logo' : 'Upload Logo') }}
            </button>
            <span v-if="uploadingLogo" class="text-sm text-gray-600 dark:text-slate-400">
              Uploading...
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Upload a logo image for this project. Recommended size: 512x512px or larger, square format.
          </p>
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
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Uploaded Screenshots (drag to reorder)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(screenshot, index) in screenshotPreviews"
                :key="`screenshot-${screenshot.url}-${index}`"
                :draggable="true"
                @dragstart="handleDragStart(index, $event)"
                @dragover.prevent="handleDragOver(index, $event)"
                @drop="handleDrop(index, $event)"
                @dragend="handleDragEnd"
                :class="[
                  'relative group cursor-move bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden border-2 transition-all',
                  draggedIndex === index ? 'opacity-50 border-blue-500' : 'border-gray-300 dark:border-slate-600'
                ]"
              >
                <div class="aspect-video w-full" style="min-height: 200px;">
                  <img
                    :src="getScreenshotUrl(screenshot.url)"
                    :alt="screenshot.label || `Screenshot ${index + 1}`"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                    draggable="false"
                  />
                </div>
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div class="flex flex-col gap-2 pointer-events-auto">
                    <button
                      type="button"
                      @click.stop.prevent="openLabelModal(index)"
                      @mousedown.stop
                      class="bg-blue-600 text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                      title="Add/Edit label"
                    >
                      {{ screenshot.label ? 'Edit Label' : 'Add Label' }}
                    </button>
                    <button
                      type="button"
                      @click.stop.prevent="removeScreenshot(index)"
                      @mousedown.stop
                      class="bg-red-600 text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
                      title="Remove screenshot"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div v-if="screenshot.label" class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 truncate">
                  {{ screenshot.label }}
                </div>
                <div class="absolute top-2 left-2 bg-gray-900/90 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg">
                  {{ index + 1 }}
                </div>
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
    
    <!-- Label Modal -->
    <transition name="modal-fade">
      <div
        v-if="labelModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeLabelModal"
        @keyup.escape="closeLabelModal"
      >
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
            {{ labelModalIndex >= 0 && labelModalIndex < screenshotPreviews.length && screenshotPreviews[labelModalIndex]?.label ? 'Edit Label' : 'Add Label' }}
          </h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Label (optional)
            </label>
            <input
              ref="labelInput"
              v-model="labelModalValue"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 transition-colors"
              placeholder="Enter a descriptive label for this screenshot"
              @keyup.enter="saveLabel"
              @keyup.escape="closeLabelModal"
            />
          </div>
          <div class="flex gap-3 justify-end">
            <button
              type="button"
              @click="closeLabelModal"
              class="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="saveLabel"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </transition>
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
  logoUrl: '',
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
const screenshotPreviews = ref<Array<{ url: string; label: string }>>([])

// Logo upload state
const logoInput = ref<HTMLInputElement | null>(null)
const uploadingLogo = ref(false)
const logoPreview = ref<string | null>(null)

// Label modal state
const labelModalOpen = ref(false)
const labelModalIndex = ref(-1)
const labelModalValue = ref('')
const draggedIndex = ref<number | null>(null)
const labelInput = ref<HTMLInputElement | null>(null)

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
        let screenshots: Array<string | { url: string; label?: string }> = []
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
        
        // Convert screenshots to array of objects with url and label
        screenshotPreviews.value = screenshots.map((screenshot: string | { url: string; label?: string }) => {
          if (typeof screenshot === 'string') {
            return { url: screenshot, label: '' }
          }
          return { url: screenshot.url, label: screenshot.label || '' }
        })
        
        screenshotsInput.value = screenshotPreviews.value.map(s => s.url).join('\n')
        
        // Load logo if available
        if (project.logoUrl) {
          logoPreview.value = getScreenshotUrl(project.logoUrl)
          form.value.logoUrl = project.logoUrl
        }
        
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
          logoUrl: project.logoUrl || '',
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
  const currentUrls = screenshotPreviews.value.map(s => s.url).join('\n')
  const newUrls = screenshots.join('\n')
  if (currentUrls !== newUrls) {
    // Preserve labels when updating from input
    const urlToLabel = new Map(screenshotPreviews.value.map(s => [s.url, s.label]))
    screenshotPreviews.value = screenshots.map(url => ({
      url,
      label: urlToLabel.get(url) || ''
    }))
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

// Handle logo upload
async function handleLogoSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  uploadingLogo.value = true
  
  try {
    const projectSlug = form.value.slug || 'uploads'
    const path = await store.uploadScreenshot(file, projectSlug)
    
    // Update form and preview
    form.value.logoUrl = path
    logoPreview.value = getScreenshotUrl(path)
    
    // Reset file input
    if (logoInput.value) {
      logoInput.value.value = ''
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to upload logo'
  } finally {
    uploadingLogo.value = false
  }
}

function removeLogo() {
  const logoUrl = form.value.logoUrl
  
  // If it's an uploaded file (starts with /screenshots/), try to delete it
  if (logoUrl && logoUrl.startsWith('/screenshots/')) {
    store.deleteScreenshot(logoUrl).catch(err => {
      console.error('Failed to delete logo file:', err)
      // Continue with removal from UI even if server deletion fails
    })
  }
  
  form.value.logoUrl = ''
  logoPreview.value = null
  
  // Reset file input
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

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
    const newScreenshots = uploadedPaths.map(url => ({ url, label: '' }))
    const allScreenshots = [...currentScreenshots, ...newScreenshots]
    screenshotPreviews.value = allScreenshots
    screenshotsInput.value = allScreenshots.map(s => s.url).join('\n')
    
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
function getScreenshotUrl(path: string | { url: string; label?: string }): string {
  const url = typeof path === 'string' ? path : path.url
  // If it's already a full URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If it starts with /, it's a local path
  // In development, Vite serves files from public folder, so relative paths work
  // In production, we may need to construct full URLs
  if (url.startsWith('/')) {
    // Check if we're in development (Vite serves public folder)
    if (import.meta.env.DEV) {
      // In development, Vite serves /screenshots/ directly from public folder
      return url
    } else {
      // In production, construct URL using API base (backend serves static files)
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const baseUrl = apiBase.replace('/api', '')
      return `${baseUrl}${url}`
    }
  }
  
  // Otherwise, prepend / and use relative path
  return `/${url}`
}

// Remove screenshot from list
function removeScreenshot(index: number) {
  if (index < 0 || index >= screenshotPreviews.value.length) return
  
  const screenshot = screenshotPreviews.value[index]
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to remove this screenshot?`)) {
    return
  }
  
  // If it's an uploaded file (starts with /screenshots/), try to delete it
  if (screenshot.url.startsWith('/screenshots/')) {
    store.deleteScreenshot(screenshot.url).catch(err => {
      console.error('Failed to delete file:', err)
      // Continue with removal from UI even if server deletion fails
    })
  }
  
  // Create a new array to ensure reactivity
  const newScreenshots = [...screenshotPreviews.value]
  newScreenshots.splice(index, 1)
  screenshotPreviews.value = newScreenshots
  screenshotsInput.value = screenshotPreviews.value.map(s => s.url).join('\n')
  
  // Close label modal if it was open for this screenshot
  if (labelModalIndex.value === index) {
    closeLabelModal()
  } else if (labelModalIndex.value > index) {
    // Adjust modal index if a screenshot before it was removed
    labelModalIndex.value--
  }
}

// Drag and drop handlers
function handleDragStart(index: number, event: DragEvent) {
  // Don't start drag if clicking on buttons
  const target = event.target as HTMLElement
  if (target.closest('button')) {
    event.preventDefault()
    return
  }
  
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
    // Create a drag image
    const dragElement = event.currentTarget as HTMLElement
    if (dragElement) {
      const rect = dragElement.getBoundingClientRect()
      event.dataTransfer.setDragImage(dragElement, rect.width / 2, rect.height / 2)
    }
  }
}

function handleDragOver(index: number, event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (event.dataTransfer && draggedIndex.value !== null && draggedIndex.value !== index) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function handleDrop(index: number, event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  if (draggedIndex.value === null || draggedIndex.value === index) {
    draggedIndex.value = null
    return
  }
  
  // Create a copy of the array to avoid reactivity issues
  const newScreenshots = [...screenshotPreviews.value]
  const draggedItem = newScreenshots[draggedIndex.value]
  
  // Remove from old position
  newScreenshots.splice(draggedIndex.value, 1)
  
  // Insert at new position
  const insertIndex = draggedIndex.value < index ? index - 1 : index
  newScreenshots.splice(insertIndex, 0, draggedItem)
  
  screenshotPreviews.value = newScreenshots
  screenshotsInput.value = screenshotPreviews.value.map(s => s.url).join('\n')
  draggedIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
}

// Label modal handlers
function openLabelModal(index: number) {
  if (index < 0 || index >= screenshotPreviews.value.length) return
  
  labelModalIndex.value = index
  labelModalValue.value = screenshotPreviews.value[index]?.label || ''
  labelModalOpen.value = true
  
  // Focus input after modal opens
  setTimeout(() => {
    labelInput.value?.focus()
  }, 100)
}

function closeLabelModal() {
  labelModalOpen.value = false
  setTimeout(() => {
    labelModalIndex.value = -1
    labelModalValue.value = ''
  }, 200) // Small delay to allow modal close animation
}

function saveLabel() {
  if (labelModalIndex.value >= 0 && labelModalIndex.value < screenshotPreviews.value.length) {
    // Create a new array to ensure reactivity
    const newScreenshots = [...screenshotPreviews.value]
    newScreenshots[labelModalIndex.value] = {
      ...newScreenshots[labelModalIndex.value],
      label: labelModalValue.value.trim()
    }
    screenshotPreviews.value = newScreenshots
  }
  closeLabelModal()
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
          .map(url => ({ url, label: '' }))
    
    // Normalize all screenshot paths to ensure we store relative paths, not full URLs
    const normalizedScreenshots = screenshots.map(screenshot => {
      const normalizedUrl = normalizeScreenshotPath(screenshot.url)
      // Only include label if it's not empty
      if (screenshot.label && screenshot.label.trim()) {
        return { url: normalizedUrl, label: screenshot.label.trim() }
      }
      return normalizedUrl // Backward compatibility: store as string if no label
    })
    
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
        logoUrl: form.value.logoUrl || undefined,
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

<style scoped>
/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>

