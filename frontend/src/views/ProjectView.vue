<template>
  <div class="project-view-container" ref="containerRef">
    <!-- Smooth scroll progress indicator -->
    <div class="scroll-progress" :style="{ width: `${scrollProgress}%` }"></div>
    
    <!-- Back Button - Fixed with glass effect, transitions from back to arrow when at top -->
    <div 
      class="fixed bottom-6 right-0.5 z-50 fade-in-up back-button-container"
      :class="{ 'is-scrolling': isScrolling }"
    >
      <transition name="back-button" mode="out-in">
        <router-link
          v-if="isAtTop"
          key="arrow"
          to="/"
          class="btn-glass-arrow px-2.5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center backdrop-blur-xl hover:scale-110 transition-all duration-300 shadow-2xl"
          title="Back to portfolio"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <router-link 
          v-else
          key="back"
          to="/" 
          class="btn-glass px-2.5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center backdrop-blur-xl hover:scale-105 transition-all duration-300 shadow-2xl back-button-small"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
      </transition>
    </div>
    
    <!-- Loading State -->
    <div v-if="store.loading" class="min-h-screen flex items-center justify-center">
      <div class="glass-strong rounded-3xl px-8 py-6 animate-pulse">
        <p class="text-white dark:text-slate-300 text-lg font-medium">Loading project...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="store.error" class="min-h-screen flex items-center justify-center px-4">
      <div class="glass-strong rounded-3xl p-6 border-red-300/30 max-w-md">
        <p class="text-red-100 font-medium">Error: {{ store.error }}</p>
      </div>
    </div>
    
    <!-- NSFW Warning Modal -->
    <div
      v-if="project && project.nsfw && !nsfwAccepted"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      @click.self="showNsfwWarning = false"
    >
      <div class="glass-strong rounded-3xl p-8 max-w-md w-full border-2 border-red-500/50 animate-scale-in">
        <div class="text-center mb-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center animate-bounce">
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
            class="flex-1 px-6 py-3 rounded-2xl bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            Go Back
          </button>
          <button
            @click="nsfwAccepted = true; showNsfwWarning = false"
            class="flex-1 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    </div>

    <!-- Main Scrollable Content -->
    <div v-else-if="project && (!project.nsfw || nsfwAccepted)" class="project-content">
      <!-- Hero Section - Parallax -->
      <section 
        ref="heroRef"
        class="hero-section"
        :style="{ transform: `translateY(${heroParallax}px)` }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div class="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <!-- Animated background gradient -->
            <div class="absolute inset-0 opacity-30 animate-gradient-shift"></div>
            
            <div class="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <!-- App Icon with 3D effect -->
              <div class="flex-shrink-0">
                <div 
                  class="app-icon-3d w-32 h-32 md:w-40 md:h-40 rounded-3xl glass flex items-center justify-center text-white dark:text-slate-300 text-5xl md:text-6xl font-bold shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-6"
                  :style="{ transform: `rotateY(${iconRotation}deg) rotateX(${iconTilt}deg)` }"
                >
                  {{ project.name.charAt(0) }}
                </div>
              </div>
              
              <!-- App Info -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-2 flex-wrap gap-4">
                  <h1 
                    class="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-slate-300 transition-all duration-500"
                    :class="{ 'animate-slide-up': heroVisible }"
                  >
                    {{ project.name }}
                  </h1>
                  <div class="flex flex-col items-end gap-2">
                    <span
                      v-if="project.nsfw"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/30 text-red-100 border border-red-400/30 backdrop-blur-sm flex items-center gap-1.5"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      NSFW
                    </span>
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
                  </div>
                </div>
                <p 
                  v-if="project.tagline" 
                  class="text-white/90 dark:text-slate-400 text-xl md:text-2xl font-light mb-6 transition-all duration-500 delay-100"
                  :class="{ 'animate-fade-in-up': heroVisible }"
                >
                  {{ project.tagline }}
                </p>
                
                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-4 mt-6">
                  <a
                    v-if="project.primaryRepoUrl"
                    :href="project.primaryRepoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-glass px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 group"
                  >
                    <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                    View on GitHub
                  </a>
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-glass px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 group"
                  >
                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open App
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Live App Showcase Section -->
      <section 
        v-if="project.liveUrl"
        ref="showcaseRef"
        class="showcase-section"
        :class="{ 'animate-fade-in-up': showcaseVisible }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <!-- Animated mesh gradient background -->
            <div class="absolute inset-0 opacity-20">
              <div class="mesh-gradient"></div>
            </div>
            
            <div class="relative z-10">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-2xl glass flex items-center justify-center animate-pulse-slow">
                      <svg class="w-6 h-6 text-white dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-3xl md:text-4xl font-bold text-white dark:text-slate-300 mb-1">Try It Live</h2>
                      <p class="text-white/90 dark:text-slate-400 text-base font-light">Experience the app directly in your browser</p>
                    </div>
                  </div>
                </div>
                
                <a
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-glass px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-2xl group"
                >
                  <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Launch App</span>
                </a>
              </div>
              
              <!-- Preview Card with 3D tilt effect -->
              <div 
                class="glass-card rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl"
                @mousemove="handleCardTilt"
                @mouseleave="resetCardTilt"
                :style="{ transform: `perspective(1000px) rotateX(${cardTiltX}deg) rotateY(${cardTiltY}deg)` }"
              >
                <div class="aspect-video bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 dark:from-slate-900/50 dark:via-slate-800/40 dark:to-slate-900/50 relative group">
                  <iframe
                    :src="project.liveUrl"
                    class="w-full h-full border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                    @error="iframeError = true"
                  ></iframe>
                  
                  <div class="absolute inset-0 flex flex-col items-center justify-center p-8 group-hover:opacity-0 transition-opacity duration-500">
                    <div class="w-20 h-20 rounded-3xl glass-strong flex items-center justify-center mb-6 animate-float">
                      <svg class="w-10 h-10 text-white dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white dark:text-slate-300 mb-2">{{ project.name }}</h3>
                    <p class="text-white/90 dark:text-slate-400 text-center font-light mb-6 max-w-md">
                      {{ project.shortDescription || 'Click to explore this live application' }}
                    </p>
                    <a
                      :href="project.liveUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="glass-strong px-6 py-3 rounded-2xl text-white dark:text-slate-300 font-semibold flex items-center gap-2 hover:bg-white/20 dark:hover:bg-slate-700/30 transition-all duration-300 hover:scale-105"
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
                <div class="glass rounded-2xl px-6 py-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-300">
                  <svg class="w-5 h-5 text-white/90 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white/90 dark:text-slate-300 hover:text-white dark:hover:text-slate-200 text-sm font-medium transition-colors break-all"
                  >
                    {{ project.liveUrl }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Screenshots Section -->
      <section 
        ref="screenshotsRef"
        class="screenshots-section"
        :class="{ 'animate-fade-in-up': screenshotsVisible }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="glass-card rounded-3xl p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6">Screenshots</h2>
            <div class="relative">
              <div 
                ref="screenshotContainer"
                class="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
                style="scrollbar-width: none; -ms-overflow-style: none;"
              >
                <div
                  v-for="(screenshot, index) in screenshots"
                  :key="index"
                  class="flex-shrink-0 snap-center"
                  :class="{ 'animate-scale-in': screenshotsVisible }"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <div class="glass-strong rounded-2xl overflow-hidden w-64 md:w-80 h-auto shadow-2xl hover:scale-105 transition-transform duration-500">
                    <img
                      :src="screenshot"
                      :alt="`${project.name} screenshot ${index + 1}`"
                      class="w-full h-auto object-cover"
                      @error="handleImageError"
                      loading="lazy"
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
                      <p class="text-white/90 dark:text-slate-400 text-sm">No screenshots available</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Scroll indicators -->
              <div v-if="screenshots.length > 0" class="flex justify-center gap-2 mt-4">
                <div
                  v-for="(_, index) in screenshots"
                  :key="index"
                  :class="currentScreenshot === index ? 'bg-white/80 dark:bg-slate-400 w-8' : 'bg-white/30 dark:bg-slate-600/50'"
                  class="h-2 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Description Section -->
      <section 
        v-if="project.shortDescription || descriptionText"
        ref="descriptionRef"
        class="description-section"
        :class="{ 'animate-fade-in-up': descriptionVisible }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="glass-card rounded-3xl p-8">
            <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6">About</h2>
            <div class="space-y-4">
              <p v-if="project.shortDescription" class="text-white/90 dark:text-slate-300 text-lg font-light leading-relaxed">
                {{ project.shortDescription }}
              </p>
              <p v-if="descriptionText" class="text-white/90 dark:text-slate-300 text-base font-light leading-relaxed whitespace-pre-line">
                {{ descriptionText }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Details Section (from ProjectDetail) -->
      <section 
        v-if="longDescriptionText"
        ref="detailsRef"
        class="details-section"
        :class="{ 'animate-fade-in-up': detailsVisible }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="glass-card rounded-3xl p-8">
            <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-4">Details</h2>
            <p class="text-white/90 dark:text-slate-300 text-lg font-light leading-relaxed whitespace-pre-line">
              {{ longDescriptionText }}
            </p>
          </div>
        </div>
      </section>

      <!-- Metadata Grid -->
      <section 
        ref="metadataRef"
        class="metadata-section"
        :class="{ 'animate-fade-in-up': metadataVisible }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="(item, index) in metadataItems"
              :key="index"
              class="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-500"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <h3 class="text-sm font-semibold text-white/90 dark:text-slate-400 mb-3 uppercase tracking-wider">
                {{ item.label }}
              </h3>
              <p class="text-white dark:text-slate-300 font-medium text-lg">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Partitions Section -->
      <section 
        v-if="project.partitions && project.partitions.length > 0"
        ref="partitionsRef"
        class="partitions-section"
        :class="{ 'animate-fade-in-up': partitionsVisible }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-32">
          <div class="glass-card rounded-3xl p-8">
            <h2 class="text-2xl font-bold text-white dark:text-slate-300 mb-6">Also in</h2>
            <div class="flex flex-wrap gap-3">
              <router-link
                v-for="partition in project.partitions"
                :key="partition.id"
                :to="`/partitions/${partition.slug}`"
                class="glass-strong px-5 py-2.5 rounded-2xl text-white dark:text-slate-300 font-medium hover:bg-white/20 dark:hover:bg-slate-700/30 transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                {{ partition.name }}
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Not Found State -->
    <div v-else class="min-h-screen flex items-center justify-center px-4">
      <div class="glass-strong rounded-3xl p-12 text-center">
        <p class="text-white/90 dark:text-slate-300 text-lg font-light">Project not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioStore, type ProjectDetail } from '../stores/portfolio'

const route = useRoute()
const store = usePortfolioStore()
const project = ref<ProjectDetail | null>(null)
const showNsfwWarning = ref(false)
const nsfwAccepted = ref(false)
const iframeError = ref(false)

// Scroll tracking
const containerRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const heroParallax = ref(0)
const heroRef = ref<HTMLElement | null>(null)
const isAtTop = ref(false) // Start with back button (small), transition to arrow when reaching top (y=0)
const hasScrolled = ref(false) // Track if user has scrolled at all
const isScrolling = ref(false) // Track if user is actively scrolling
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// 3D effects
const iconRotation = ref(0)
const iconTilt = ref(0)
const cardTiltX = ref(0)
const cardTiltY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)

