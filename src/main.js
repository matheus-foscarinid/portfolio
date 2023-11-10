import { createApp } from 'vue'

import App from './App.vue'
import i18n from './i18n'

import gsap from 'gsap'

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
  faClose,
  faSun,
  faMoon,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faGithub, 
  faLinkedin, 
  faArrowUpRightFromSquare, 
  faCaretDown,
  faFolder, 
  faEnvelope, 
  faLocationPin,
  faBars,
  faClose,
  faSun,
  faMoon
);

const startApp = () => {
  createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(i18n)
    .mount('#app');
};

startApp();
