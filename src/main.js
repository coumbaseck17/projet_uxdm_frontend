import { createApp } from 'vue'
import App from './App.vue'



createApp(App).mount('#app')

for (const node of document.querySelectorAll("[barchartv1]")) {
    createApp(App).mount(node)
}
