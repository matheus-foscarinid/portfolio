import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import pt from './i18n/pt.json'
import en from './i18n/en.json'

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
  faClose,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faGithub, 
  faLinkedin, 
  faArrowUpRightFromSquare, 
  faFolder, 
  faEnvelope, 
  faLocationPin,
  faBars,
  faClose,
  faSun,
  faMoon
);


const addObserverOnScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
        setTimeout(() => {
          entry.target.classList.remove('appear-on-scroll');
        }, 1500);

        observer.unobserve(entry.target);
      }
    });
  });

  const targets = document.querySelectorAll('.appear-on-scroll');
  targets.forEach((target) => observer.observe(target));
};

const startApp = () => {
  const locale = window.navigator.language.substring(0, 2);
  const i18n = createI18n({
    locale,
    fallbackLocale: 'en',
    messages: { pt, en }
  });

  createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(i18n)
    .mount('#app');

  window.addEventListener('load', addObserverOnScroll);
};

startApp();
