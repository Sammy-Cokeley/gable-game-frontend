<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" v-if="isOpen" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeModal" aria-label="Close">
            <X :size="18" />
          </button>

          <div class="stats">
            <h2 class="stats-title">Your Stats</h2>

            <div class="result-banner result-win" v-if="gameStore.hasWon">
              <span class="result-icon">🎉</span>
              <p>Solved in <strong>{{ gameStore.previousGuesses.length }}</strong> {{ gameStore.previousGuesses.length === 1 ? 'guess' : 'guesses' }}</p>
            </div>
            <div class="result-banner result-loss" v-else-if="gameStore.hasLost">
              <span class="result-icon">😞</span>
              <p>The answer was <strong>{{ gameStore.dailyWrestler?.name }}</strong></p>
            </div>

            <a
              v-if="tweetText"
              :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="share-btn"
            >
              Share on X / Twitter
            </a>

            <div class="stat-grid">
              <div class="stat-card">
                <span class="stat-number">{{ totalGames }}</span>
                <span class="stat-label">Played</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ totalWins }}</span>
                <span class="stat-label">Wins</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ totalLosses }}</span>
                <span class="stat-label">Losses</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ roundedWinRate }}%</span>
                <span class="stat-label">Win Rate</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ gameStore.currentStreak }}</span>
                <span class="stat-label">Streak</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ gameStore.maxStreak }}</span>
                <span class="stat-label">Best Streak</span>
              </div>
            </div>

            <div class="distribution">
              <h5 class="dist-title">Guess Distribution</h5>
              <div v-for="n in 8" :key="n" class="dist-row">
                <span class="dist-label">{{ n }}</span>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: getBarWidth(n) + '%' }">
                    <span v-if="winDistribution[n]" class="bar-count">{{ winDistribution[n] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useDailyGameStore } from '@/store/dailyGame.store'
import { ref, watchEffect, computed } from 'vue'
import { useAuthStore } from '@/store/auth.store'
import { X } from 'lucide-vue-next'

let totalWins = 0
let totalLosses = 0
let totalGames = 0
let winRate = 0
let roundedWinRate = 0

const gameStore = useDailyGameStore()
const isOpen = ref(false)
const closeModal = () => (isOpen.value = false)
const openModal = () => (isOpen.value = true)
const tweetText = computed(() => generateTweetText())

watchEffect(() => {
  if (isOpen.value) {
    totalWins = gameStore.totalWins
    totalLosses = gameStore.totalLosses
    totalGames = totalWins + totalLosses
    if (totalGames > 0) {
      winRate = (totalWins / totalGames) * 100
      roundedWinRate = winRate.toFixed(1)
    } else {
      winRate = 0
      roundedWinRate = 0
    }
  }
})

defineExpose({ openModal })

const winDistribution = computed(() => gameStore.winDistribution)

function getBarWidth(n) {
  const values = Object.values(winDistribution.value)
  const max = Math.max(...values)
  const count = winDistribution.value[n] || 0
  if (max === 0) return 0
  return Math.max(Math.round((count / max) * 100), count > 0 ? 8 : 0)
}

function colorToEmoji(color) {
  switch (color) {
    case '#16a34a': return '🟩'
    case '#D97706': return '🟨'
    default: return '⬛'
  }
}

function generateEmojiGrid(guesses) {
  return guesses.map(guess => {
    const feedback = guess.feedback
    return [
      colorToEmoji(feedback.year.color),
      colorToEmoji(feedback.team),
      colorToEmoji(feedback.conference),
      colorToEmoji(feedback.weight_class.color),
      colorToEmoji(feedback.win_percentage.color),
      colorToEmoji(feedback.ncaa_finish.color),
    ].join('')
  }).join('\n')
}

const generateTweetText = () => {
  const authStore = useAuthStore()
  const { previousGuesses, gameState, currentStreak } = gameStore
  if (!authStore.isAuthenticated || gameState !== 'won') return null
  const emojiGrid = generateEmojiGrid(previousGuesses)
  return `#GableGame\nI guessed today's wrestler in ${previousGuesses.length} ${previousGuesses.length === 1 ? 'try' : 'tries'}!\nStreak: ${currentStreak} 🔥\n\nhttps://gablegame.com\n\n${emojiGrid}`
}
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--surface-alt);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: background 0.15s ease, color 0.15s ease;
}

.close-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.stats {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-title {
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0;
}

.result-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.92rem;
  color: var(--text-primary);
}

.result-win {
  border-color: var(--color-correct);
  background: color-mix(in srgb, var(--color-correct) 10%, var(--surface));
}

.result-loss {
  border-color: var(--color-close);
  background: color-mix(in srgb, var(--color-close) 10%, var(--surface));
}

.result-icon {
  font-size: 1.4rem;
}

.result-banner p {
  margin: 0;
}

/* 3-column stat grid */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface-alt);
  border-radius: 10px;
  padding: 0.65rem 0.25rem;
  gap: 2px;
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* Distribution */
.distribution {
  background: var(--surface-alt);
  border-radius: 10px;
  padding: 0.85rem 1rem;
}

.dist-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin: 0 0 0.75rem;
}

.dist-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  gap: 0.5rem;
}

.dist-label {
  width: 16px;
  font-weight: 700;
  font-size: 0.82rem;
  text-align: right;
  flex-shrink: 0;
  color: var(--text-primary);
}

.bar-container {
  flex-grow: 1;
  height: 20px;
  background-color: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: var(--color-correct);
  border-radius: 4px;
  transition: width 0.4s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.bar-count {
  font-size: 0.68rem;
  color: white;
  font-weight: 700;
  padding-right: 5px;
  white-space: nowrap;
}

.share-btn {
  display: block;
  text-align: center;
  padding: 0.55rem 1.25rem;
  background-color: var(--primary);
  color: var(--primary-text);
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.88rem;
  transition: background 0.15s ease;
  font-family: 'Inter', system-ui, sans-serif;
}

.share-btn:hover {
  background-color: var(--primary-hover);
  text-decoration: none;
}
</style>
