import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err))
  })
}

const app = createApp(App)
app.mount('#app')
