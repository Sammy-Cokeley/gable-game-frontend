<template>
    <Header />
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="q-pa-md">
                <div class="content-container q-mx-auto" style="max-width: 800px;">
                    <h1 class="text-h4 q-mb-md">About Gable Game</h1>
                    <p class="text-body1 q-mb-md">
                        Gable Game is a daily NCAA wrestling trivia game where you guess one of the 330 NCAA qualifier
                        wrestlers
                        based on clues
                        like weight class, team, and record. You get eight guesses to figure out the correct wrestler
                        each
                        day.
                    </p>

                    <p class="text-body1 q-mb-md">
                        It's inspired by word-based games like Wordle, and made for wrestling fans who want a fun,
                        competitive
                        challenge. The name pays tribute to wrestling legend Dan Gable.
                    </p>

                    <p class="text-body1 q-mb-md">
                        This project is built and maintained by a former wrestler and now fan of the sport. For
                        questions or
                        feedback, feel free to reach
                        out.
                    </p>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import Header from '@/components/Header.vue';
</script>

<style src="../css/global-styles.css"></style>