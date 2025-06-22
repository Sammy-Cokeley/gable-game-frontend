<template>
  <div class="header">
    <!-- Utility bar -->
    <div class="header-top">
      <div class="header-icons">
        <router-link to="/" class="chip-button">Home</router-link>
        <button class="chip-button" @click="helpModal?.openModal()">Help</button>
        <button class="chip-button" @click="statsModal?.openModal()">Stats</button>
        <template v-if="isAuthenticated">
          <button @click="handleLogout" class="chip-button">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="chip-button">Login</router-link>
          <router-link to="/register" class="chip-button">Register</router-link>
        </template>
      </div>
    </div>
  </div>

  <HelpModal ref="helpModal" />
  <StatsModal ref="statsModal" />
</template>


<script setup>
import { computed, ref } from 'vue'
// import { CircleHelp, ChartNoAxesColumnIncreasing } from 'lucide-vue-next'
import HelpModal from '@/components/HelpModal.vue'
import StatsModal from '@/components/StatsModal.vue'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();
const helpModal = ref(null)
const statsModal = ref(null)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout();
  // Optionally redirect to home after logout
  router.push('/');
};
</script>

<style scoped>
.header {
  width: 100%;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
}

/* Utility top bar */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  /* allow stacking on mobile */
  font-size: 0.9rem;
}

.header-icons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

a {
  text-decoration: none;
}

.chip-button {
  padding: 0.4rem 0.75rem;
  background-color: #014180;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
}

.chip-button:hover {
  background-color: #004f99;
}

/* Title centered */
.title {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}



/* Responsive tweaks */
@media (max-width: 600px) {
  .header-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-icons {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .gable {
    font-size: 1.75rem;
    text-align: center;
    letter-spacing: 4px;
  }
}
</style>
