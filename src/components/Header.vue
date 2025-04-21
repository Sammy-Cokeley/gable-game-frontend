<template>
  <div class="header">
    <div class="header-icons-left">
      <CircleHelp :stroke-width="2.5" :size="35" @click="openHelp" class="icons" />
      <ChartNoAxesColumnIncreasing :stroke-width="2.5" :size="35" @click="openStats" class="icons" />
    </div>
    <div class="title">
      <h1 class="gable">Gable</h1>
      <h3 class="gable-subtitle">Wrestling Guessing Game</h3>
    </div>
    <div class="header-icons-right">
      <!-- <template v-if="authStore.isAuthenticated">
        <button @click="handleLogout" class="logout-button">Logout</button>
      </template>
<template v-else>
        <router-link to="/login" class="auth-link">Login</router-link>
        <router-link to="/register" class="auth-link">Register</router-link>
      </template> -->
    </div>
  </div>
  <HelpModal ref="helpModal" />
  <StatsModal ref="statsModal" />
</template>

<script setup>
import { ref } from 'vue'
import { CircleHelp, ChartNoAxesColumnIncreasing } from 'lucide-vue-next'
import HelpModal from '@/components/HelpModal.vue'
import StatsModal from '@/components/StatsModal.vue'
import { useAuthStore } from '@/services/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();
const helpModal = ref(null)
const statsModal = ref(null)
const openHelp = () => helpModal.value.openModal()
const openStats = () => statsModal.value.openModal()


const handleLogout = () => {
  authStore.logout();
  // Optionally redirect to home after logout
  router.push('/');
};
</script>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.header-icons-left {
  margin: 5px 15px;
}

.header-icons-right {
  margin: 5px 50px;
}

.icons:hover {
  cursor: pointer;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gable {
  font-size: 80px;
  font-family: JetBrains Mono;
  font-weight: 800;
  letter-spacing: 10px;
  color: #021573;
  margin: 10px 0px;
}

.gable-subtitle {
  font-size: 40px;
  font-family: JetBrains Mono;
  font-weight: 600;
  color: #021573;
  margin: 4px 0px;
}

@media (max-width: 1024px) {
  .gable {
    font-size: 2.5rem;
    /* Smaller font for tablet */
  }

  .gable-subtitle {
    font-size: 1.8rem;
    /* Smaller font for tablet */
  }
}

@media (max-width: 768px) {
  .gable {
    font-size: 2rem;
    /* Smaller font for mobile */
  }

  .gable-subtitle {
    font-size: 1.5rem;
    /* Smaller font for mobile */
  }
}

@media (max-width: 480px) {
  .gable {
    font-size: 1.5rem;
    /* Even smaller for very small screens */
  }

  .gable-subtitle {
    font-size: 1.2rem;
    /* Even smaller for very small screens */
  }
}

.logout-button {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 1rem;
}

.auth-link {
  color: #0066cc;
  text-decoration: none;
  margin-left: 1rem;
}

.auth-link:hover,
.logout-button:hover {
  text-decoration: underline;
}
</style>
