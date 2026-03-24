<template>
  <Header />
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Create Account</h2>

      <div v-if="authStore.error" class="error-message" role="alert">
        {{ authStore.error }}
      </div>
      <div v-if="passwordMismatch" class="error-message" role="alert">
        Passwords do not match
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="Enter your email" class="form-input" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required placeholder="Create a password" class="form-input" />
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required placeholder="Confirm password" class="form-input" />
        </div>

        <button type="submit" :disabled="authStore.loading" class="submit-btn">
          {{ authStore.loading ? 'Creating account…' : 'Register' }}
        </button>
      </form>

      <div class="auth-footer">
        Already have an account?
        <router-link to="/login" class="auth-link">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth.store'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordMismatch = ref(false)
const authStore = useAuthStore()

const handleRegister = async () => {
  passwordMismatch.value = password.value !== confirmPassword.value
  if (passwordMismatch.value) return

  try {
    await authStore.register(email.value, password.value)
  } catch (error) {
    console.error('Registration failed', error)
  }
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 2rem 1rem;
}

.auth-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.auth-title {
  text-align: center;
  color: var(--text-primary);
  margin: 0 0 1.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Inter', system-ui, sans-serif;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: 'Inter', system-ui, sans-serif;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--surface-alt);
  color: var(--text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.2);
  background: var(--surface);
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary);
  color: var(--primary-text);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  transition: background 0.15s ease;
  margin-top: 0.25rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: var(--error);
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.65rem 0.9rem;
  background: color-mix(in srgb, var(--error) 10%, var(--surface));
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--error) 30%, transparent);
}

.auth-footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-family: 'Inter', system-ui, sans-serif;
}

.auth-link {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  margin-left: 0.25rem;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
