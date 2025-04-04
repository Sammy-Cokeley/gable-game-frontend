import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://gable-game-backend.onrender.com'

export const useGameStore = defineStore('game', {
  state: () => ({
    dailyWrestler: null,
    allWrestlers: [],
    previousGuesses: [],
    maxGuesses: 8,
    gameState: localStorage.getItem('gable-state') ? localStorage.getItem('gable-state') : 'playing',
    weightClasses: {
      125: 1,
      133: 2,
      141: 3,
      149: 4,
      157: 5,
      165: 6,
      174: 7,
      184: 8,
      197: 9,
      285: 10,
    },
  }),

  getters: {
    remainingGuesses(state) {
      return state.maxGuesses - state.previousGuesses.length;
    },
    hasWon(state) {
      return state.gameState === 'won';
    },
    hasLost(state) {
      return state.gameState === 'lost'
    }
  },

  actions: {
    async fetchDailyWrestler() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/daily`);
        const storedDaily = localStorage.getItem('gable-game-daily');
        if(!storedDaily) {
          this.initializeLocal()
          this.dailyWrestler = response.data
          localStorage.setItem('gable-game-daily', JSON.stringify(this.dailyWrestler))
          this.gameState = 'playing'
          localStorage.setItem('gable-state', 'playing');
        } else if(response.data.name !== JSON.parse(storedDaily).name){
          this.dailyWrestler = response.data
          this.gameState = 'playing'
          localStorage.setItem('gable-state', 'playing');
          this.previousGuesses = [];
          localStorage.removeItem('gable-game-guesses');
          localStorage.setItem('gable-game-daily', JSON.stringify(this.dailyWrestler))
        } else {
          this.dailyWrestler = JSON.parse(storedDaily)
        }
      } catch (err) {
        console.error('Error fetching daily wrestler:', err)
      }
    },

    async fetchAllWrestlers() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/wrestlers`)
        this.allWrestlers = response.data.map((wrestler) => wrestler.name)
      } catch (error) {
        console.error('Error fetching wrestlers:', error)
      }
    },

    loadStoredGameState() {
      const storedGuesses = localStorage.getItem('gable-game-guesses');
      if (storedGuesses) {
        this.previousGuesses = JSON.parse(storedGuesses);
      }
    },

    async submitGuess(name) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/wrestlers?name=${encodeURIComponent(name)}`,
        )
        const guessedWrestler = response.data;

        this.previousGuesses.unshift({
          ...guessedWrestler,
          feedback: this.getFeedback(guessedWrestler),
        });
        localStorage.setItem('gable-game-guesses', JSON.stringify(this.previousGuesses));

        if (guessedWrestler.name == this.dailyWrestler.name) {
          localStorage.setItem('gable-state', 'won')
          this.calculateGuessStat()
          localStorage.setItem('total-wins', parseInt(localStorage.getItem('total-wins')) + 1)
          this.gameState = 'won';
        } else if (this.previousGuesses.length >= this.maxGuesses) {
          localStorage.setItem('gable-state', 'lost')
          localStorage.setItem('total-losses', parseInt(localStorage.getItem('total-losses')) + 1)
          this.gameState = 'lost';
        }
      } catch (error) {
        console.error('Wrestler not found:', error)
      }
    },

    getFeedback(guessedWrestler) {
      if (!this.dailyWrestler) return {}

      console.log(guessedWrestler)

      return {
        name: this.compareValue(guessedWrestler.name, this.dailyWrestler.name),
        weight_class: this.compareWeight(
          guessedWrestler.weight_class,
          this.dailyWrestler.weight_class,
        ),
        team: this.compareValue(guessedWrestler.team, this.dailyWrestler.team),
        conference: this.compareValue(guessedWrestler.conference, this.dailyWrestler.conference),
        wins: this.compareNumber(guessedWrestler.wins, this.dailyWrestler.wins),
        losses: this.compareNumber(guessedWrestler.losses, this.dailyWrestler.losses),
      }
    },

    compareValue(guess, correct) {
      return guess === correct ? '#1a690e' : '#a6b0bf'
    },

    compareWeight(guess, correct) {
      const guessIndex = this.weightClasses[guess]
      const correctIndex = this.weightClasses[correct]
      if (guessIndex === correctIndex) return { color: '#1a690e', icon: '' }
      if (Math.abs(guessIndex - correctIndex) == 1)
        return { color: '#aba00a', icon: guessIndex > correctIndex ? 'down' : 'up' }
      return { color: '#a6b0bf', icon: guessIndex > correctIndex ? 'down' : 'up' }
    },

    compareNumber(guess, correct) {
      if (guess === correct) return { color: '#1a690e', icon: '' }
      if (Math.abs(guess - correct) <= 3)
        return { color: '#aba00a', icon: guess > correct ? 'down' : 'up' }
      return { color: '#a6b0bf', icon: guess > correct ? 'down' : 'up' }
    },

    initializeLocal() {
      console.log("local init")
      localStorage.setItem('total-wins', 0)
      localStorage.setItem('total-losses', 0)
      localStorage.setItem('one-wins', 0)
      localStorage.setItem('two-wins', 0)
      localStorage.setItem('three-wins', 0)
      localStorage.setItem('four-wins', 0)
      localStorage.setItem('five-wins', 0)
      localStorage.setItem('six-wins', 0)
      localStorage.setItem('seven-wins', 0)
      localStorage.setItem('eight-wins', 0)
      console.log(localStorage)
    },

    calculateGuessStat() {
      switch(this.previousGuesses.length) {
        case 1:
          localStorage.setItem('one-wins', parseInt(localStorage.getItem('one-wins')) + 1)
          break;
        case 2:
          localStorage.setItem('two-wins', parseInt(localStorage.getItem('two-wins')) + 1)
          break;
        case 3:
          localStorage.setItem('three-wins', parseInt(localStorage.getItem('three-wins')) + 1)
          break;
        case 4:
          localStorage.setItem('four-wins', parseInt(localStorage.getItem('four-wins')) + 1)
          break;
        case 5:
          localStorage.setItem('five-wins', parseInt(localStorage.getItem('five-wins')) + 1)
          break;
        case 6:
          localStorage.setItem('six-wins', parseInt(localStorage.getItem('six-wins')) + 1)
          break;
        case 7:
          localStorage.setItem('seven-wins', parseInt(localStorage.getItem('seven-wins')) + 1)
          break;
        case 8:
          localStorage.setItem('eight-wins', parseInt(localStorage.getItem('eight-wins')) + 1)
          break;
      }
    },
  },
})
