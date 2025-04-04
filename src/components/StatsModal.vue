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
              solution: {{ gameStore.dailyWrestler.name }}
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
            <button>Share</button>
          </div>

          <div class="stats-numbers">
            <h3>Game Stats</h3>
            <p>Total Games Played: {{ totalGames }}</p>
            <p>Wins: {{ totalWins }}</p>
            <p>Losses: {{ totalLosses }}</p>
            <p>Win Rate: {{ winRate }}%</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'
import { ref, watchEffect } from 'vue'

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
    totalWins = parseInt(localStorage.getItem('total-wins'))
    totalLosses = parseInt(localStorage.getItem('total-losses'))
    totalGames = totalWins + totalLosses
    if (totalGames > 0) {
      winRate = (totalWins / totalGames) * 100
    } else {
      winRate = 0
    }
  }
})

defineExpose({ openModal })
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
</style>
