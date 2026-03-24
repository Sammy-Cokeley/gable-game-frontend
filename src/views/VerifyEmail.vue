<template>
  <Header />
  <div class="auth-container">
    <div class="auth-card">
      <div v-if="loading" class="verify-state">
        <div class="arena-spinner" style="margin: 0 auto 1rem;"></div>
        <h2>Verifying your email…</h2>
        <p>Please wait while we verify your email address.</p>
      </div>

      <div v-else-if="verified" class="verify-state">
        <div class="status-icon success">✓</div>
        <h2>Email Verified!</h2>
        <p>Your email has been successfully verified.</p>
        <router-link to="/login" class="submit-btn">Login to your account</router-link>
      </div>

      <div v-else-if="verificationPending" class="verify-state">
        <div class="status-icon pending">✉</div>
        <h2>Check Your Inbox</h2>
        <p>
          A verification link has been sent to <strong>{{ email }}</strong>.
          Please click the link in your email to complete registration.
        </p>
      </div>

      <div v-else class="verify-state">
        <div class="status-icon error">✕</div>
        <h2>Verification Failed</h2>
        <p>{{ errorMessage }}</p>
        <button @click="resendVerification" class="submit-btn">
          Resend Verification Email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const loading = ref(true)
const verified = ref(false)
const errorMessage = ref('')
const email = ref('')
const verificationPending = ref(false)

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://gable-game-backend.onrender.com'

onMounted(async () => {
  const token = route.query.token
  email.value = route.query.email || localStorage.getItem('pending-verification-email')

  if (token && email.value) {
    try {
      await axios.post(`${API_BASE_URL}/api/gable/verify-email`, null, {
        params: { token, email: email.value }
      })
      verified.value = true
    } catch (error) {
      errorMessage.value = error.response?.data?.error || 'Verification failed. Please try again.'
    } finally {
      loading.value = false
    }
  } else if (email.value) {
    loading.value = false
    verificationPending.value = true
  } else {
    loading.value = false
    errorMessage.value = 'Invalid access. Please register again.'
  }
})

const resendVerification = async () => {
  if (!email.value) return
  try {
    await axios.post(`${API_BASE_URL}/api/gable/resend-verification`, { email: email.value })
    alert('Verification email has been sent. Please check your inbox.')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to resend verification email.')
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
  max-width: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.verify-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.verify-state h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
}

.verify-state p {
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0;
}

.status-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.status-icon.success {
  background: color-mix(in srgb, var(--color-correct) 15%, var(--surface));
  color: var(--color-correct);
}

.status-icon.pending {
  background: var(--surface-alt);
  color: var(--primary);
}

.status-icon.error {
  background: color-mix(in srgb, var(--error) 15%, var(--surface));
  color: var(--error);
}

.submit-btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.7rem 1.75rem;
  background: var(--primary);
  color: var(--primary-text);
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease;
}

.submit-btn:hover {
  background: var(--primary-hover);
  text-decoration: none;
}
</style>
