import { defineStore } from 'pinia';
import authService from '../services/auth.service';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('auth-token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const data = await authService.login(email, password);
        this.token = data.user || null;
        this.user = data.user;

        localStorage.setItem('auth-token', data.token)

        // const gameStore = useGameStore();
        // await gameStore.fetchDailyWrestler();
        // await gameStore.loadUserGuessesForToday();
        // await gameStore.loadUserStats();

        router.push('/');
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password) {
      this.loading = true;
      this.error = null;
      try {
        await authService.register(email, password);
        localStorage.setItem('pending-verification-email', email);
        router.push('/verify-email');
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      authService.logout();
      this.user = null;
      router.push('/login');
    },

    async fetchUserProfile() {
      if (!this.user) return;

      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/me`);
        this.user = { ...this.user, profile: response.data };
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    initializeAuth() {
      const token = localStorage.getItem('gable-token');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;

        // Optionally: decode token and set user info here
      }
    }

  }
});