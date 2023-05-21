import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowUpRightFromSquare, 
  faFolder, 
  faEnvelope, 
  faLocationPin, 
  faBars ,
  faClose
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faGithub, 
  faLinkedin, 
  faArrowUpRightFromSquare, 
  faFolder, 
  faEnvelope, 
  faLocationPin,
  faBars,
  faClose
)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');