<template>
  <div class="tv-dashboard min-h-screen relative overflow-hidden">
    <!-- Animated Background -->
    <div class="background-orb-container">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Global HUD -->
    <div class="hud-bar">
      <div class="hud-left">
        <span class="project-title">OMNI-LOCAL // ENV</span>
      </div>
      <div class="hud-center">
        <div class="metric">
          <div class="metric-label">TOTAL CLICKS</div>
          <div class="uptime">{{ totalClicks }}</div>
        </div>
        <div class="metric">
          <div class="metric-label">DATA TRANSFER</div>
          <div class="uptime">{{ totalDataTransferMB.toFixed(2) }} MB</div>
        </div>
        <div class="metric">
          <div class="metric-label">ACTIVE PORTS</div>
          <div class="uptime">{{ activePortsCount }}</div>
        </div>
      </div>
      <div class="hud-right">
        <div class="metric">
          <div class="metric-label">TOTAL PROJECTS</div>
          <div class="uptime">{{ totalProjects }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <div class="back-link">
        <router-link to="/admin" class="back-button">
          ← Back to Dashboard
        </router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="glass-tile">
          <p class="text-white/60">Loading apps...</p>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="glass-tile error">
          <p class="text-red-400">Error: {{ error }}</p>
        </div>
      </div>

          <!-- App Grid -->
      <div v-else class="app-grid">
        <div
          v-for="project in projectsWithPorts"
          :key="project.id"
          :class="[
            'glass-tile',
            { 'focused': focusedApp === project.id, 'error-state': project.hasError }
          ]"
          @click="focusApp(project.id)"
        >
          <!-- Header -->
          <div class="tile-header">
            <div class="tile-icon">
              <span>📦</span>
            </div>
            <div class="tile-title">
              <div class="tile-name">{{ project.name }}</div>
            </div>
          </div>

          <!-- Ports Section -->
          <div class="ports-section">
            <!-- Frontend Port -->
            <div v-if="project.frontend" class="port-row">
              <div class="port-info">
                <span class="port-type frontend">FRONTEND</span>
                <span class="port-number">:{{ project.frontend.portNumber }}</span>
              </div>
              <div :class="['port-status', project.frontend.inUse ? 'status-running' : 'status-idle']"></div>
              <div v-if="project.frontendStats" class="port-stats">
                <span class="stat-item">Clicks: {{ project.frontendStats.totalClicks }}</span>
                <span class="stat-item">Data: {{ project.frontendStats.totalDataTransferMB.toFixed(2) }} MB</span>
              </div>
            </div>

            <!-- Backend Port -->
            <div v-if="project.backend" class="port-row">
              <div class="port-info">
                <span class="port-type backend">BACKEND</span>
                <span class="port-number">:{{ project.backend.portNumber }}</span>
              </div>
              <div :class="['port-status', project.backend.inUse ? 'status-running' : 'status-idle']"></div>
              <div v-if="project.backendStats" class="port-stats">
                <span class="stat-item">Clicks: {{ project.backendStats.totalClicks }}</span>
                <span class="stat-item">Data: {{ project.backendStats.totalDataTransferMB.toFixed(2) }} MB</span>
              </div>
            </div>
          </div>

          <!-- Status Indicator (Glowing Border) -->
          <div :class="['status-indicator', project.status]"></div>

          <!-- Focus Mode Overlay -->
          <div v-if="focusedApp === project.id" class="focus-overlay">
            <div class="focus-content">
              <h3 class="focus-title">{{ project.name }}</h3>
              <div class="focus-details">
                <div v-if="project.frontend" class="focus-port">
                  <h4>Frontend Port: {{ project.frontend.portNumber }}</h4>
                  <p>Status: {{ project.frontend.inUse ? 'In Use' : 'Available' }}</p>
                  <p v-if="project.frontendStats">
                    Total Clicks: {{ project.frontendStats.totalClicks }} | 
                    Data Transfer: {{ project.frontendStats.totalDataTransferMB.toFixed(2) }} MB
                  </p>
                </div>
                <div v-if="project.backend" class="focus-port">
                  <h4>Backend Port: {{ project.backend.portNumber }}</h4>
                  <p>Status: {{ project.backend.inUse ? 'In Use' : 'Available' }}</p>
                  <p v-if="project.backendStats">
                    Total Clicks: {{ project.backendStats.totalClicks }} | 
                    Data Transfer: {{ project.backendStats.totalDataTransferMB.toFixed(2) }} MB
                  </p>
                </div>
              </div>
              <button @click.stop="focusedApp = null" class="focus-close">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePortfolioStore, type TrafficStats } from '../../stores/portfolio'

const store = usePortfolioStore()
const loading = ref(false)
const error = ref<string | null>(null)
const focusedApp = ref<string | null>(null)
const trafficStats = ref<TrafficStats[]>([])

// Extract project name from port name
function extractProjectName(portName: string): string {
  return portName.replace(/\s+(Frontend|Backend|API)$/i, '').trim()
}

