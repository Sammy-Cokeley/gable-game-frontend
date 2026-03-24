<template>
  <header class="header">
    <div class="header-left">
      <button class="icon-btn" @click="helpModal?.openModal()" aria-label="How to Play">
        <CircleHelp :size="18" />
        <span class="btn-label">Help</span>
      </button>
      <button class="icon-btn" @click="statsModal?.openModal()" aria-label="Your Stats">
        <ChartNoAxesColumnIncreasing :size="18" />
        <span class="btn-label">Stats</span>
      </button>
    </div>

    <router-link to="/" class="header-title">GABLE</router-link>

    <div class="header-right">
      <button class="icon-btn theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <Sun v-if="isDark" :size="18" />
        <Moon v-else :size="18" />
      </button>
      <template v-if="isAuthenticated">
        <button @click="handleLogout" class="icon-btn">Logout</button>
      </template>
      <template v-else>
        <router-link to="/login" class="icon-btn">Login</router-link>
        <router-link to="/register" class="icon-btn">Register</router-link>
      </template>
    </div>
  </header>

  <HelpModal ref="helpModal" />
  <StatsModal ref="statsModal" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { CircleHelp, ChartNoAxesColumnIncreasing, Sun, Moon } from 'lucide-vue-next'
import HelpModal from '@/components/HelpModal.vue'
import StatsModal from '@/components/StatsModal.vue'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const authStore = useAuthStore()
const router = useRouter()
const helpModal = ref(null)
const statsModal = ref(null)
const { isDark, toggleTheme } = useTheme()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  width: 100%;
  padding: 0.6rem 1.25rem;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.header-left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

.header-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--text-primary);
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.header-title:hover {
  color: var(--primary);
  text-decoration: none;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--primary);
  color: var(--primary-text);
  border: none;
  border-radius: 20px;
  font-size: 0.82rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
  text-decoration: none;
  white-space: nowrap;
}

.icon-btn:hover {
  background-color: var(--primary-hover);
  text-decoration: none;
}

.theme-toggle {
  background-color: var(--surface-alt);
  color: var(--text-secondary);
}

.theme-toggle:hover {
  background-color: var(--border);
}

@media (max-width: 600px) {
  .header {
    padding: 0.5rem 0.75rem;
  }

  .header-title {
    font-size: 1.2rem;
    letter-spacing: 4px;
  }

  .btn-label {
    display: none;
  }

  .icon-btn {
    padding: 0.4rem 0.5rem;
  }
}
</style>
