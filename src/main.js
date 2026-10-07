import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router.js'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    },
    ripple : true,
    license : 'community'
})

app.component('pv-button', Button)
app.component('pv-data-table', DataTable)
app.component('pv-column', Column)
app.component('pv-input-text', InputText)
app.component('pv-dropdown', Select)
app.component('pv-progress-bar', ProgressBar)
app.component('pv-tag', Tag)

app.mount('#app')