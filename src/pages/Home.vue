<template>
  <div class="container">
    <Header />
    <GuessInput />
    <GameTable />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import GuessInput from '@/components/GuessInput.vue'
import GameTable from '@/components/GameTable.vue'
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: JetBrains Mono;
}
</style>
