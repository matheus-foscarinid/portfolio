import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare, faFolder } from '@fortawesome/free-solid-svg-icons'

library.add(faGithub, faArrowUpRightFromSquare, faFolder)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');