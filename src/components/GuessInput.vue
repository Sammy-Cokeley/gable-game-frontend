<template>
  <div class="flex flex-col items-center space-y-4">
    <input v-model="searchQuery" @input="filterWrestlers" @keydown.down="highlightNext" @keydown.up="highlightPrev"
      @keydown.enter.prevent="submitHighlightedGuess" @focus="showDropdown = true" @blur="hideDropdown"
      placeholder="Type a wrestler's name..." class="input" autocomplete="off" />
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

onMounted(() => {
  gameStore.fetchDailyWrestler()
  gameStore.fetchAllWrestlers()
})

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
  width: 400px;
  padding: 8px;
  border: 1px solid #ccc;
}

.dropdown {
  width: 400px;
  list-style: none;
  padding: 0;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  background: white;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li.highlighted {
  background: lightgray;
}
</style>
