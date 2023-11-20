import { createApp } from 'vue';
import App from './App.vue'; // Update with the correct path to your main app component
import router from './router'; // Import your router instance

const app = createApp(App);
app.use(router); // Use the router plugin
app.mount('#app');