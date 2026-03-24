<template>
  <footer class="footer">
    <div class="footer-inner">
      <nav class="footer-links">
        <router-link to="/about" class="footer-link">About</router-link>
        <router-link to="/privacy-policy" class="footer-link">Privacy Policy</router-link>
        <router-link to="/contact" class="footer-link">Contact</router-link>
      </nav>
      <p class="copyright">© {{ new Date().getFullYear() }} Gable Game</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  padding: 1rem 1.5rem;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.footer-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-links {
  display: flex;
  gap: 1.25rem;
}

.footer-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  font-family: 'Inter', system-ui, sans-serif;
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: var(--primary);
  text-decoration: none;
}

.copyright {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
