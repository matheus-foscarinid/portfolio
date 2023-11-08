<template>
  <section id="home">
    <div class="container">
      <MyPhoto />
      
      <div class="presentation-container">
        <span class="presentation">{{  $t('HOME.PRESENTATION_1') }}</span>
        <h2>Matheus Foscarini Dias</h2>
        <TypedPresentation />
    
        <p class="summary">{{  $t('HOME.SUMMARY') }}</p>

        <button 
          class="cv-button"
          @click="viewCV"
        >
          {{  $t('HOME.VIEW_CV') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap';

import i18n from '../../i18n';
import MyPhoto from '../home/MyPhoto.vue';
import TypedPresentation from '../home/TypedPresentation.vue';

import { onMounted } from 'vue';

const addObserverOnScroll = () => {
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateElement();
        self.unobserve(entry.target);
      }
    });
  });

  const target = document.querySelector('#home');
  observer.observe(target)

  function animateElement() {
    const photo = document.querySelector('.my-photo');
    const texts = document.querySelectorAll('.presentation-container > *');
    const tl = gsap.timeline();

    tl.fromTo(
      texts, 
      { opacity: 0, y: 50, filter: 'blur(2px)', scale: .9 }, 
      { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', stagger: .1, scale: 1 }
    );

    gsap.fromTo(
      photo, 
      { opacity: 0, x: -90, filter: 'blur(2px)', scale: .9 }, 
      { opacity: 1, x: 0, duration: 1.5, delay: .5, filter: 'blur(0px)', ease: 'expo.out', scale: 1 }
    );
  }
};

onMounted(addObserverOnScroll);

const viewCV = () => {
  const PT_CV_PATH = '/dias-matheus-cv.pdf';
  const EN_CV_PATH = '/dias-matheus-cv-en.pdf';

  const cvPath = i18n.global.locale == 'pt' ? PT_CV_PATH : EN_CV_PATH ;
  window.open(cvPath, '_blank');
};
</script>

<style lang="scss" scoped>
  #home {
    min-height: 100vh;
    margin-top: -5rem;
    display: flex;

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5rem;

      .presentation-container {
        flex: 3;
  
        .presentation {
          color: var(--secondary-text);
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
    
        h2 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
        }
    
        .summary {
          max-width: 700px;
          text-align: justify;
          margin-top: 1rem;
        }

        .cv-button {
          margin-top: 2rem;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          background-color: var(--details-background);
          color: var(--secondary-text);
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          // button shake 2s every 10s and keep repeating
          animation: shake 18s infinite ease-in-out;
          

          &:hover {
            box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
  }

  // shake animation with just rotation
  @keyframes shake {
    0% { transform: rotate(0deg); }
    95% { transform: rotate(0deg); }
    96% { transform: rotate(6deg); }
    97% { transform: rotate(-6deg); }
    98% { transform: rotate(6deg); }
    99% { transform: rotate(-6deg); }
    100% { transform: rotate(0deg); }
  }
  
</style>