// Intersection Observer for animations
const heroVisible = ref(false)
const showcaseVisible = ref(false)
const screenshotsVisible = ref(false)
const descriptionVisible = ref(false)
const detailsVisible = ref(false)
const metadataVisible = ref(false)
const partitionsVisible = ref(false)

const showcaseRef = ref<HTMLElement | null>(null)
const screenshotsRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLElement | null>(null)
const metadataRef = ref<HTMLElement | null>(null)
const partitionsRef = ref<HTMLElement | null>(null)
const screenshotContainer = ref<HTMLElement | null>(null)
const currentScreenshot = ref(0)

// Extract screenshots and description
function getScreenshotUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  if (path.startsWith('/')) {
    if (import.meta.env.DEV) {
      return path
    } else {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const baseUrl = apiBase.replace('/api', '')
      return `${baseUrl}${path}`
    }
  }
  return `/${path}`
}

const screenshots = computed(() => {
  if (!project.value) return []
  try {
    const parsed = JSON.parse(project.value.longDescription || '{}')
    if (parsed.screenshots && Array.isArray(parsed.screenshots)) {
      return parsed.screenshots
        .filter((url: string) => url && url.trim().length > 0)
        .map((url: string) => getScreenshotUrl(url))
    }
  } catch {
    // Not JSON, continue
  }
  return []
})

