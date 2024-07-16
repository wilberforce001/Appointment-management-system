import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import tailwind.css
import './assets/tailwind.css'

const app = createApp(App);
app.use(router);
app.mount('#app');
