import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import './assets/main.css';

import { } from './store/main';



const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');