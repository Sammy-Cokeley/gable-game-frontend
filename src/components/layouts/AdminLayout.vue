<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense icon="arrow_back" label="Back" @click="goHome" />
                <q-toolbar-title>Admin</q-toolbar-title>
                <q-space />
                <q-btn flat dense icon="home" label="Site" @click="goHome" />
            </q-toolbar>
        </q-header>

        <q-drawer show-if-above bordered>
            <q-list padding>
                <q-item clickable v-ripple :active="isActive('/admin/rankings')" to="/admin/rankings">
                    <q-item-section avatar><q-icon name="leaderboard" /></q-item-section>
                    <q-item-section>Rankings</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function goHome() {
    router.push('/')
}

function isActive(path) {
    return route.path === path
}
</script>
