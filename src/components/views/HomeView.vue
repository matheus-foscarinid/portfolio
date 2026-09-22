<template>
  <section id="home">
    <div class="container">
      <div class="presentation-container">
        <span class="eyebrow">{{ $t('HOME.EYEBROW') }}</span>
        <h1 class="name">
          <span class="line">Matheus</span>
          <span class="line">Foscarini Dias</span>
        </h1>
        <TypedPresentation />

        <p class="summary">{{ $t('HOME.SUMMARY') }}</p>

        <div class="actions">
          <div class="cta-group">
            <ResumeButton location="hero" />

            <a
              class="contact-cta"
              href="#contact"
              @click="trackEvent('contact_cta_click', { location: 'hero' })"
            >{{ $t('HOME.CONTACT_CTA') }}</a>
          </div>

          <div class="profiles">
            <a
              v-for="profile in profiles"
              :key="profile.network"
              class="profile-link"
              :href="profile.link"
              target="_blank"
              rel="noopener"
              @click="trackProfile(profile.network)"
            >{{ profile.label }}</a>
          </div>
        </div>
      </div>

      <MyPhoto />
    </div>
  </section>
</template>

<script setup>
import MyPhoto from '../home/MyPhoto.vue';
import ResumeButton from '../ResumeButton.vue';
import TypedPresentation from '../home/TypedPresentation.vue';

import { onMounted } from 'vue';
import { reveal, onReveal, EASE } from '@/composables/useReveal';
import { trackEvent } from '@/composables/useAnalytics';

const profiles = [
  { network: 'github', label: 'GitHub', link: 'https://github.com/matheus-foscarinid' },
  { network: 'linkedin', label: 'LinkedIn', link: 'https://linkedin.com/in/matheus-foscarinid/' },
];

const animateElement = () => {
  const photo = document.querySelector('.my-photo');
  const texts = document.querySelectorAll('.presentation-container > *');

  reveal(
    texts,
    { opacity: 0, y: 50, scale: .9 },
    { opacity: 1, y: 0, scale: 1 },
    { duration: 450, stagger: 70 }
  );

  reveal(
    photo,
    { opacity: 0, x: 90, scale: .9 },
    { opacity: 1, x: 0, scale: 1 },
    { duration: 700, delay: 150, easing: EASE.outExpo }
  );
};

onMounted(() => onReveal('#home', animateElement));

const trackProfile = (network) => {
  trackEvent('social_click', { network, location: 'hero' });
};
</script>

<style lang="scss" scoped>
  #home {
    min-height: 100vh;
    margin-top: -5rem;
    display: flex;
    align-items: center;
    position: relative;

    .container {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6rem;
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
        font-weight: 600;
        line-height: 1.04;
        letter-spacing: -0.035em;
        margin: 1rem 0 1.25rem;

        .line { display: block; }
      }

      .summary {
        max-width: 52ch;
        color: var(--secondary-text);
        line-height: 1.7;
        margin-top: 1.5rem;
      }

      .actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.25rem 2.5rem;
        margin-top: 2.25rem;
      }

      .cta-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .contact-cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.85rem 1.35rem;
        border: 1px solid color-mix(in srgb, var(--default-border) 70%, transparent);
        border-radius: 999px;
        color: var(--secondary-text);
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: none;
        transition: border-color 0.25s ease, color 0.25s ease;

        &:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
      }

      .profiles {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .profile-link {
        font-family: 'Fira Code', monospace;
        font-size: 0.85rem;
        color: var(--disabled-text);
        text-decoration: none;
        transition: color 0.25s ease;

        &:hover { color: var(--accent); }
      }
    }
  }

  @media (max-width: 768px) {
    #home {
      min-height: 100svh;

      .container {
        position: relative;
        z-index: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 auto;
        padding-top: 5.5rem;
        padding-bottom: 2rem;
        gap: 1rem;
      }

      // sized so the resume button still lands above the fold on a short phone
      .my-photo {
        order: -1;
        align-self: center;
        flex: none;
        width: min(46vw, 11.5rem);
        height: min(46vw, 11.5rem);
        max-width: none;
        margin-bottom: 0.75rem;
        &::before { inset: -0.55rem; }
      }

      .presentation-container {
        width: 100%;
        max-width: 100%;
        text-align: left;

        .eyebrow { justify-content: flex-start; }

        .name {
          font-size: clamp(2.25rem, 11vw, 3rem);
          margin: 0.6rem 0 0.7rem;
        }

        .roles { justify-content: flex-start; }

        .summary {
          max-width: none;
          margin: 1rem 0 0;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .actions {
          width: 100%;
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        .cta-group {
          width: 100%;
          gap: 0.75rem;
        }

        :deep(.resume-button),
        .contact-cta {
          width: 100%;
          min-width: 0;
          justify-content: center;
          padding: 1.1rem 1.75rem;
        }
      }
    }
  }

  // short viewports (small phones, or a phone with the browser bars showing):
  // trim the photo and the roles line so the resume button stays in view
  @media (max-width: 768px) and (max-height: 720px) {
    #home {
      .container { padding-top: 4.5rem; }

      .my-photo {
        width: min(34vw, 8rem);
        height: min(34vw, 8rem);
        margin-bottom: 0.5rem;
      }

      .roles { display: none; }

      .presentation-container {
        .name { font-size: clamp(2rem, 10vw, 2.5rem); }

        .summary { margin-top: 0.85rem; }

        .actions { margin-top: 1.25rem; }
      }
    }
  }
</style>
