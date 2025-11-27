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
  nsfw: boolean
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

  // Upload screenshot
  async function uploadScreenshot(file: File, projectSlug?: string): Promise<string> {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('image', file)
      if (projectSlug) {
        formData.append('projectSlug', projectSlug)
      }

      const response = await fetch(`${API_BASE_URL}/upload/screenshot`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to upload screenshot')
      }

      const result = await response.json()
      return result.path
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete screenshot
  async function deleteScreenshot(filePath: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/upload/screenshot`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to delete screenshot')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Port Management
  const ports = ref<Port[]>([])

  async function fetchPorts() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/ports`)
      if (!response.ok) throw new Error('Failed to fetch ports')
      ports.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching ports:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPortsByType(serverType: ServerType) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/ports/type/${serverType}`)
      if (!response.ok) throw new Error('Failed to fetch ports')
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching ports by type:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function createPort(data: CreatePortInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/ports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create port')
      }
      const result = await response.json()
      await fetchPorts()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePort(id: string, data: UpdatePortInput) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/ports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update port')
      }
      const result = await response.json()
      await fetchPorts()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePort(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/ports/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to delete port')
      }
      await fetchPorts()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Traffic Logging
  async function logClick(portId: string | null, metadata?: Record<string, any>) {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portId, metadata }),
      })
      if (!response.ok) {
        // Don't throw - logging failures shouldn't break the app
        console.warn('Failed to log click')
      }
    } catch (err) {
      // Silently fail - logging shouldn't break user experience
      console.warn('Error logging click:', err)
    }
  }

  async function fetchTrafficStats(portId?: string): Promise<TrafficStats | TrafficStats[]> {
    loading.value = true
    error.value = null
    try {
      const url = portId 
        ? `${API_BASE_URL}/traffic/stats?portId=${portId}`
        : `${API_BASE_URL}/traffic/stats`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch traffic stats')
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching traffic stats:', err)
      return portId ? {
        portId: null,
        portName: null,
        totalClicks: 0,
        totalDataTransferMB: 0,
        clickCount: 0,
        dataTransferCount: 0,
        lastActivity: null,
      } : []
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
    uploadScreenshot,
    deleteScreenshot,
    ports,
    fetchPorts,
    fetchPortsByType,
    createPort,
    updatePort,
    deletePort,
    logClick,
    fetchTrafficStats,
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
  logoUrl?: string
  inPortfolio?: boolean
  nsfw?: boolean
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
  logoUrl?: string
  inPortfolio?: boolean
  nsfw?: boolean
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

export type ServerType = 'frontend' | 'backend' | 'api'

export interface TrafficLog {
  id: string
  portId: string | null
  eventType: 'click' | 'data_transfer'
  amount: number
  metadata: Record<string, any> | null
  createdAt: string
}

export interface TrafficStats {
  portId: string | null
  portName: string | null
  totalClicks: number
  totalDataTransferMB: number
  clickCount: number
  dataTransferCount: number
  lastActivity: string | null
}

export interface Port {
  id: string
  portNumber: number
  serverType: ServerType
  name: string
  description: string
  createdAt: string
  updatedAt: string
  inUse?: boolean
  pid?: number
}

export interface CreatePortInput {
  id: string
  portNumber: number
  serverType: ServerType
  name?: string
  description?: string
}

export interface UpdatePortInput {
  portNumber?: number
  serverType?: ServerType
  name?: string
  description?: string
}

