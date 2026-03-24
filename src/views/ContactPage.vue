<template>
  <Header />
  <div class="prose-page">
    <h1>Contact Us</h1>

    <div v-if="!authStore.isAuthenticated" class="info-banner">
      You must be logged in to use the contact form.
    </div>

    <form v-else @submit.prevent="submitForm" class="contact-form">
      <div class="form-group">
        <label for="name">Your Name (optional)</label>
        <input type="text" id="name" v-model="name" placeholder="Your name" class="form-input" />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" v-model="message" required placeholder="Write your message here…" class="form-input" rows="5"></textarea>
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Sending…' : 'Send Message' }}
      </button>
    </form>

    <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth.store'

const name = ref('')
const message = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await api.get('/api/gable/me')
    name.value = res.data.name || ''
  } catch {
    // Name pre-fill is optional; silently skip on error
  }
})

const submitForm = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await api.post('/api/gable/contact', {
      name: name.value,
      message: message.value,
    })
    successMessage.value = 'Message sent successfully!'
    name.value = ''
    message.value = ''
  } catch {
    errorMessage.value = 'Something went wrong. Please try again later.'
  } finally {
    loading.value = false
  }
}
</script>

<style src="../css/global-styles.css"></style>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 1.5rem;
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
  resize: vertical;
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
  align-self: flex-start;
  padding: 0.65rem 1.75rem;
  background: var(--primary);
  color: var(--primary-text);
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  transition: background 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-banner {
  padding: 0.85rem 1rem;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 1rem;
}

.success-banner {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  background: color-mix(in srgb, var(--color-correct) 10%, var(--surface));
  border: 1px solid var(--color-correct);
  border-radius: 8px;
  color: var(--color-correct);
  font-size: 0.9rem;
  font-weight: 500;
}

.error-banner {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  background: color-mix(in srgb, var(--error) 10%, var(--surface));
  border: 1px solid var(--error);
  border-radius: 8px;
  color: var(--error);
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
