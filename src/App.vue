<template>
  <div class="app-container">
    <main class="main-content">
      <router-view />
    </main>
    <FooterLinks />
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import FooterLinks from './components/Footer.vue'

// Initialize theme from localStorage on app mount
useTheme()
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg);
}

.main-content {
  flex: 1;
}
</style>
