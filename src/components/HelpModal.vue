<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="p-4 text-left space-y-4">
          <h2 class="text-xl font-bold"> How to Play</h2>
          <p>
            <strong>Gable</strong> is a daily wrestling guessing game featuring one of the
            <strong>330 NCAA Division I Qualifiers</strong> from the
            <strong>2024–25 season</strong>.
          </p>
          <p>
            Each day, a new wrestler is randomly selected. Your goal?
            <strong>Guess the wrestler</strong> by entering their name in the text box.
          </p>

          <h3 class="text-lg font-semibold">Submitting a Guess</h3>
          <ul class="list-disc pl-6 space-y-1">
            <li>Start typing a name — you'll see a dropdown of matching wrestlers.</li>
            <li>Select a name and press <strong>Enter</strong> to submit your guess.</li>
            <li>You’ll receive <strong>feedback</strong> on how close your guess is in various categories.</li>
          </ul>

          <h3 class="text-lg font-semibold">Feedback System</h3>
          <p>After each guess, a row will appear showing the information for the wrestler you guessed:</p>
          <p>Name, Year, Weight Class, Conference, Team, Win Percentage, and NCAA Finish</p>
          <p>Each category will be color-coded:</p>

          <ul class="list-disc pl-6 space-y-1">
            <li><span class="font-semibold text-green-700">🟩 Green:</span> Exact match. You’ve got that part
              correct!
            </li>
            <li><span class="font-semibold text-yellow-600">🟨 Yellow:</span> Close! For example:
              <ul class="list-disc pl-6">
                <li>One weight class above or below the correct one</li>
                <li>Win percentage within 5%</li>
                <li>Same conference but different team</li>
              </ul>
            </li>
            <li><span class="font-semibold">⬆️ / ⬇️ Arrows:</span> Directional hints.
              If the correct wrestler is at <strong>197 lbs</strong> and you guess <strong>165 lbs</strong>,
              you’ll see an <strong>up arrow</strong> (⬆️) next to the weight class.
            </li>
            <li><span class="font-semibold text-gray-600">⬛ Gray:</span> Not close.</li>
          </ul>

          <h3 class="text-lg font-semibold">📈 Track Your Progress</h3>
          <p>
            You can make up to <strong>8 guesses per day</strong>. The game ends when you:
          </p>
          <ul class="list-disc pl-6 space-y-1">
            <li>Guess correctly ✅</li>
            <li>Run out of guesses ❌</li>
          </ul>
          <p>
            Your results are stored automatically on your device. If you choose to create an account,
            you’ll be able to keep your streak across multiple devices.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const closeModal = () => (isOpen.value = false)
const openModal = () => (isOpen.value = true)

defineExpose({ openModal })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 0;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  text-align: left;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: JetBrains Mono;
}

.modal-content>.p-4 {
  padding: 20px;
  overflow-y: auto;
  max-height: 75vh;
  box-sizing: border-box;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
