<template>
  <div class="header">
    <div class="header-icons-left">
      <CircleHelp :stroke-width="2.5" :size="35" @click="openHelp" class="icons" />
      <ChartNoAxesColumnIncreasing :stroke-width="2.5" :size="35" @click="openStats" class="icons" />
    </div>
    <div class="title">
      <h1 class="gable">Gable</h1>
      <h3 class="gable-subtitle">Wrestling Guessing Game</h3>
    </div>
    <div class="header-icons-right"></div>
  </div>
  <HelpModal ref="helpModal" />
  <StatsModal ref="statsModal" />
</template>

<script setup>
import { ref } from 'vue'
import { CircleHelp, ChartNoAxesColumnIncreasing } from 'lucide-vue-next'
import HelpModal from '@/components/HelpModal.vue'
import StatsModal from '@/components/StatsModal.vue'

const helpModal = ref(null)
const statsModal = ref(null)
const openHelp = () => helpModal.value.openModal()
const openStats = () => statsModal.value.openModal()
</script>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.header-icons-left {
  margin: 5px 15px;
}

.header-icons-right {
  margin: 5px 50px;
}

.icons:hover {
  cursor: pointer;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gable {
  font-size: 80px;
  font-family: JetBrains Mono;
  font-weight: 800;
  letter-spacing: 10px;
  color: #021573;
  margin: 10px 0px;
}

.gable-subtitle {
  font-size: 40px;
  font-family: JetBrains Mono;
  font-weight: 600;
  color: #021573;
  margin: 4px 0px;
}
</style>
