<template>
  <div class="app-container">
    <main class="main-content">
      <router-view />
    </main>
    <FooterLinks />
  </div>
</template>

<script setup>
import FooterLinks from './components/Footer.vue';
</script>

<style>
/* Make the whole app a vertical flex layout */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Make the main content area expand to fill remaining space */
.main-content {
  flex: 1;
}
</style>
