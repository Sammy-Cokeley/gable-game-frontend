<template>
  <div class="guess-table-wrapper">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Year</th>
            <th>Team</th>
            <th>Conference</th>
            <th>Weight Class</th>
            <th>Win Percentage</th>
            <th>NCAA Finish</th>
          </tr>
        </thead>
        <tbody v-if="gameStore.previousGuesses.length">
          <tr v-for="guess in gameStore.previousGuesses" :key="guess.name">
            <td :style="{ backgroundColor: guess.feedback.name }" class="name-box">
              <span class="name"> {{ guess.name }}</span>
            </td>
            <td :style="{ backgroundColor: guess.feedback.year.color }">
              {{ guess.year }}
              <MoveUp v-if="guess.feedback.year.icon === 'up'" />
              <MoveDown v-if="guess.feedback.year.icon === 'down'" />
            </td>
            <td :style="{ backgroundColor: guess.feedback.team }">{{ guess.team }}</td>
            <td :style="{ backgroundColor: guess.feedback.conference }">{{ guess.conference }}</td>
            <td :style="{ backgroundColor: guess.feedback.weight_class.color }">
              <div class="data">
                {{ guess.weight_class }}
                <MoveUp v-if="guess.feedback.weight_class.icon === 'up'" />
                <MoveDown v-if="guess.feedback.weight_class.icon === 'down'" />
              </div>
            </td>
            <td :style="{ backgroundColor: guess.feedback.win_percentage.color }">
              <div class="data">
                {{ guess.win_percentage.slice(0, -2) }}%
                <MoveUp v-if="guess.feedback.win_percentage.icon === 'up'" />
                <MoveDown v-if="guess.feedback.win_percentage.icon === 'down'" />
              </div>
            </td>
            <td :style="{ backgroundColor: guess.feedback.ncaa_finish.color }">
              <div class="data">
                {{ guess.ncaa_finish }}
                <MoveUp v-if="guess.feedback.ncaa_finish.icon === 'up'" />
                <MoveDown v-if="guess.feedback.ncaa_finish.icon === 'down'" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'
import { MoveUp, MoveDown } from 'lucide-vue-next'
const gameStore = useGameStore()
</script>

<style scoped>
/* Default styles (for desktop and wider screens) */
table {
  width: 100%;
  min-width: 600px;
  font-size: 16px;
}

/* Smaller screen: shrink font and table min-width */
@media (max-width: 768px) {
  table {
    min-width: 500px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  table {
    min-width: 400px;
    font-size: 12px;
  }

  th,
  td {
    padding: 6px;
  }
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

.guess-table-wrapper {
  width: 100%;
  margin-top: 1rem;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 600px;
  /* This forces scroll on small screens */
}

th,
td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>
