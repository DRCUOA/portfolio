<template>
  <div class="flex items-center gap-3">
    <img 
      src="/logo.svg" 
      alt="Portfolio Logo" 
      class="w-10 h-10 md:w-12 md:h-12 transition-opacity hover:opacity-80"
    />
    <span v-if="showText" class="text-xl md:text-2xl font-bold text-white dark:text-slate-300 transition-colors">
      Portfolio
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showText?: boolean
}>()
</script>


