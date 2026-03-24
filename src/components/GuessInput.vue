<template>
  <div class="guess-input-wrapper">
    <div class="input-row" :class="{ disabled: gameStore.hasWon || gameStore.hasLost }">
      <Search class="search-icon" :size="18" />
      <input
        v-model="searchQuery"
        @input="filterWrestlers"
        @keydown.down="highlightNext"
        @keydown.up="highlightPrev"
        @keydown.enter.prevent="submitHighlightedGuess"
        @focus="showDropdown = true"
        @blur="hideDropdown"
        placeholder="Type a wrestler's name..."
        class="guess-input"
        autocomplete="off"
        :disabled="gameStore.hasWon || gameStore.hasLost"
      />
    </div>
    <div class="guess-total">
      {{ gameStore.previousGuesses.length }} / {{ gameStore.maxGuesses }} guesses
    </div>
    <ul v-if="showDropdown && filteredWrestlers.length" class="dropdown" ref="dropdownList">
      <li
        v-for="(name, index) in filteredWrestlers"
        :key="name"
        :class="{ highlighted: index === highlightedIndex }"
        @mousedown.prevent="submitGuess(name)"
        :ref="(el) => setDropdownItemRef(el, index)"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Search } from 'lucide-vue-next'
import { useDailyGameStore } from '@/store/dailyGame.store'

const gameStore = useDailyGameStore()
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const showDropdown = ref(false)
const dropdownList = ref(null)
const dropdownItems = ref([])

const filteredWrestlers = computed(() =>
  searchQuery.value
    ? gameStore.allWrestlers.filter((name) =>
        name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    : [],
)

const setDropdownItemRef = (el, index) => {
  if (el) dropdownItems.value[index] = el
}

const highlightNext = async () => {
  if (highlightedIndex.value < filteredWrestlers.value.length - 1) {
    highlightedIndex.value++
    await nextTick()
    scrollToHighlighted()
  }
}

const highlightPrev = async () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
    await nextTick()
    scrollToHighlighted()
  }
}

const scrollToHighlighted = () => {
  const item = dropdownItems.value[highlightedIndex.value]
  if (item && dropdownList.value) {
    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

const submitHighlightedGuess = () => {
  if (highlightedIndex.value >= 0) {
    submitGuess(filteredWrestlers.value[highlightedIndex.value])
  }
}

const submitGuess = (name) => {
  if (!name) return
  gameStore.submitGuess(name)
  searchQuery.value = ''
  showDropdown.value = false
  highlightedIndex.value = -1
  document.activeElement.blur()
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
    highlightedIndex.value = -1
  }, 150)
}
</script>

<style scoped>
.guess-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 540px;
  margin: 1.25rem auto 0;
  font-family: 'Inter', system-ui, sans-serif;
}

.input-row {
  display: flex;
  align-items: center;
  height: 48px;
  border: 2px solid var(--border);
  border-radius: 24px;
  padding: 0 1.1rem;
  background: var(--surface);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.input-row:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.2);
}

.input-row.disabled {
  background: var(--surface-alt);
  border-color: var(--border);
  opacity: 0.6;
  cursor: not-allowed;
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  margin-right: 0.6rem;
}

.guess-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 0.95rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-primary);
}

.guess-input::placeholder {
  color: var(--text-muted);
}

.guess-input:disabled {
  cursor: not-allowed;
  color: var(--text-muted);
}

.guess-total {
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-weight: 500;
}

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  list-style: none;
  padding: 0.3rem 0;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 12px;
  max-height: 220px;
  overflow-y: auto;
  background: var(--surface);
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.dropdown li {
  padding: 0 1rem;
  min-height: 44px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.92rem;
  color: var(--text-primary);
  border-left: 3px solid transparent;
  transition: background 0.1s ease, border-color 0.1s ease;
}

.dropdown li:hover,
.dropdown li.highlighted {
  background: var(--surface-alt);
  border-left-color: var(--primary);
}
</style>