// Group ports by project
const projectsWithPorts = computed(() => {
  const projectMap = new Map<string, {
    id: string
    name: string
    frontend: any
    backend: any
    frontendStats: TrafficStats | null
    backendStats: TrafficStats | null
    status: string
    hasError: boolean
  }>()

  store.ports.forEach(port => {
    const projectName = extractProjectName(port.name || port.id)
    
    if (!projectMap.has(projectName)) {
      projectMap.set(projectName, {
        id: projectName,
        name: projectName,
        frontend: null,
        backend: null,
        frontendStats: null,
        backendStats: null,
        status: 'idle',
        hasError: false,
      })
    }

    const project = projectMap.get(projectName)!
    
    if (port.serverType === 'frontend') {
      project.frontend = port
      const stats = trafficStats.value.find(s => s.portId === port.id)
      if (stats) {
        project.frontendStats = stats
      }
    } else if (port.serverType === 'backend' || port.serverType === 'api') {
      project.backend = port
      const stats = trafficStats.value.find(s => s.portId === port.id)
      if (stats) {
        project.backendStats = stats
      }
    }
  })

  return Array.from(projectMap.values()).map(project => {
    // Determine overall status
    const frontendRunning = project.frontend?.inUse
    const backendRunning = project.backend?.inUse
    
    let status = 'idle'
    if (frontendRunning || backendRunning) {
      status = 'running'
    }

    return {
      ...project,
      status,
      hasError: false, // Could be determined by checking for error states
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
})

// HUD Metrics (Live Data)
const totalClicks = computed(() => {
  return trafficStats.value.reduce((sum, stat) => sum + stat.totalClicks, 0)
})

const totalDataTransferMB = computed(() => {
  return trafficStats.value.reduce((sum, stat) => sum + stat.totalDataTransferMB, 0)
})

const activePortsCount = computed(() => {
  return store.ports.filter(p => p.inUse).length
})

const totalProjects = computed(() => {
  return projectsWithPorts.value.length
})

function focusApp(appId: string) {
  focusedApp.value = focusedApp.value === appId ? null : appId
}

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchPorts()
    const stats = await store.fetchTrafficStats() as TrafficStats[]
    trafficStats.value = Array.isArray(stats) ? stats : []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load apps'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tv-dashboard {
  background: #0a0a0f;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', 'Roboto Mono', monospace;
  padding-top: 60px;
}

/* Animated Background Orbs */
.background-orb-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #00ffff, transparent);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ff00ff, transparent);
  top: 60%;
  right: 15%;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #8b00ff, transparent);
  bottom: 20%;
  left: 50%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

/* Global HUD */
.hud-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  backdrop-filter: blur(20px);
  background: rgba(10, 10, 15, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 255, 255, 0.1);
}

.hud-left .project-title {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.8);
}

.hud-center {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cpu-bar {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.cpu-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  transition: width 0.3s ease;
}

.ram-dial {
  position: relative;
  width: 32px;
  height: 32px;
}

.ram-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ram-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.uptime {
  font-size: 0.9rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Roboto Mono', monospace;
}

.sparkline {
  width: 100px;
  height: 20px;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
}

/* Dashboard Content */
.dashboard-content {
  position: relative;
  z-index: 10;
  padding-top: 0;
  padding-bottom: 2rem;
  min-height: calc(100vh - 60px);
}

.back-link {
  padding: 1rem 2rem;
  position: relative;
  z-index: 20;
  margin-top: 0;
}

.back-button {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-button:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* App Grid */
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
}

/* Glass Tile */
.glass-tile {
  position: relative;
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 4px 20px rgba(0, 0, 0, 0.3);
}

.glass-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.glass-tile:hover {
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 8px 30px rgba(0, 255, 255, 0.2);
}

.glass-tile.focused {
  z-index: 200;
  transform: scale(1.1);
  opacity: 1;
}

.glass-tile.error-state {
  animation: errorPulse 2s infinite;
}

/* Color Tinting */
.tint-frontend {
  background: rgba(100, 200, 255, 0.05);
  border-color: rgba(100, 200, 255, 0.2);
}

.tint-backend {
  background: rgba(150, 100, 200, 0.05);
  border-color: rgba(150, 100, 200, 0.2);
}

/* Tile Header */
.tile-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.tile-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

.tile-title {
  flex: 1;
}

.tile-name {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
}

.tile-port {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Roboto Mono', monospace;
}

/* Status Indicator */
.status-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 0 0 12px 12px;
  transition: all 0.3s ease;
}

.status-running {
  background: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
}

.status-idle {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: none;
}

.status-compiling {
  background: #ffaa00;
  box-shadow: 0 0 10px rgba(255, 170, 0, 0.6);
  animation: pulse 2s infinite;
}

.status-error {
  background: #ff0044;
  box-shadow: 0 0 15px rgba(255, 0, 68, 0.8);
  animation: strobe 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes strobe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes errorPulse {
  0%, 100% { border-color: rgba(255, 0, 68, 0.2); }
  50% { border-color: rgba(255, 0, 68, 0.6); }
}

/* Ports Section */
.ports-section {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.port-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 2px solid transparent;
}

.port-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.port-type {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.port-type.frontend {
  background: rgba(100, 200, 255, 0.2);
  color: rgba(100, 200, 255, 0.9);
}

.port-type.backend {
  background: rgba(150, 100, 200, 0.2);
  color: rgba(150, 100, 200, 0.9);
}

.port-number {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Roboto Mono', monospace;
}

.port-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
}

.port-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Roboto Mono', monospace;
}

.stat-item {
  opacity: 0.7;
}

/* Focus Overlay */
.focus-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.focus-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.focus-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.focus-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.focus-port {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid rgba(0, 255, 255, 0.5);
}

.focus-port h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.focus-port p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
  font-family: 'Roboto Mono', monospace;
}

.focus-close {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s;
}

.focus-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Loading/Error States */
.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-state .glass-tile.error {
  border-color: rgba(255, 0, 68, 0.5);
  background: rgba(255, 0, 68, 0.1);
}

/* Responsive */
@media (max-width: 1600px) {
  .app-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .app-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
}

@media (max-width: 768px) {
  .app-grid {
    grid-template-columns: 1fr;
  }
  
  .hud-bar {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }
  
  .hud-center {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

