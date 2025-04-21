<template>
  <div>
    <input v-model="searchQuery" @input="filterWrestlers" @keydown.down="highlightNext" @keydown.up="highlightPrev"
      @keydown.enter.prevent="submitHighlightedGuess" @focus="showDropdown = true" @blur="hideDropdown"
      placeholder="Type a wrestler's name..." class="input" autocomplete="off"
      :disabled="gameStore.hasWon || gameStore.hasLost" />
    <div class="guess-total">
      {{ gameStore.previousGuesses.length }} of {{ gameStore.maxGuesses }} Guesses
    </div>
    <ul v-if="showDropdown && filteredWrestlers.length" class="dropdown" ref="dropdownList">
      <li v-for="(name, index) in filteredWrestlers" :key="name" :class="{ highlighted: index === highlightedIndex }"
        @mousedown.prevent="submitGuess(name)" :ref="(el) => setDropdownItemRef(el, index)">
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { useGameStore } from '@/store/gameStore'

const gameStore = useGameStore()
const searchQuery = ref('')
const highlightedIndex = ref(0)
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
  if (el) {
    dropdownItems.value[index] = el
  }
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

// Hide dropdown when clicking outside
const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
    highlightedIndex.value = 0
  }, 150)
}
</script>

<style scoped>
.input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.dropdown {
  width: 100%;
  max-width: 400px;
  list-style: none;
  padding: 0;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  background: white;
  z-index: 10;
}

.dropdown li {
  padding: 12px;
  cursor: pointer;
  font-size: 1rem;
}

.dropdown li.highlighted {
  background: lightgray;
}

@media (max-width: 768px) {
  .input {
    max-width: 90%;
    padding: 8px;
    font-size: 0.9rem;
  }

  .dropdown {
    max-width: 90%;
  }

  .dropdown li {
    padding: 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .input {
    max-width: 100%;
    padding: 8px;
    font-size: 0.8rem;
  }

  .dropdown {
    max-width: 100%;
  }

  .dropdown li {
    padding: 8px;
    font-size: 0.8rem;
  }
}
</style>
