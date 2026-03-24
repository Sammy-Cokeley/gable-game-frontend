<template>
  <div class="guess-table-wrapper">
    <div v-if="gameStore.previousGuesses.length === 0 && gameStore.gameState === 'playing'" class="empty-state">
      Make your first guess above ↑
    </div>
    <div v-else class="table-scroll">
      <table>
        <colgroup>
          <col class="col-name" />
          <col class="col-year" />
          <col class="col-team" />
          <col class="col-conf" />
          <col class="col-weight" />
          <col class="col-winpct" />
          <col class="col-finish" />
        </colgroup>
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
            <th>
              <span class="desktop-only">Weight Class</span>
              <span class="mobile-only">Wt</span>
            </th>
            <th>
              <span class="desktop-only">Win %</span>
              <span class="mobile-only">W%</span>
            </th>
            <th>
              <span class="desktop-only">NCAA Finish</span>
              <span class="mobile-only">Finish</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="gameStore.previousGuesses.length">
          <tr
            v-for="(guess, rowIndex) in gameStore.previousGuesses"
            :key="guess.name"
            class="guess-row"
            :style="{ animationDelay: `${rowIndex * 40}ms` }"
          >
            <td :class="cellClass(guess.feedback.name)" class="name-box">
              <span class="name">{{ guess.name }}</span>
            </td>
            <td :class="cellClass(guess.feedback.year.color)" class="year-cell">
              <div class="data">
                {{ guess.year }}
                <MoveUp v-if="guess.feedback.year.icon === 'up'" />
                <MoveDown v-if="guess.feedback.year.icon === 'down'" />
              </div>
            </td>
            <td :class="cellClass(guess.feedback.team)" class="team-cell">{{ guess.team }}</td>
            <td :class="cellClass(guess.feedback.conference)">{{ guess.conference }}</td>
            <td :class="cellClass(guess.feedback.weight_class.color)">
              <div class="data">
                {{ guess.weight_class }}
                <MoveUp v-if="guess.feedback.weight_class.icon === 'up'" />
                <MoveDown v-if="guess.feedback.weight_class.icon === 'down'" />
              </div>
            </td>
            <td :class="cellClass(guess.feedback.win_percentage.color)">
              <div class="data">
                {{ parseFloat(guess.win_percentage).toFixed(1) }}%
                <MoveUp v-if="guess.feedback.win_percentage.icon === 'up'" />
                <MoveDown v-if="guess.feedback.win_percentage.icon === 'down'" />
              </div>
            </td>
            <td :class="cellClass(guess.feedback.ncaa_finish.color)">
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
import { useDailyGameStore } from '@/store/dailyGame.store'
import { MoveUp, MoveDown } from 'lucide-vue-next'

const gameStore = useDailyGameStore()

const COLOR_CORRECT = '#16a34a'
const COLOR_CLOSE = '#D97706'

function cellClass(color) {
  if (color === COLOR_CORRECT) return 'cell cell-correct'
  if (color === COLOR_CLOSE) return 'cell cell-close'
  return 'cell cell-miss'
}
</script>

<style scoped>
.guess-table-wrapper {
  width: 100%;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: 2rem 0;
  font-family: 'Inter', system-ui, sans-serif;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 3px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
}

th {
  padding: 6px 4px;
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Fixed column widths */
.col-name   { width: 18%; }
.col-year   { width: 6%; }
.col-team   { width: 18%; }
.col-conf   { width: 14%; }
.col-weight { width: 10%; }
.col-winpct { width: 11%; }
.col-finish { width: 12%; }

/* Colored cells */
.cell {
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
  word-wrap: break-word;
  white-space: normal;
  font-weight: 600;
  color: var(--color-miss-text);
}

.cell-correct { background-color: var(--color-correct); color: #fff; }
.cell-close   { background-color: var(--color-close);   color: #fff; }
.cell-miss    { background-color: var(--color-miss);     color: var(--color-miss-text); }

/* Row slide-in animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.guess-row {
  animation: slideIn 0.25s ease forwards;
}

.name-box {
  font-weight: bold;
}

.name {
  display: inline-block;
  max-width: 100%;
  overflow-wrap: break-word;
  font-size: 13px;
}

.data {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
}

.mobile-only {
  display: none;
}

.desktop-only {
  display: inline;
}

.year-cell {
  width: 40px;
  max-width: 40px;
  text-align: center;
  font-size: 13px;
  white-space: nowrap;
  padding: 4px 2px;
}

@media (max-width: 768px) {
  table {
    font-size: 12px;
  }

  th {
    padding: 4px 1px;
    font-size: 10px;
    letter-spacing: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .cell {
    padding: 6px 2px;
  }

  .name {
    font-size: 10px;
  }

  .data {
    gap: 2px;
  }

  .mobile-only {
    display: inline;
  }

  .desktop-only {
    display: none;
  }
}

@media (max-width: 480px) {
  table {
    font-size: 11px;
    border-spacing: 2px;
  }

  th {
    padding: 3px 0;
    font-size: 9px;
    letter-spacing: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .cell {
    padding: 4px 2px;
  }

  .name {
    font-size: 8px;
  }

  .data {
    flex-direction: column;
    gap: 1px;
    font-size: 11px;
  }
}
</style>
