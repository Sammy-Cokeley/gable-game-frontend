<template>
  <div class="container">
    <Header />
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
import { useGameStore } from '@/store/gameStore';
import { onMounted, ref, watch } from 'vue';

const gameStore = useGameStore()
const statsModal = ref(null)

onMounted(() => {
  gameStore.fetchDailyWrestler()
  gameStore.fetchAllWrestlers()
  gameStore.loadStoredGameState()
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

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: JetBrains Mono;

  /* padding: 1rem;
  width: 100%;*/
  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
