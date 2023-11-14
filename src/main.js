

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')

for (const node of document.querySelectorAll("[barchartv1]")) {
    createApp(App).use(router).mount(node)
}
