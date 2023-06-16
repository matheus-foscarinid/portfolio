<template>
  <section id="home">
    <div class="container appear-on-scroll">
      <div class="myself-container">
        <img
          ref="target"
          src="@/assets/images/me.jpg" 
          alt="Matheus Foscarini Dias" 
          :style="{ transform: cardTransform, boxShadow: cardBoxShadow }"
        />
      </div>
      
      <div class="presentation-container">
        <span class="presentation">{{  $t('HOME.PRESENTATION_1') }}</span>
        <h2>Matheus Foscarini Dias</h2>
        <h3>{{  $t('HOME.PRESENTATION_2') }}</h3>
    
        <p class="summary">{{  $t('HOME.SUMMARY') }}</p>

        <button 
          class="cv-button"
          @click="downloadCV"
        >
          {{  $t('HOME.DOWNLOAD_CV') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import i18n from '../../i18n';
import { useMouseInElement } from '@vueuse/core';
const target = ref(null);

const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(target);	

const cardTransform = computed(() => {
  if (isOutside.value) return '';

  const MAX_ROTATION = 6;

  const xRotation = MAX_ROTATION / 2 - (elementY.value / elementHeight.value) * MAX_ROTATION;
  const fixedXRotation = xRotation.toFixed(2);

  const yRotation = (elementX.value / elementWidth.value) * MAX_ROTATION - MAX_ROTATION / 2;
  const fixedYRotation = yRotation.toFixed(2);

  const rotation = `rotateX(${fixedXRotation}deg) rotateY(${fixedYRotation}deg)`;
  const perspective = `perspective(${elementWidth.value}px)`;
  return `${perspective} ${rotation}`;
});

const cardBoxShadow = computed(() => {
  if (isOutside.value) return '';

  const MAX_SHADOW = 20;

  const xShadow = MAX_SHADOW / 2 - (elementY.value / elementHeight.value) * MAX_SHADOW;
  const fixedXShadow = xShadow.toFixed(2);

  const yShadow = (elementX.value / elementWidth.value) * MAX_SHADOW - MAX_SHADOW / 2;
  const fixedYShadow = -yShadow.toFixed(2);

  const shadow = `${fixedYShadow}px ${fixedXShadow}px 20px rgba(0, 0, 0, 0.25)`;
  return shadow;
});

const downloadCV = () => {
  const link = document.createElement('a');

  const PT_CV_PATH = '/dias-matheus-cv.pdf';
  const EN_CV_PATH = '/dias-matheus-cv-en.pdf';

  link.href = i18n.global.locale == 'pt' ? PT_CV_PATH : EN_CV_PATH ;
  link.download = 'dias-matheus-cv.pdf';
  link.click();
};
</script>

<style lang="scss" scoped>
  #home {
    min-height: calc(100vh - 5rem);
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
    
        h3 {
          color: var(--secondary-text);
          font-size: 2.5rem;
          font-weight: 700;
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
          color: var(--default-text);
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid var(--default-border);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          

          &:hover {
            transform: scale(1.05);
            background-color: var(--secondary-background);
            box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
          }
        }
      }
  
      .myself-container {
        flex: 2;
  
        img {
          width: 100%;
          border-radius: 50%;
          aspect-ratio: 1/1;
          border: 2px solid var(--default-border);
          transition: all 0.25s ease-out;
        }
      }
    }

  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
  }
</style>