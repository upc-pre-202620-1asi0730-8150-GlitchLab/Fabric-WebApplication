import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router.js";
import pinia from "./pinia.js";
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
    Button, Card, Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable, Dialog, IconField, InputIcon,
    InputText, Menu, Select,
    SelectButton, Tag, Textarea,
    Toast,
    ToastService
} from "primevue";
import i18n from "./i18n.js";

const primeUiLicenseKey = import.meta.env.VITE_PRIME_UI_LICENSE_KEY;

createApp(App)
    .component('pv-dialog', Dialog)
    .component('pv-menu', Menu)
    .component('pv-textarea', Textarea)
    .component('pv-card', Card)
    .component('pv-column', Column)
    .component('pv-data-table', DataTable)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-button', Button)
    .component('pv-toast', Toast)
    .component('pv-tag', Tag)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .use(ToastService)
    .use(ConfirmationService)
    .use(i18n)
    .use(pinia)
    .use(PrimeVue, {theme: { preset: Material, options: { darkModeSelector: false } }, ripple: true, license: primeUiLicenseKey})    .use(router)
    .mount('#app')