const descriptionText = computed(() => {
  if (!project.value) return ''
  try {
    const parsed = JSON.parse(project.value.longDescription || '{}')
    if (parsed.description && parsed.description.trim().length > 0) {
      return parsed.description
    }
    return ''
  } catch {
    return project.value.longDescription || ''
  }
})

const longDescriptionText = computed(() => {
  if (!project.value) return ''
  // Only show if descriptionText is empty (to avoid duplication)
  if (descriptionText.value) return ''
  try {
    const parsed = JSON.parse(project.value.longDescription || '{}')
    // If it's JSON but no description field, return empty
    return ''
  } catch {
    // Not JSON, use as-is (plain text description)
    return project.value.longDescription || ''
  }
})

const metadataItems = computed(() => {
  if (!project.value) return []
  return [
    {
      label: 'Developer',
      value: project.value.githubRepoFullName?.split('/')[0] || 'Portfolio'
    },
    {
      label: 'Category',
      value: project.value.partitions?.map(p => p.name).join(', ') || 'Uncategorized'
    },
    {
      label: 'Released',
      value: formatDate(project.value.createdAt)
    },
    {
      label: 'Last Updated',
      value: formatDate(project.value.updatedAt)
    }
  ]
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

// Scroll handlers
function handleScroll() {
  if (!containerRef.value) return
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  
  // Track if user has scrolled
  if (scrollTop > 0) {
    hasScrolled.value = true
  }
  
  // Only show arrow if user has scrolled and is now back at top
  // This ensures back button shows initially, then transitions to arrow when reaching top
  isAtTop.value = hasScrolled.value && scrollTop === 0
  
  // Set scrolling state to true
  isScrolling.value = true
  
  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  // Set scrolling to false after scroll stops (150ms delay)
  scrollTimeout = setTimeout(() => {
    isScrolling.value = false
  }, 150)
  
  // Parallax effect for hero
  if (heroRef.value) {
    const heroRect = heroRef.value.getBoundingClientRect()
    if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
      heroParallax.value = scrollTop * 0.3
    }
  }
  
  // 3D icon rotation based on scroll
  iconRotation.value = scrollTop * 0.1
  iconTilt.value = Math.sin(scrollTop * 0.01) * 5
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Mouse tracking for 3D effects
function handleMouseMove(event: MouseEvent) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
  
  // Icon 3D effect
  if (heroRef.value) {
    const rect = heroRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (event.clientX - centerX) / rect.width
    const deltaY = (event.clientY - centerY) / rect.height
    
    iconRotation.value = deltaX * 15
    iconTilt.value = deltaY * 10
  }
}

function handleCardTilt(event: MouseEvent) {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const deltaX = (event.clientX - centerX) / rect.width
  const deltaY = (event.clientY - centerY) / rect.height
  
  cardTiltX.value = -deltaY * 10
  cardTiltY.value = deltaX * 10
}

function resetCardTilt() {
  cardTiltX.value = 0
  cardTiltY.value = 0
}

// Intersection Observer setup
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        if (target.classList.contains('showcase-section')) showcaseVisible.value = true
        if (target.classList.contains('screenshots-section')) screenshotsVisible.value = true
        if (target.classList.contains('description-section')) descriptionVisible.value = true
        if (target.classList.contains('details-section')) detailsVisible.value = true
        if (target.classList.contains('metadata-section')) metadataVisible.value = true
        if (target.classList.contains('partitions-section')) partitionsVisible.value = true
      }
    })
  }, observerOptions)
  
  if (showcaseRef.value) observer.observe(showcaseRef.value)
  if (screenshotsRef.value) observer.observe(screenshotsRef.value)
  if (descriptionRef.value) observer.observe(descriptionRef.value)
  if (detailsRef.value) observer.observe(detailsRef.value)
  if (metadataRef.value) observer.observe(metadataRef.value)
  if (partitionsRef.value) observer.observe(partitionsRef.value)
  
  // Hero is always visible on mount
  heroVisible.value = true
  
  return observer
}

