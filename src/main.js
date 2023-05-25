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
)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

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

window.addEventListener('load', addObserverOnScroll);