import './style.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/css/tailwind.css'

import App from './App.vue'
import router from './router'



import feather from "feather-icons";


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

router.afterEach(() => {
  setTimeout(() => {
    feather.replace();
  }, 0);
});