async function loadProject() {
  // Scroll to top immediately
  window.scrollTo({ top: 0, behavior: 'instant' })
  
  const slug = route.params.slug as string
  project.value = await store.fetchProjectBySlug(slug)
  
  if (project.value && project.value.nsfw) {
    showNsfwWarning.value = true
    nsfwAccepted.value = false
  }
  
  // Ensure we're at the top after data loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 0)
  
  // Reset scroll progress
  scrollProgress.value = 0
  
  // Reset animation states
  heroVisible.value = false
  showcaseVisible.value = false
  screenshotsVisible.value = false
  descriptionVisible.value = false
  detailsVisible.value = false
  metadataVisible.value = false
  partitionsVisible.value = false
  
  // Re-setup intersection observer after a brief delay
  setTimeout(() => {
    heroVisible.value = true
    setupIntersectionObserver()
  }, 100)
}

// Watch for route changes (when navigating between different projects)
watch(() => route.params.slug, () => {
  loadProject()
}, { immediate: false })

onMounted(async () => {
  await loadProject()
  
  // Set up scroll listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  
  // Set up screenshot scrolling
  if (screenshotContainer.value && screenshots.value.length > 0) {
    screenshotContainer.value.addEventListener('scroll', () => {
      if (screenshotContainer.value) {
        const scrollLeft = screenshotContainer.value.scrollLeft
        const itemWidth = screenshotContainer.value.querySelector('div')?.offsetWidth || 0
        currentScreenshot.value = Math.round(scrollLeft / (itemWidth + 16))
      }
    })
  }
  
  // Initial scroll calculation - ensure back button shows initially
  setTimeout(() => {
    handleScroll()
    // Reset to ensure back button shows on initial load
    hasScrolled.value = false
    isAtTop.value = false
  }, 50)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
.project-view-container {
  position: relative;
  min-height: 100vh;
  scroll-behavior: smooth;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe);
  z-index: 100;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.project-content {
  position: relative;
}

.hero-section {
  position: relative;
  will-change: transform;
}

.showcase-section,
.screenshots-section,
.description-section,
.details-section,
.metadata-section,
.partitions-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.showcase-section.animate-fade-in-up,
.screenshots-section.animate-fade-in-up,
.description-section.animate-fade-in-up,
.details-section.animate-fade-in-up,
.metadata-section.animate-fade-in-up,
.partitions-section.animate-fade-in-up {
  opacity: 1;
  transform: translateY(0);
}

.app-icon-3d {
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.3s ease-out;
}

.mesh-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(79, 172, 254, 0.4) 0%, transparent 50%);
  animation: mesh-move 20s ease infinite;
}

