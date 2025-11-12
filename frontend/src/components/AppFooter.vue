<template>
  <footer class="mt-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 dark:border-slate-700/50">
        <div class="flex flex-col md:flex-row items-center gap-4 text-sm">
          <img 
            src="/logo.svg" 
            alt="Portfolio Logo" 
            class="w-6 h-6 opacity-60 dark:opacity-50"
          />
          <span class="text-white/60 dark:text-slate-500 font-medium transition-colors">
            BUILT BY NZWEBAPPS
          </span>
          <span class="hidden md:inline text-white/30 dark:text-slate-600">•</span>
          <span class="text-white/60 dark:text-slate-500 transition-colors">
            © 2025 - Directors Moria and Richard Clark
          </span>
        </div>
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <router-link
            to="/admin"
            class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold"
          >
            Admin Panel
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

