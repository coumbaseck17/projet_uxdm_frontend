import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//import DatavizExample from './components/DatavizExample.vue'

//createApp(App).mount('#app')

for (const node of document.querySelectorAll("[dataviz-example]")) {
    createApp(App).mount(node)
}