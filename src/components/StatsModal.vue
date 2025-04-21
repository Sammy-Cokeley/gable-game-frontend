<template>
  <Teleport to="body">
    <div class="modal-overlay" v-if="isOpen" @click="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">×</button>
        <div class="stats">
          <h2>Your Results</h2>
          <div class="results" v-if="gameStore.hasWon">
            <h2>🎉 You Won! 🎉</h2>
            <p>You guessed the wrestler in {{ gameStore.previousGuesses.length }} attempts.</p>
          </div>

          <div class="results" v-else-if="gameStore.hasLost">
            <h2>😞 Game Over!</h2>
            <p>The correct wrestler was <strong>{{ gameStore.dailyWrestler.name }}</strong>.</p>
          </div>

          <div class="solution" v-if="gameStore.hasWon || gameStore.hasLost">
            <p>
              Correct Wrestler: {{ gameStore.dailyWrestler.name }}
            </p>
          </div>
          <div class="results">
            <table>
              <tbody>
                <tr class="table-header">
                  <td>{{ totalGames }}</td>
                  <td>{{ totalWins }}</td>
                  <td>{{ totalLosses }}</td>
                  <td>{{ winRate }}</td>
                </tr>
                <tr class="data-titles">
                  <td>Played</td>
                  <td>Wins</td>
                  <td>Losses</td>
                  <td>Win %</td>
                </tr>
              </tbody>
            </table>
            <!-- <button>Share</button> -->
          </div>
          <div class="stats-numbers">
            <div class="guess-distribution">
              <h3>Guess Distribution</h3>

              <div v-for="n in 8" :key="n" class="guess-row">
                <span class="guess-label">{{ n }}</span>

                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: getBarWidth(n) + '%' }"></div>
                </div>

                <span class="guess-count">{{ winDistribution[n] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'
import { ref, watchEffect, computed } from 'vue'

let totalWins = 0
let totalLosses = 0
let totalGames = 0
let winRate = 0

const gameStore = useGameStore()
const isOpen = ref(false)
const closeModal = () => (isOpen.value = false)
const openModal = () => (isOpen.value = true)

watchEffect(() => {
  if (isOpen.value) {
    totalWins = parseInt(localStorage.getItem('gable-total-wins'))
    totalLosses = parseInt(localStorage.getItem('gable-total-losses'))
    totalGames = totalWins + totalLosses
    if (totalGames > 0) {
      winRate = (totalWins / totalGames) * 100
    } else {
      winRate = 0
    }
    console.log(localStorage)
  }
})

defineExpose({ openModal })


const getWinDistribution = computed(() => {
  const raw = localStorage.getItem('gable-win-distribution');
  const parsed = raw ? JSON.parse(raw) : {};
  const defaultDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

  return { ...defaultDist, ...parsed };
});

const winDistribution = ref(getWinDistribution);

function getBarWidth(n) {
  const values = Object.values(winDistribution.value);
  const max = Math.max(...values);

  const count = winDistribution.value[n] || 0;

  if (max === 0) return 0;
  return Math.round((count / max) * 100);
}

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  font-family: jetbrains mono;
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.stats {
  background: rgb(219, 219, 219);
  border-radius: 3px;
  padding: 10px;
  box-shadow: 0px 2px 3px rgb(150, 150, 150);
}

.results {
  background: white;
  border-radius: 3px;
  padding: 10px 0px;
  box-shadow: 0px 2px 3px rgb(150, 150, 150);
}

.stats-numbers {
  background: white;
  border-radius: 3px;
  box-shadow: 0px 2px 3px rgb(150, 150, 150);
}

.table-header {
  font-weight: bold;
}

table {
  margin: 0px auto
}

td {
  padding: 2px 10px;
}

.data-titles {
  color: rgb(53, 73, 103);
  font-weight: bold;
}

button {
  border: none;
  color: white;
  background: rgb(53, 73, 103);
  height: 2.5em;
  width: 6em;
  border-radius: 3px;
  cursor: pointer
}

button.close-btn {
  top: 4px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}


.guess-distribution {
  margin-top: 1rem;
}

.guess-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.guess-label {
  width: 20px;
  font-weight: bold;
  text-align: right;
  margin-right: 10px;
}

.bar-container {
  flex-grow: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}

.bar-fill {
  height: 100%;
  background-color: #4caf50;
  /* green */
  transition: width 0.3s ease-in-out;
}

.guess-count {
  width: 30px;
  text-align: left;
}
</style>
