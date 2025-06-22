<template>
    <Header />
    <q-page class="q-pa-md">
        <div class="content-container q-mx-auto" style="max-width: 800px;">
            <h1 class="text-h4 q-mb-md">Privacy Policy</h1>
            <p class="text-body1 q-mb-md">
                Gable Game does not collect personal information from guest users. Game progress is saved locally in
                your browser using localStorage.
            </p>

            <p class="text-body1 q-mb-md">
                If you create an account, your guesses may be stored securely in our database to allow syncing across
                devices.
            </p>

            <p class="text-body1 q-mb-md">
                We do not use third-party trackers or share your data. This policy will be updated if we add analytics
                or advertising.
            </p>

            <p class="text-caption text-grey-7">Last updated: June 21, 2025</p>
        </div>
    </q-page>
</template>

<script setup>
import Header from '@/components/Header.vue';
</script>

<style src="../css/global-styles.css"></style>
