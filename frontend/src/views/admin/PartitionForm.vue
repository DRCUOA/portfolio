<template>
  <div class="relative min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8 fade-in-up">
        <router-link 
          to="/admin/partitions" 
          class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-6 inline-flex items-center gap-2"
        >
          <span>←</span> Back to Partitions
        </router-link>
        <h1 class="text-4xl md:text-5xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">
          {{ isEdit ? 'Edit Partition' : 'Create New Partition' }}
        </h1>
      </div>

      <div v-if="store.loading && !isEdit" class="text-center py-12 glass-card rounded-3xl p-8">
        <p class="text-white/80 dark:text-slate-400">Loading...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="glass-card rounded-3xl p-8 animate-fade-in-up">
        <div class="mb-6">
          <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
            ID <span class="text-red-400 dark:text-red-400">*</span>
          </label>
          <input
            v-model="form.id"
            type="text"
            required
            :disabled="isEdit"
            class="w-full px-4 py-3 rounded-xl glass-input transition-colors"
            placeholder="e.g., showcase-main"
          />
          <p class="mt-1 text-sm text-white/70 dark:text-slate-400 transition-colors">Unique identifier (cannot be changed after creation)</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
            Slug <span class="text-red-400 dark:text-red-400">*</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            required
            :disabled="isEdit"
            class="w-full px-4 py-3 rounded-xl glass-input transition-colors"
            placeholder="e.g., showcase-main"
          />
          <p class="mt-1 text-sm text-white/70 dark:text-slate-400 transition-colors">URL-friendly identifier (cannot be changed after creation)</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
            Name <span class="text-red-400 dark:text-red-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-3 rounded-xl glass-input transition-colors"
            placeholder="e.g., Main Showcase"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-4 py-3 rounded-xl glass-input transition-colors resize-y"
            placeholder="Description of this partition"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-white dark:text-slate-300 mb-2 transition-colors">
            Sort Order <span class="text-red-400 dark:text-red-400">*</span>
          </label>
          <input
            v-model.number="form.sortOrder"
            type="number"
            required
            min="0"
            class="w-full px-4 py-3 rounded-xl glass-input transition-colors"
            placeholder="1"
          />
        </div>

        <div v-if="error" class="mb-6 glass-strong rounded-xl border-red-400/30 text-red-200 dark:text-red-300 px-4 py-3 transition-colors">
          <p>{{ error }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            :disabled="store.loading"
            class="btn-glass px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all"
          >
            {{ store.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
          <router-link
            to="/admin/partitions"
            class="btn-glass px-6 py-3 rounded-xl font-semibold text-center transition-all"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore, type CreatePartitionInput, type UpdatePartitionInput } from '../../stores/portfolio'

const route = useRoute()
const router = useRouter()
const store = usePortfolioStore()

const isEdit = route.name === 'edit-partition'
const partitionId = route.params.id as string

const form = ref<CreatePartitionInput>({
  id: '',
  slug: '',
  name: '',
  description: '',
  sortOrder: 1,
})

const error = ref<string | null>(null)

onMounted(async () => {
  if (isEdit) {
    await store.fetchPartitions()
    const partition = store.partitions.find(p => p.id === partitionId)
    if (partition) {
      form.value = {
        id: partition.id,
        slug: partition.slug,
        name: partition.name,
        description: partition.description,
        sortOrder: partition.sortOrder,
      }
    }
  }
})

async function handleSubmit() {
  error.value = null
  try {
    if (isEdit) {
      const updateData: UpdatePartitionInput = {
        name: form.value.name,
        description: form.value.description,
        sortOrder: form.value.sortOrder,
      }
      await store.updatePartition(partitionId, updateData)
    } else {
      await store.createPartition(form.value)
    }
    router.push('/admin/partitions')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save partition'
  }
}
</script>

