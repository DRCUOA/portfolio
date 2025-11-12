<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* Global styles are handled by Tailwind CSS */
</style>
