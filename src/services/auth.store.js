import { defineStore } from 'pinia';
import authService from '../services/auth.service';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
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
        this.user = { token: data.token };
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
        await this.login(email, password);
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
    }
  }
});