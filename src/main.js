import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import { createPinia } from 'pinia'
import '@/axios.js'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const pinia = createPinia()
const app = createApp(App)

app.component('VueDatePicker', VueDatePicker);

app.
    use(pinia).
    use(router).
    mount('#app')
