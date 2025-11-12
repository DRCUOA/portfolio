import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export interface Partition {
  id: string
  slug: string
  name: string
  description: string
  sortOrder: number
}

export interface Project {
  id: string
  slug: string
  name: string
  tagline: string
  shortDescription: string
  longDescription: string
  status: string
  primaryRepoUrl: string
  liveUrl: string
  githubRepoFullName: string
  createdAt: string
  updatedAt: string
  inPortfolio: boolean
}

export interface ProjectPartition {
  projectId: string
  partitionId: string
  isFeatured: boolean
  sortOrder: number
}

export interface PartitionDetail extends Partition {
  projects: Project[]
  projectPartitions: ProjectPartition[]
}

export interface ProjectDetail extends Project {
  partitions: Partition[]
  projectPartitions: ProjectPartition[]
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const partitions = ref<Partition[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all partitions
  async function fetchPartitions() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/partitions`)
      if (!response.ok) throw new Error('Failed to fetch partitions')
      partitions.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching partitions:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch partition by slug with projects
  async function fetchPartitionBySlug(slug: string): Promise<PartitionDetail | null> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/partitions/${slug}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Failed to fetch partition')
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching partition:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch project by slug with partitions
  async function fetchProjectBySlug(slug: string): Promise<ProjectDetail | null> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${slug}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Failed to fetch project')
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching project:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch all projects
  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/projects`)
      if (!response.ok) throw new Error('Failed to fetch projects')
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching projects:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // CRUD Operations for Partitions
  async function createPartition(data: CreatePartitionInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/partitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create partition')
      }
      const result = await response.json()
      await fetchPartitions()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePartition(id: string, data: UpdatePartitionInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/partitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update partition')
      }
      const result = await response.json()
      await fetchPartitions()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePartition(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/partitions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to delete partition')
      }
      await fetchPartitions()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // CRUD Operations for Projects
  async function createProject(data: CreateProjectInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create project')
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: string, data: UpdateProjectInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update project')
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to delete project')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // CRUD Operations for Project Partitions
  async function createProjectPartition(data: CreateProjectPartitionInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/project-partitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create project partition')
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProjectPartition(projectId: string, partitionId: string, data: UpdateProjectPartitionInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/project-partitions/${projectId}/${partitionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update project partition')
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProjectPartition(projectId: string, partitionId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/project-partitions/${projectId}/${partitionId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to delete project partition')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    partitions,
    loading,
    error,
    fetchPartitions,
    fetchPartitionBySlug,
    fetchProjectBySlug,
    fetchProjects,
    createPartition,
    updatePartition,
    deletePartition,
    createProject,
    updateProject,
    deleteProject,
    createProjectPartition,
    updateProjectPartition,
    deleteProjectPartition,
  }
})

export interface CreatePartitionInput {
  id: string
  slug: string
  name: string
  description?: string
  sortOrder: number
}

export interface UpdatePartitionInput {
  name?: string
  description?: string
  sortOrder?: number
}

export interface CreateProjectInput {
  id: string
  slug: string
  name: string
  tagline?: string
  shortDescription?: string
  longDescription?: string
  status: string
  primaryRepoUrl?: string
  liveUrl?: string
  githubRepoFullName?: string
  inPortfolio?: boolean
}

export interface UpdateProjectInput {
  name?: string
  tagline?: string
  shortDescription?: string
  longDescription?: string
  status?: string
  primaryRepoUrl?: string
  liveUrl?: string
  githubRepoFullName?: string
  inPortfolio?: boolean
}

export interface CreateProjectPartitionInput {
  projectId: string
  partitionId: string
  isFeatured?: boolean
  sortOrder: number
}

export interface UpdateProjectPartitionInput {
  isFeatured?: boolean
  sortOrder?: number
}

