<template>
  <section id="about">
    <div class="container">
      <div class="columns">
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
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

import { reveal, onReveal, EASE } from '@/composables/useReveal';

const animateElement = () => {
  const texts = document.querySelectorAll('#about .summary > *');
  const heading = document.querySelectorAll('#about .section-heading > *');

  reveal(
    heading,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0 },
    { duration: 420, stagger: 50, easing: EASE.outExpo }
  );

  reveal(
    texts,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0 },
    { duration: 420, stagger: 55, delay: 120, easing: EASE.outExpo }
  );
};

onMounted(() => onReveal('#about', animateElement));

</script>

<style lang="scss" scoped>
#about {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: var(--default-background);

  // the auto side margins on .container cancel the flex stretch, so without this
  // the container shrinks to the text width instead of filling the section
  .container { width: 100%; }

  // the heading holds a left rail, the reading sits in its own measure beside it
  .columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    align-items: start;
    gap: 4rem;
  }

  .section-heading {
    position: sticky;
    top: 7rem;

    .marker {
      display: block;
      width: 2.5rem;
      height: 3px;
      background-color: var(--accent);
      margin-bottom: 1rem;
    }

    h2 {
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      margin: 0;
    }
  }

  .summary {
    max-width: 62ch;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: var(--secondary-text);
    line-height: 1.75;
  }
}

@media (max-width: 900px) {
  #about {
    .columns {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .section-heading { position: static; }

    .summary {
      max-width: 100%;
      font-size: 0.95rem;
      line-height: 1.7;
    }
  }
}
</style>
