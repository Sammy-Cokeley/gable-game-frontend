<template>
    <Header />
    <q-layout>
        <q-page-container>
            <q-page class="q-pa-md">
                <div class="text-h5 text-center q-mb-md">NCAA Match Game</div>

                <!-- <q-input v-model="gameStore.guess" label="Your Guess" outlined dense
                    @keyup.enter="gameStore.submitGuess" /> -->

                <q-btn label="Guess" color="primary" @click="logMatch" />

                <!-- Hint display -->
                <!-- <div v-if="gameStore.hint.step >= 0">{{ gameStore.hint.result }}</div>
                <div v-if="gameStore.hint.step >= 1">{{ gameStore.hint.round }}</div>
                <div v-if="gameStore.hint.step >= 2">{{ gameStore.hint.weight }}</div> -->
                <!-- etc... -->




                <!-- Result Message -->
                <div v-if="resultMessage" class="q-mt-md text-center">
                    <q-banner :color="correct ? 'positive' : 'warning'" dense>
                        {{ resultMessage }}
                    </q-banner>
                </div>

                <!-- Next Match Button -->
                <div v-if="correct" class="q-mt-md text-center">
                    <q-btn label="Next Match" color="secondary" @click="loadMatch" />
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { useMatchGameStore } from '@/store/matchGame.store';
import { onMounted } from 'vue';
import Header from '@/components/Header.vue';

const gameStore = useMatchGameStore()
onMounted(() => {
    gameStore.getMatch();
    console.log(gameStore.match)
})

function logMatch() {
    console.log(gameStore.match, gameStore.wrestlerA, gameStore.wrestlerB)
}
</script>