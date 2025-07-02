import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://gable-game-backend.onrender.com'
const today = new Date().toISOString().split('T')[0];

export const useGameStore = defineStore('game', {
  state: () => ({
    dailyWrestler: null,
    allWrestlers: [],
    maxGuesses: 8,
    years: { "FR": 1, "SO": 2, "JR": 3, "SR": 4 },
    finishes: { "NQ": 1, "R16": 2, "R12": 3, "8th": 4, "7th": 5, "6th": 6, "5th": 7, "4th": 8, "3rd": 9, "2nd": 10, "1st": 11 },
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
    previousGuesses: [],
    gameState: 'playing',
    totalWins: 0,
    totalLosses: 0,
    winDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
    currentStreak: 0,
    maxStreak: 0,
    lastWinDate: '',
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
    async initializeGame() {
      const authStore = useAuthStore();
      await this.fetchDailyWrestler();
      await this.fetchAllWrestlers();

      if (authStore.isAuthenticated) {
        await this.loadUserGuessesForToday();
        await this.loadUserStats();
      } else {
        this.loadStoredGameState();
      }
    },
    async loadUserGuessesForToday() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/guesses`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        if (response.data.guesses == null) {
          return
        }

        if (!this.dailyWrestler) {
          await this.fetchDailyWrestler();
        }

        this.previousGuesses = response.data.guesses.map(g => ({
          ...g,
          feedback: this.getFeedback(g)
        }));

        if (this.previousGuesses.some(g => g.name === this.dailyWrestler.name)) {
          this.gameState = 'won';
        } else if (this.previousGuesses.length >= this.maxGuesses) {
          this.gameState = 'lost';
        } else {
          this.gameState = 'playing';
        }
      } catch (error) {
        console.error('Failed to load user guesses:', error);
      }
    }
    ,

    async fetchDailyWrestler() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/daily`);
        const storedDaily = localStorage.getItem('gable-daily-wrestler');
        if (!storedDaily) {
          this.initializeLocal()
          this.dailyWrestler = response.data
          localStorage.setItem('gable-daily-wrestler', JSON.stringify(this.dailyWrestler))
          this.gameState = 'playing'
          localStorage.setItem('gable-game-state', 'playing');
        } else if (response.data.name !== JSON.parse(storedDaily).name) {
          this.dailyWrestler = response.data
          this.gameState = 'playing'
          localStorage.setItem('gable-game-state', 'playing');
          this.previousGuesses = [];
          localStorage.removeItem('gable-game-guesses');
          localStorage.setItem('gable-daily-wrestler', JSON.stringify(this.dailyWrestler))
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

      this.gameState = localStorage.getItem('gable-game-state')
      this.totalWins = parseInt(localStorage.getItem('gable-total-wins'));
      this.totalLosses = parseInt(localStorage.getItem('gable-total-losses'));
      this.currentStreak = parseInt(localStorage.getItem('gable-current-streak'));
      this.maxStreak = parseInt(localStorage.getItem('gable-max-streak'));
      this.lastWinDate = localStorage.getItem('gable-last-win-date');
      this.winDistribution = JSON.parse(localStorage.getItem('gable-win-distribution')) || {};
    },

    async loadUserStats() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/stats`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        const stats = response.data;
        this.totalWins = stats.total_wins;
        this.totalLosses = stats.total_losses;
        this.currentStreak = stats.current_streak;
        this.maxStreak = stats.max_streak;
        this.lastWinDate = stats.last_win_date;
        this.winDistribution = stats.win_distribution || {};

      } catch (err) {
        console.error("Failed to load user stats:", err);
      }
    },

    async submitGuess(name) {
      const authStore = useAuthStore();
      const isAuthenticated = authStore.isAuthenticated
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/wrestlers?name=${encodeURIComponent(name)}`,
        )
        const guessedWrestler = response.data;
        if (isAuthenticated) {
          await this.saveUserGuess(guessedWrestler)

        } else {
          this.saveGuestGuess(guessedWrestler)
        }

      } catch (error) {
        console.error('Wrestler not found:', error)
      }
    },

    async saveUserGuess(guessedWrestler) {
      const authStore = useAuthStore();
      const today = new Date().toISOString().split('T')[0];

      await axios.post(`${API_BASE_URL}/api/user/guess`, {
        wrestler_id: guessedWrestler.id,
        guess_date: today,
        guess_order: this.previousGuesses.length + 1
      }, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      this.previousGuesses.push({
        ...guessedWrestler,
        feedback: this.getFeedback(guessedWrestler)
      })

      if (guessedWrestler.name === this.dailyWrestler.name) {
        this.gameState = 'won';
        await axios.post(`${API_BASE_URL}/api/user/stats`, {
          result: 'win',
          guesses: this.previousGuesses.length,
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        await this.loadUserStats();
      } else if (this.previousGuesses.length >= this.maxGuesses) {
        this.gameState = 'lost'
        await axios.post(`${API_BASE_URL}/api/user/stats`, {
          result: 'loss',
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        await this.loadUserStats();
      }
    },

    saveGuestGuess(guessedWrestler) {
      this.processGuess(guessedWrestler);
    },

    processGuess(guessedWrestler) {
      const today = new Date().toISOString().split('T')[0];

      // Always store the guess with feedback
      const feedback = this.getFeedback(guessedWrestler);
      const guessWithFeedback = { ...guessedWrestler, feedback };
      this.previousGuesses.push(guessWithFeedback);

      localStorage.setItem('gable-game-guesses', JSON.stringify(this.previousGuesses));

      // Win condition
      if (guessedWrestler.name === this.dailyWrestler.name) {
        this.gameState = 'won';
        localStorage.setItem('gable-game-state', 'won');
        localStorage.setItem('gable-total-wins', parseInt(localStorage.getItem('gable-total-wins')) + 1);
        this.updateWinDistribution();

        // Streak logic
        const lastWin = localStorage.getItem('gable-last-win-date');
        const currentStreak = parseInt(localStorage.getItem('gable-current-streak'));
        const maxStreak = parseInt(localStorage.getItem('gable-max-streak'));

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (lastWin === yesterdayStr) newStreak = currentStreak + 1;

        localStorage.setItem('gable-last-win-date', today);
        localStorage.setItem('gable-current-streak', newStreak);
        if (newStreak > maxStreak) {
          localStorage.setItem('gable-max-streak', newStreak);
        }

      } else if (this.previousGuesses.length >= this.maxGuesses) {
        this.gameState = 'lost';
        localStorage.setItem('gable-game-state', 'lost');
        localStorage.setItem('gable-total-losses', parseInt(localStorage.getItem('gable-total-losses')) + 1);
      }

      this.totalWins = parseInt(localStorage.getItem('gable-total-wins'));
      this.totalLosses = parseInt(localStorage.getItem('gable-total-losses'));
      this.currentStreak = parseInt(localStorage.getItem('gable-current-streak'));
      this.maxStreak = parseInt(localStorage.getItem('gable-max-streak'));
      this.lastWinDate = localStorage.getItem('gable-last-win-date');
      this.winDistribution = JSON.parse(localStorage.getItem('gable-win-distribution')) || {};
    }
    ,

    getFeedback(guessedWrestler) {
      if (!this.dailyWrestler) return {}

      return {
        name: this.compareValue(guessedWrestler.name, this.dailyWrestler.name),
        weight_class: this.compareWeight(guessedWrestler.weight_class, this.dailyWrestler.weight_class),
        year: this.compareYear(guessedWrestler.year, this.dailyWrestler.year),
        team: this.compareValue(guessedWrestler.team, this.dailyWrestler.team),
        conference: this.compareValue(guessedWrestler.conference, this.dailyWrestler.conference),
        win_percentage: this.comparePercentage(guessedWrestler.win_percentage, this.dailyWrestler.win_percentage),
        ncaa_finish: this.compareFinish(guessedWrestler.ncaa_finish, this.dailyWrestler.ncaa_finish)
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

    compareFinish(guess, correct) {
      const guessIndex = this.finishes[guess]
      const correctIndex = this.finishes[correct]
      if (guessIndex == correctIndex) return { color: '#1a690e', icon: '' }
      if (Math.abs(guessIndex - correctIndex) == 1) return { color: '#aba00a', icon: guessIndex > correctIndex ? 'down' : 'up' }
      return { color: '#a6b0bf', icon: guessIndex > correctIndex ? 'down' : 'up' }
    },

    comparePercentage(guess, correct) {
      const guessNum = parseFloat(guess)
      const correctNum = parseFloat(correct)
      if (guessNum === correctNum) return { color: '#1a690e', icon: '' }
      if (Math.abs(guessNum - correctNum) <= 5) return { color: '#aba00a', icon: guessNum > correctNum ? 'down' : 'up' }
      return { color: '#a6b0bf', icon: guessNum > correctNum ? 'down' : 'up' }
    },


    compareYear(guess, correct) {
      const guessIndex = this.years[guess]
      const correctIndex = this.years[correct]
      if (guessIndex == correctIndex) return { color: '#1a690e', icon: '' }
      else return { color: '#a6b0bf', icon: guessIndex > correctIndex ? 'down' : 'up' }
    },

    initializeLocal() {
      localStorage.setItem('gable-win-distribution', JSON.stringify({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, }))
      localStorage.setItem('gable-total-wins', 0)
      localStorage.setItem('gable-total-losses', 0)
      localStorage.setItem('gable-current-streak', 0)
      localStorage.setItem('gable-max-streak', 0)
      localStorage.setItem('gable-last-win-date', '1970-01-01')
    },

    updateWinDistribution() {
      const dist = JSON.parse(localStorage.getItem('gable-win-distribution'));

      dist[this.previousGuesses.length]++;

      localStorage.setItem('gable-win-distribution', JSON.stringify(dist));
    },
  },
})
