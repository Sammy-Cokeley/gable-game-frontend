<template>
  <Teleport to="body">
    <div class="modal-overlay" v-if="isOpen" @click="closeModal">
      <div class="modal-content" @click.stop>
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

          <div class="solution" v-if="gameStore.hasLost">
            <p>
              Correct Wrestler: {{ gameStore.dailyWrestler.name }}
            </p>
          </div>
          <a v-if="tweetText" :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`"
            target="_blank" rel="noopener noreferrer" class="share-btn">
            Share on Twitter
          </a>
          <div class="results">
            <table>
              <tbody>
                <tr class="table-header">
                  <td>{{ totalGames }}</td>
                  <td>{{ totalWins }}</td>
                  <td>{{ totalLosses }}</td>
                </tr>
                <tr class="data-titles">
                  <td>Played</td>
                  <td>Wins</td>
                  <td>Losses</td>
                </tr>
                <tr class="table-header">
                  <td>{{ roundedWinRate }}</td>
                  <td>{{ gameStore.currentStreak }}</td>
                  <td>{{ gameStore.maxStreak }}</td>
                </tr>
                <tr class="data-titles">
                  <td>Win %</td>
                  <td>Current Streak</td>
                  <td>Max Streak</td>
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

                <span class="guess-count">{{ winDistribution[n] | 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useGameStore } from '@/store/game.store'
import { ref, watchEffect, computed } from 'vue'
import { useAuthStore } from '@/store/auth.store'

let totalWins = 0
let totalLosses = 0
let totalGames = 0
let winRate = 0
let roundedWinRate = 0

const gameStore = useGameStore()
const isOpen = ref(false)
const closeModal = () => (isOpen.value = false)
const openModal = () => (isOpen.value = true)
const tweetText = computed(() => generateTweetText());

watchEffect(() => {
  if (isOpen.value) {
    totalWins = gameStore.totalWins
    totalLosses = gameStore.totalLosses
    totalGames = totalWins + totalLosses
    if (totalGames > 0) {
      winRate = (totalWins / totalGames) * 100
      roundedWinRate = winRate.toFixed(2)
    } else {
      winRate = 0
    }
  }
})

defineExpose({ openModal })

const winDistribution = computed(() => gameStore.winDistribution);

function getBarWidth(n) {
  const values = Object.values(winDistribution.value); // ✅ fix
  const max = Math.max(...values);

  console.log(values)
  console.log(max)

  const count = winDistribution.value[n] || 0;

  if (max === 0) return 0;
  return Math.round((count / max) * 100);
}

function colorToEmoji(color) {
  switch (color) {
    case '#1a690e': return '🟩'; // Green
    case '#aba00a': return '🟨'; // Yellow
    default: return '⬛';        // Gray
  }
}

function generateEmojiGrid(guesses) {
  return guesses.map(guess => {
    const feedback = guess.feedback;
    return [
      colorToEmoji(feedback.year.color),
      colorToEmoji(feedback.team),
      colorToEmoji(feedback.conference),
      colorToEmoji(feedback.weight_class.color),
      colorToEmoji(feedback.win_percentage.color),
      colorToEmoji(feedback.ncaa_finish.color)
    ].join('');
  }).join('\n');
}

const generateTweetText = () => {
  const authStore = useAuthStore()
  const { previousGuesses, gameState, currentStreak } = gameStore;
  const today = new Date().toISOString().split('T')[0];

  console.log(today)

  if (!authStore.isAuthenticated || gameState !== 'won') return null;

  const emojiGrid = generateEmojiGrid(previousGuesses);

  return `#GableGame 
I guessed today's wrestler in ${previousGuesses.length} ${previousGuesses.length === 1 ? 'try' : 'tries'}!
Streak: ${currentStreak} 🔥

https://gablegame.com


${emojiGrid}`
};

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
  background: white;
  padding: 10px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: JetBrains Mono;
  overflow-y: auto;
}

.stats {
  background: rgb(219, 219, 219);
  border-radius: 3px;
  padding: 10px;
  box-shadow: 0px 2px 3px rgb(150, 150, 150);
}

.modal-content>.p-4 {
  padding: 20px;
  overflow-y: auto;
  max-height: 75vh;
  box-sizing: border-box;
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
  padding-bottom: 4px;
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

.share-btn {
  display: inline-block;
  margin: 1rem;
  padding: 0.5rem 1.25rem;
  background-color: #1e95e0;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.share-btn:hover {
  background-color: #0d8ddb;
}
</style>
