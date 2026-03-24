import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth.store';

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://gable-game-backend.onrender.com'
const GAME_API = `${API_BASE_URL}/api/gable`

export const useMatchGameStore = defineStore('game', {
  state: () => ({
    match: null,
    wrestlerA: null,
    wrestlerB: null,
    currentStep: 0,
    revealedHints: [],
  }),

  actions: {
    async getMatch() {
      try {
        const response = await axios.get(
          `${GAME_API}/match`,
        )
        this.match = response.data.match;
        this.wrestlerA = response.data.wrestlerA;
        this.wrestlerB = response.data.wrestlerB;

        this.revealedHints[0] = this.match.result_method + " " + this.match.result_score;
        this.revealedHints[1] = this.match.round;
        this.revealedHints[2] = this.match.weight;
        this.revealedHints[3] = this.wrestlerA.conference;
        this.revealedHints[4] = this.wrestlerB.conference;
        this.revealedHints[5] = parseFloat(this.wrestlerA.win_percentage).toFixed(1) + "% " + this.wrestlerA.ncaa_finish;
        this.revealedHints[6] = parseFloat(this.wrestlerB.win_percentage).toFixed(1) + "% " + this.wrestlerB.ncaa_finish;
        console.log(this.revealedHints)
      } catch (error) {
        console.error('Wrestler not found:', error)
      }
    },
    submitGuess(wrestlerA, wrestlerB) {
      if (wrestlerA == this.wrestlerA.name && wrestlerB == this.wrestlerB.name) {
        console.log("Good job!")
      } else if (this.currentStep < 8) {
        this.currentStep++

      }
    }
  },
})


