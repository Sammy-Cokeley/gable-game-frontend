<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Team</th>
          <th>Conference</th>
          <th>Weight Class</th>
          <th>Wins</th>
          <th>Losses</th>
        </tr>
      </thead>
      <tbody v-if="gameStore.previousGuesses.length">
        <tr v-for="guess in gameStore.previousGuesses" :key="guess.name">
          <td :stype="{ backgroundColor: guess.feedback.name }" class="name-box"><span class="name">{{ guess.name
          }}</span></td>
          <td :style="{ backgroundColor: guess.feedback.team }">{{ guess.team }}</td>
          <td :style="{ backgroundColor: guess.feedback.conference }">{{ guess.conference }}</td>
          <td :style="{ backgroundColor: guess.feedback.weight_class.color }">
            <div class="data">
              {{ guess.weight_class }}
              <MoveUp v-if="guess.feedback.weight_class.icon === 'up'" />
              <MoveDown v-if="guess.feedback.weight_class.icon === 'down'" />
            </div>
          </td>
          <td :style="{ backgroundColor: guess.feedback.wins.color }">
            <div class="data">
              {{ guess.wins }}
              <MoveUp v-if="guess.feedback.wins.icon === 'up'" />
              <MoveDown v-if="guess.feedback.wins.icon === 'down'" />
            </div>
          </td>
          <td :style="{ backgroundColor: guess.feedback.losses.color }">
            <div class="data">
              {{ guess.losses }}
              <MoveUp v-if="guess.feedback.losses.icon === 'up'" />
              <MoveDown v-if="guess.feedback.losses.icon === 'down'" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'
import { MoveUp, MoveDown } from 'lucide-vue-next'
const gameStore = useGameStore()
</script>

<style scoped>
table {
  width: 800px;
  border-collapse: collapse;
  margin-top: 10px;
}

thead tr {
  height: 40px;
}

th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid black;
}

th {
  background-color: #f4f4f4;
  font-weight: 800;
}

tbody tr {
  height: 80px;
}

.data {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name {
  font-weight: 800;
}
</style>
