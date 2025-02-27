<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        <h2>How to Play</h2>
        <p>Guess the NCAA wrestler based on given hints...</p>
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
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
