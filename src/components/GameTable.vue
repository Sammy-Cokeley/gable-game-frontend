<template>
  <div class="guess-table-wrapper">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th class="year-col">
              <span class="desktop-only">Year</span>
              <span class="mobile-only">Yr</span>
            </th>
            <th>Team</th>
            <th>
              <span class="desktop-only">Conference</span>
              <span class="mobile-only">Conf.</span>
            </th>
            <th>Weight Class</th>
            <th>
              <span class="desktop-only">Win Percentage</span>
              <span class="mobile-only">Win %</span>
            </th>
            <th>NCAA Finish</th>
          </tr>
        </thead>
        <tbody v-if="gameStore.previousGuesses.length">
          <tr v-for="guess in gameStore.previousGuesses" :key="guess.name">
            <td :style="{ backgroundColor: guess.feedback.name }" class="name-box">
              <span class="name"> {{ guess.name }}</span>
            </td>
            <td :style="{ backgroundColor: guess.feedback.year.color }" class="year-cell">
              <div class="data">
                {{ guess.year }}
                <MoveUp v-if="guess.feedback.year.icon === 'up'" />
                <MoveDown v-if="guess.feedback.year.icon === 'down'" />
              </div>
            </td>
            <td :style="{ backgroundColor: guess.feedback.team }" class="team-cell">{{ guess.team }}</td>
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
.guess-table-wrapper {
  width: 100%;
  margin-top: 1rem;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
  word-wrap: break-word;
  white-space: normal;
}

.name-box {
  font-weight: bold;
}

.name {
  display: inline-block;
  max-width: 100%;
  overflow-wrap: break-word;
  font-size: 14px;
}

.data {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.mobile-only {
  display: none;
}

.desktop-only {
  display: inline;
}

td.name-box,
td.team-cell {
  font-size: 14px;
  white-space: normal;
  word-break: break-word;
}

.year-cell {
  width: 40px;
  max-width: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  white-space: nowrap;
  padding: 4px;
}

/* Responsive: Shrink for mobile */
@media (max-width: 768px) {
  table {
    font-size: 13px;
  }

  th,
  td {
    padding: 6px;
  }

  .name {
    font-size: 10px;
  }

  .data {
    gap: 2px;
  }

  td.name-box,
  td.team-cell {
    font-size: 12px;
  }

  .mobile-only {
    display: inline;
  }

  .desktop-only {
    display: none;
  }

  .year-col {
    width: 32px;
    font-size: 12px;
    padding: 2px;
  }
}

@media (max-width: 480px) {
  table {
    font-size: 12px;
  }

  th,
  td {
    padding: 2px;
  }

  .name {
    font-size: 8px;
  }

  .data {
    flex-direction: column;
    font-size: 12px;
  }

  td.name,
  td.team-cell {
    font-size: 9px;
  }
}
</style>
