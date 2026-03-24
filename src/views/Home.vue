<template>
  <Header />
  <div class="home-container">
    <div v-if="!gameStore.dailyWrestler" class="loading-state">
      <div class="arena-spinner"></div>
    </div>
    <template v-else>
      <GuessInput />
      <GameTable />
    </template>
  </div>
  <StatsModal ref="statsModal" />
</template>

<script setup>
import Header from '@/components/Header.vue'
import GuessInput from '@/components/GuessInput.vue'
import GameTable from '@/components/GameTable.vue'
import StatsModal from '@/components/StatsModal.vue'
import { useDailyGameStore } from '@/store/dailyGame.store'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth.store'

const gameStore = useDailyGameStore()
const statsModal = ref(null)
const authStore = useAuthStore()

authStore.initializeAuth()

onMounted(async () => {
  await gameStore.initializeGame()
  if (gameStore.hasWon || gameStore.hasLost) {
    statsModal.value?.openModal()
  }
})

watch(
  () => gameStore.gameState,
  (newStatus) => {
    if (newStatus === 'won' || newStatus === 'lost') {
      statsModal.value?.openModal()
    }
  }
)
</script>

<style src="../css/global-styles.css"></style>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}
</style>
