<template>
  <section id="about">
    <div class="container">
      <div class="columns">
        <div class="about-column">
          <header class="section-heading">
            <span class="marker" aria-hidden="true"></span>
            <h2>{{ $t('ABOUT.TITLE') }}</h2>
          </header>

          <div class="summary">
            <p v-html="$t('ABOUT.SUMMARY_1')" />
            <p v-html="$t('ABOUT.SUMMARY_2')" />
            <p v-html="$t('ABOUT.SUMMARY_3')" />
            <p v-html="$t('ABOUT.SUMMARY_4')" />
          </div>
        </div>

        <ContactView class="contact-column" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

import ContactView from '@/components/views/ContactView.vue';
import { reveal, onReveal, EASE } from '@/composables/useReveal';

const animateElement = () => {
  const texts = document.querySelectorAll('#about .summary > *');
  const heading = document.querySelectorAll('#about .section-heading > *');

  reveal(
    heading,
    { opacity: 0, y: 50, blur: 2 },
    { opacity: 1, y: 0, blur: 0 },
    { duration: 500, stagger: 80, easing: EASE.outBack }
  );

  reveal(
    texts,
    { opacity: 0, y: 50, blur: 2 },
    { opacity: 1, y: 0, blur: 0 },
    { duration: 500, stagger: 100, delay: 350, easing: EASE.outBack }
  );
};

onMounted(() => onReveal('#about', animateElement));

</script>

<style lang="scss" scoped>
#about {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: var(--default-background);

  // the auto side margins on .container cancel the flex stretch, so without this
  // the container shrinks to the text width instead of filling the section
  .container { width: 100%; }

  .section-heading {
    margin-bottom: 2.5rem;

    .marker {
      display: block;
      width: 2.5rem;
      height: 3px;
      background-color: var(--accent);
      margin-bottom: 1rem;
    }

    h2 {
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
    }
  }

  .columns {
    display: flex;
    align-items: flex-start;
    gap: 4rem;
  }

  .about-column { flex: 1.6; }

  .contact-column {
    flex: 1;
    min-width: 0;
    position: sticky;
    top: 7rem;
  }

  .summary {
    max-width: 62ch;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: var(--secondary-text);
    line-height: 1.75;
  }
}

@media (max-width: 900px) {
  #about {
    .columns {
      flex-direction: column;
      gap: 3rem;
    }

    // contact first on a phone: it is the action, the bio is the reading
    .contact-column {
      order: -1;
      position: static;
      width: 100%;
    }

    .section-heading { margin-bottom: 2rem; }

    .summary {
      max-width: 100%;
      font-size: 0.95rem;
      line-height: 1.7;
    }
  }
}
</style>
