import { createApp } from 'vue'
import { inject } from '@vercel/analytics'

import App from './App.vue'
import i18n from './i18n'

import './assets/main.css'
import './assets/reveal.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowUpRightFromSquare,
  faArrowRight,
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
  faArrowRight,
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

  // the vue component export needs vue-router, this app has no routes
  inject(
    { basePath: import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH },
    import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG
  );
};

startApp();