@keyframes mesh-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

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

/* Back button transitions */
.back-button-enter-active,
.back-button-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* When transitioning FROM back TO arrow (entering arrow) */
.back-button-enter-from {
  opacity: 0;
  transform: scale(0.7) translateX(-10px);
}

.back-button-enter-to {
  opacity: 1;
  transform: scale(1) translateX(0);
}

/* When transitioning FROM arrow TO back (leaving arrow, entering back) */
.back-button-leave-from {
  opacity: 1;
  transform: scale(1) translateX(0);
}

.back-button-leave-to {
  opacity: 0;
  transform: scale(0.7) translateX(-10px);
}

/* Small back button styling - smaller arrow when not at top */
.back-button-small {
  padding: 0.5rem;
}

.back-button-small svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* Back button container - handles opacity based on scroll state */
.back-button-container {
  opacity: 0.3;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-button-container:hover {
  opacity: 1;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-button-container.is-scrolling {
  opacity: 1;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Arrow button with 100% opaque background */
.btn-glass-arrow {
  background: rgba(255, 255, 255, 1) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #1a1a1a;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.2);
}

.dark .btn-glass-arrow {
  background: rgba(30, 30, 35, 1) !important;
  border: 1px solid rgba(160, 160, 170, 0.15);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.5);
  color: #f1f5f9;
}

.btn-glass-arrow:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px 0 rgba(31, 38, 135, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.dark .btn-glass-arrow:hover {
  background: rgba(35, 35, 40, 1) !important;
  border-color: rgba(170, 170, 180, 0.2);
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.6);
}
</style>

