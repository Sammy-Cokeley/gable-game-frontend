import { defineStore } from 'pinia'
import authService from '../services/auth.service'
import api from '../services/api'
import router from '../router'

const ADMIN_EMAILS = new Set([
  'sammy.cokeley@gmail.com'
])

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser(),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user?.token,
    token: (state) => state.user?.token || null,
    isAdmin: (state) => !!state.user?.email && ADMIN_EMAILS.has(state.user.email)
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const data = await authService.login(email, password)

        this.user = authService.getCurrentUser()

        router.push('/')
        return data
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(email, password) {
      this.loading = true
      this.error = null
      try {
        await authService.register(email, password)
        localStorage.setItem('pending-verification-email', email)
        router.push('/verify-email')
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      authService.logout()
      this.user = null
      router.push('/login')
    },

    async fetchUserProfile() {
      if (!this.isAuthenticated) return
      this.loading = true
      try {
        const { data } = await api.get('/api/me')

        this.user = { ...this.user, ...data }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        if (error.response?.status === 401) this.logout()
      } finally {
        this.loading = false
      }
    },

    initializeAuth() {
      this.user = authService.getCurrentUser()
    }
  }
})
