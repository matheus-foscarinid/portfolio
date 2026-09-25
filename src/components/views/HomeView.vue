<template>
  <section id="home">
    <div class="container">
      <MyAvatar />

      <div class="presentation-container">
        <span class="eyebrow">{{ $t('HOME.PRESENTATION_1') }}</span>
        <h1 class="name">
          <span class="line">Matheus</span>
          <span class="line">Foscarini Dias</span>
        </h1>
        <TypedPresentation />

        <p class="summary">{{ $t('HOME.SUMMARY') }}</p>

        <button
          class="cv-button"
          @click="viewCV"
        >
          <span>{{ $t('HOME.VIEW_CV') }}</span>
          <font-awesome-icon icon="fas fa-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import i18n from '../../i18n';
import MyAvatar from '../home/MyAvatar.vue';
import TypedPresentation from '../home/TypedPresentation.vue';

import { onMounted } from 'vue';
import { reveal, onReveal, EASE } from '@/composables/useReveal';
import { trackEvent } from '@/composables/useAnalytics';

const animateElement = () => {
  const avatar = document.querySelector('.my-avatar');
  const texts = document.querySelectorAll('.presentation-container > *');

  reveal(
    texts,
    { opacity: 0, y: 50, blur: 2, scale: .9 },
    { opacity: 1, y: 0, blur: 0, scale: 1 },
    { duration: 500, stagger: 100 }
  );

  reveal(
    avatar,
    { opacity: 0, x: -90, blur: 2, scale: .9 },
    { opacity: 1, x: 0, blur: 0, scale: 1 },
    { duration: 1500, delay: 500, easing: EASE.outExpo }
  );
};

onMounted(() => onReveal('#home', animateElement));

const viewCV = () => {
  const PT_CV_PATH = '/dias-matheus-cv.pdf';
  const EN_CV_PATH = '/dias-matheus-cv-en.pdf';

  const cvPath = i18n.global.locale.value === 'pt' ? PT_CV_PATH : EN_CV_PATH ;
  trackEvent('cv_click', { lang: i18n.global.locale.value });
  window.open(cvPath, '_blank');
};
</script>

<style lang="scss" scoped>
  #home {
    min-height: 100vh;
    margin-top: -5rem;
    display: flex;
    align-items: center;

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6rem;
      margin: 0 auto;
    }

    .presentation-container {
      flex: 1.4;
      min-width: 0;

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        letter-spacing: 0.02em;
        color: var(--secondary-text);

        &::before {
          content: '';
          width: 2rem;
          height: 2px;
          background-color: var(--accent);
        }
      }

      .name {
        font-size: clamp(2.75rem, 6vw, 4.75rem);
        font-weight: 800;
        line-height: 1.02;
        letter-spacing: -0.02em;
        margin: 1rem 0 1.25rem;

        .line { display: block; }
      }

      .summary {
        max-width: 56ch;
        color: var(--secondary-text);
        line-height: 1.7;
        margin-top: 1.5rem;
      }

      .cv-button {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        margin-top: 2.25rem;
        padding: 0.9rem 1.75rem;
        border-radius: 0.5rem;
        background-color: var(--accent);
        color: var(--accent-contrast);
        font-size: 1.05rem;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: transform 0.25s ease, box-shadow 0.25s ease;

        svg { transition: transform 0.25s ease; }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.75rem 1.25rem color-mix(in srgb, var(--accent) 30%, transparent);

          svg { transform: translateX(4px); }
        }
      }
    }
  }

  @media (max-width: 768px) {
    #home {
      min-height: 100svh;
      position: relative;

      // soft accent halo behind the avatar, echoing the ambient glow of the ref
      &::before {
        content: '';
        position: absolute;
        top: 4.5rem;
        left: 50%;
        width: min(85vw, 22rem);
        aspect-ratio: 1;
        transform: translateX(-50%);
        background: radial-gradient(
          circle,
          color-mix(in srgb, var(--accent) 20%, transparent),
          transparent 68%
        );
        pointer-events: none;
        z-index: 0;
      }

      .container {
        position: relative;
        z-index: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        padding-top: 6.5rem;
        padding-bottom: 3rem;
        gap: 1rem;
      }

      .my-avatar {
        order: -1;
        align-self: center;
        flex: none;
        width: min(82vw, 22rem);
        height: auto;
      }

      .presentation-container {
        width: 100%;
        max-width: 100%;
        text-align: center;

        .eyebrow {
          justify-content: center;

          &::after {
            content: '';
            width: 2rem;
            height: 2px;
            background-color: var(--accent);
          }
        }

        .name {
          font-size: clamp(2.5rem, 13vw, 3.4rem);
          margin: 0.85rem 0 0.9rem;
        }

        .roles { justify-content: center; }

        .summary {
          max-width: none;
          margin: 1.25rem 0 0;
        }

        .cv-button {
          width: 100%;
          justify-content: center;
          margin-top: 2.25rem;
          padding: 1.1rem 1.75rem;
          border-radius: 999px;
        }
      }
    }
  }
</style>
