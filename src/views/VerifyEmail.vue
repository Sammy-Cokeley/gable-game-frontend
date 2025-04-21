<template>
    <div class="verify-container">
        <div v-if="loading" class="verify-message">
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
        </div>

        <div v-else-if="verified" class="verify-message success">
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified.</p>
            <router-link to="/login" class="verify-button">
                Login to your account
            </router-link>
        </div>

        <div v-else class="verify-message error">
            <h2>Verification Failed</h2>
            <p>{{ errorMessage }}</p>
            <button @click="resendVerification" class="verify-button">
                Resend Verification Email
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const loading = ref(true);
const verified = ref(false);
const errorMessage = ref('');
const email = ref('');

const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : 'https://gable-game-backend.onrender.com'

onMounted(async () => {
    const token = route.query.token;
    email.value = route.query.email;

    if (!token || !email.value) {
        loading.value = false;
        errorMessage.value = 'Invalid verification link. Please check your email for the correct link.';
        return;
    }

    try {
        await axios.post(`${API_BASE_URL}/api/verify-email`, null, {
            params: { token, email: email.value }
        });
        verified.value = true;
    } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Verification failed. Please try again.';
    } finally {
        loading.value = false;
    }
});

const resendVerification = async () => {
    if (!email.value) return;

    try {
        await axios.post(`${API_BASE_URL}/api/resend-verification`, { email: email.value });
        alert('Verification email has been sent. Please check your inbox.');
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to resend verification email.');
    }
};
</script>

<style scoped>
.verify-container {
    max-width: 600px;
    margin: 60px auto;
    padding: 30px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.verify-message {
    margin: 20px 0;
}

.success h2 {
    color: green;
}

.error h2 {
    color: #e74c3c;
}

.verify-button {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
}

.verify-button:hover {
    background-color: #2980b9;
}
</style>