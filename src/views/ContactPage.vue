<template>
    <Header />
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="q-pa-md">
                <div class="content-container">
                    <h1 class="text-h4 q-mb-md">Contact Us</h1>
                    <q-banner v-if="!authStore.isAuthenticated" class="bg-grey-2 text-black q-mt-md">
                        You must be logged in to use the contact form.
                    </q-banner>
                    <q-form v-else @submit.prevent="submitForm" class="q-gutter-md">
                        <q-input filled v-model="name" label="Your Name (optional)" />
                        <q-input filled v-model="message" label="Message" type="textarea" required />
                        <q-btn type="submit" label="Send Message" color="primary" :loading="loading" />
                    </q-form>

                    <q-banner v-if="successMessage" class="bg-green-2 text-black q-mt-md">
                        {{ successMessage }}
                    </q-banner>

                    <q-banner v-if="errorMessage" class="bg-red-2 text-black q-mt-md">
                        {{ errorMessage }}
                    </q-banner>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : 'https://gable-game-backend.onrender.com'

const name = ref('');
const message = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();

onMounted(async () => {
    try {
        const res = await axios.get('/api/me');
        name.value = res.data.name || '';
    } catch (err) {
        errorMessage.value = 'You must be logged in to send a message.';
    }
});


const submitForm = async () => {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    try {
        await axios.post(`${API_BASE_URL}/api/contact`, {
            name: name.value,
            message: message.value
        });
        successMessage.value = 'Message sent successfully!';
        name.value = '';
        message.value = '';
    } catch (err) {
        errorMessage.value = 'Something went wrong. Please try again later.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.content-container {
    max-width: 800px;
    margin: 0 auto;
}
</style>
