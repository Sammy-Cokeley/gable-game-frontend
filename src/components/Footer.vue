<template>
    <footer class="footer-links q-mt-xl q-pa-md text-caption text-center">
        <q-separator spaced />
        <div>
            <router-link to="/about" class="footer-link q-mx-sm">About</router-link>
            <router-link to="/privacy-policy" class="footer-link q-mx-sm">Privacy Policy</router-link>
            <router-link to="/contact" class="footer-link q-mx-sm">Contact</router-link>
        </div>
        <p class="copyright">© {{ new Date().getFullYear() }} Gable Game</p>
    </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-links {
    padding-top: .5rem;
    padding-bottom: .5rem;
    color: #888;
    font-size: 0.9rem;
    background-color: #f4f4f4;
    /* Light background if needed */
}

.footer-link {
    margin: .5rem;
    color: var(--q-primary);
    text-decoration: none;
}

.footer-link:hover {
    text-decoration: underline;
}

.copyright {
    padding-left: 1rem;
}
</style>
