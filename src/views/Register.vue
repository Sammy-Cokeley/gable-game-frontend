<template>
    <div class="auth-container">
        <div class="auth-box">
            <h2 class="auth-title">Create Account</h2>

            <div v-if="authStore.error" class="error-message">
                {{ authStore.error }}
            </div>

            <form @submit.prevent="handleRegister" class="auth-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required placeholder="Enter your email"
                        class="form-input" />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" required placeholder="Create a password"
                        class="form-input" />
                </div>

                <button type="submit" :disabled="authStore.loading" class="submit-button">
                    {{ authStore.loading ? 'Creating account...' : 'Register' }}
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
import { ref } from 'vue';
import { useAuthStore } from '@/services/auth.store';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleRegister = async () => {
    try {
        await authStore.register(email.value, password.value);
    } catch (error) {
        console.error('Registration failed', error);
    }
};
</script>

<style scoped>
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
}

.auth-box {
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.auth-title {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 28px;
    font-weight: 600;
}

.auth-form {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
    background-color: #f8f9fa;
}

.form-input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    background-color: white;
}

.submit-button {
    width: 100%;
    padding: 14px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover:not(:disabled) {
    background: #357abd;
    transform: translateY(-1px);
}

.submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error-message {
    color: #e74c3c;
    text-align: center;
    margin-bottom: 15px;
    padding: 10px;
    background: #fee;
    border-radius: 6px;
    font-size: 14px;
}

.auth-footer {
    text-align: center;
    color: #666;
    font-size: 14px;
}

.auth-link {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

.auth-link:hover {
    color: #357abd;
    text-decoration: underline;
}

.verification-notice {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.verification-notice p {
    margin-bottom: 10px;
    color: #666;
    font-size: 14px;
}

.resend-button {
    background: none;
    border: 1px solid #4a90e2;
    color: #4a90e2;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.resend-button:hover {
    background: #4a90e2;
    color: white;
}
</style>