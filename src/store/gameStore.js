import { defineStore } from 'pinia'
import axios from 'axios'

export const useGameStore = defineStore('game', {
  state: () => ({
    dailyWrestler: null,
    allWrestlers: [],
    previousGuesses: [],
    currentGuess: '',
    feedback: null,
    loading: false,
    error: null,
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
  actions: {
    async fetchDailyWrestler() {
      try {
        const response = await axios.get('http://localhost:3000/api/daily')
        this.dailyWrestler = response.data
      } catch (err) {
        console.error('Error fetching daily wrestler:', err)
      }
    },

    async fetchAllWrestlers() {
      try {
        const response = await axios.get('http://localhost:3000/api/wrestlers')
        this.allWrestlers = response.data.map((wrestler) => wrestler.name)
      } catch (error) {
        console.error('Error fetching wrestlers:', error)
      }
    },

    async submitGuess(name) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/wrestlers?name=${encodeURIComponent(name)}`,
        )
        const guessedWrestler = response.data
        console.log(guessedWrestler)

        this.previousGuesses.unshift({
          ...guessedWrestler,
          feedback: this.getFeedback(guessedWrestler),
        })
        console.log(this.previousGuesses)
      } catch (error) {
        console.error('Wrestler not found:', error)
      }
    },

    getFeedback(guessedWrestler) {
      if (!this.dailyWrestler) return {}

      return {
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
  },
})
