import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import router from './router'
import App from './App.vue'
import setupInterceptors from './services/http.interceptor'

setupInterceptors();

const app = createApp(App)

app.use(Quasar, {
    config: {

    }
});

app.use(createPinia())
app.use(router)
app.mount('#app')
