<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="mb-12 fade-in-up">
        <router-link 
          to="/" 
          class="btn-glass px-5 py-2.5 rounded-2xl text-sm font-semibold mb-6 inline-flex items-center gap-2"
        >
          <span>←</span> Back to Portfolio
        </router-link>
        <div class="flex items-center gap-4 mb-4">
          <img 
            src="/logo.svg" 
            alt="Portfolio Logo" 
            class="w-12 h-12 md:w-16 md:h-16 transition-opacity hover:opacity-80"
          />
          <div>
            <h1 class="text-5xl md:text-6xl font-bold text-white dark:text-slate-300 mb-2 transition-colors">Admin Dashboard</h1>
            <p class="text-white/60 dark:text-slate-500 text-xl font-light transition-colors">Manage your portfolio content</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <router-link
          to="/admin/partitions"
          class="glass-card rounded-3xl p-10 block fade-in-up"
          style="animation-delay: 0.1s"
        >
          <div class="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-2xl font-bold mb-6 transition-colors">
            P
          </div>
          <h2 class="text-3xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">Partitions</h2>
                  <p class="text-white/60 dark:text-slate-500 mb-6 font-light leading-relaxed transition-colors">Manage portfolio partitions and categories</p>
          <div class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium transition-colors">
            <span>Manage →</span>
          </div>
        </router-link>

        <router-link
          to="/admin/projects"
          class="glass-card rounded-3xl p-10 block fade-in-up"
          style="animation-delay: 0.2s"
        >
          <div class="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-2xl font-bold mb-6 transition-colors">
            🚀
          </div>
          <h2 class="text-3xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">Projects</h2>
                  <p class="text-white/60 dark:text-slate-500 mb-6 font-light leading-relaxed transition-colors">Manage portfolio projects and their details</p>
          <div class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium transition-colors">
            <span>Manage →</span>
          </div>
        </router-link>

        <router-link
          to="/admin/ports"
          class="glass-card rounded-3xl p-10 block fade-in-up"
          style="animation-delay: 0.3s"
        >
          <div class="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-2xl font-bold mb-6 transition-colors">
            🔌
          </div>
          <h2 class="text-3xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">Ports</h2>
                  <p class="text-white/60 dark:text-slate-500 mb-6 font-light leading-relaxed transition-colors">Track and manage port allocation for local dev servers</p>
          <div class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium transition-colors">
            <span>Manage →</span>
          </div>
        </router-link>

        <router-link
          to="/admin/traffic"
          class="glass-card rounded-3xl p-10 block fade-in-up"
          style="animation-delay: 0.4s"
        >
          <div class="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-2xl font-bold mb-6 transition-colors">
            📊
          </div>
          <h2 class="text-3xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">Traffic Analytics</h2>
                  <p class="text-white/60 dark:text-slate-500 mb-6 font-light leading-relaxed transition-colors">View traffic statistics and analytics for all ports</p>
          <div class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium transition-colors">
            <span>View Analytics →</span>
          </div>
        </router-link>

        <router-link
          to="/admin/tv"
          class="glass-card rounded-3xl p-10 block fade-in-up"
          style="animation-delay: 0.5s"
        >
          <div class="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center text-white dark:text-slate-300 text-2xl font-bold mb-6 transition-colors">
            📺
          </div>
          <h2 class="text-3xl font-bold text-white dark:text-slate-300 mb-4 transition-colors">TV Dashboard</h2>
                  <p class="text-white/60 dark:text-slate-500 mb-6 font-light leading-relaxed transition-colors">Cyberpunk glassmorphism monitor view of all apps</p>
          <div class="flex items-center text-white/60 dark:text-slate-500 text-sm font-medium transition-colors">
            <span>View Dashboard →</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

