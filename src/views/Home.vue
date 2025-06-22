<template>
  <Header />

  <!-- Title -->
  <div class="title">
    <h1 class="gable">Gable Game</h1>
  </div>
  <div class="home-container">
    <GuessInput />
    <GameTable />
  </div>
  <StatsModal ref="statsModal" />
</template>

<script setup>
import Header from '@/components/Header.vue'
import GuessInput from '@/components/GuessInput.vue'
import GameTable from '@/components/GameTable.vue'
import StatsModal from '@/components/StatsModal.vue';
import { useGameStore } from '@/store/game.store';
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth.store';

const gameStore = useGameStore()
const statsModal = ref(null)
const authStore = useAuthStore();

authStore.initializeAuth();

onMounted(() => {
  gameStore.initializeGame()
  setTimeout(() => {
    if (gameStore.hasWon || gameStore.hasLost) {
      statsModal.value.openModal()
    }
  }, 500);
})

watch(
  () => gameStore.gameState,
  (newStatus) => {
    if (newStatus === 'won' || newStatus === 'lost') {
      statsModal.value.openModal()
    }
  }
)
</script>

<style src="../css/global-styles.css"></style>
