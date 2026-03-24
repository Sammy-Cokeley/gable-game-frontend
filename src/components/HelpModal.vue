<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeModal" aria-label="Close">
            <X :size="18" />
          </button>

          <div class="help-body">
            <h2 class="help-title">How to Play</h2>

            <p>
              <strong>Gable</strong> is a daily wrestling guessing game featuring one of the
              <strong>330 NCAA Division I Qualifiers</strong> from the
              <strong>2025–26 season</strong>.
            </p>
            <p>
              Each day, a new wrestler is randomly selected. Your goal?
              <strong>Guess the wrestler</strong> by entering their name in the text box.
            </p>

            <h3>Submitting a Guess</h3>
            <ul>
              <li>Start typing a name — you'll see a dropdown of matching wrestlers.</li>
              <li>Select a name and press <strong>Enter</strong> to submit your guess.</li>
              <li>You'll receive <strong>feedback</strong> on how close your guess is in various categories.</li>
            </ul>

            <h3>Feedback System</h3>
            <p>After each guess, a row appears showing: Name, Year, Weight Class, Conference, Team, Win%, and NCAA Finish.</p>
            <p>Each category is color-coded:</p>

            <div class="legend">
              <div class="legend-item">
                <span class="legend-swatch correct"></span>
                <span><strong>Green</strong> — Exact match</span>
              </div>
              <div class="legend-item">
                <span class="legend-swatch close"></span>
                <span><strong>Amber</strong> — Close (one weight class away, win% within 5%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-swatch miss"></span>
                <span><strong>Gray</strong> — Not close</span>
              </div>
            </div>

            <p class="arrow-note">
              ↑ ↓ arrows show direction — if the correct wrestler weighs more, you'll see an up arrow next to weight class.
            </p>

            <h3>Streaks & Stats</h3>
            <p>
              You have <strong>8 guesses per day</strong>. Results are saved on your device. Create an account to sync your streak across devices.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const isOpen = ref(false)
const closeModal = () => (isOpen.value = false)
const openModal = () => (isOpen.value = true)

defineExpose({ openModal })
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
  max-width: 500px;
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

.help-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.help-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
  text-align: center;
}

h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0.5rem 0 0;
}

p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.65;
}

ul {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

li {
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.6;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-alt);
  border-radius: 10px;
  padding: 0.85rem 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.88rem;
  color: var(--text-primary);
}

.legend-swatch {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-swatch.correct { background-color: var(--color-correct); }
.legend-swatch.close   { background-color: var(--color-close); }
.legend-swatch.miss    { background-color: var(--color-miss); }

.arrow-note {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
