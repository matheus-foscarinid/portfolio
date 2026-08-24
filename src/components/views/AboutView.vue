<template>
  <section id="about">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('ABOUT.TITLE') }}</h2>
      </header>

      <div class="content-containers">
        <div class="summary">
          <p v-html="$t('ABOUT.SUMMARY_1')" />
          <p v-html="$t('ABOUT.SUMMARY_2')" />
          <p v-html="$t('ABOUT.SUMMARY_3')" />
          <p v-html="$t('ABOUT.SUMMARY_4')" />
        </div>

        <div class="tech-stack">
          <span class="stack-label">{{ $t('ABOUT.STACK_TITLE') }}</span>
          <div class="stacks-container">
            <StackCard
              v-for="stack in stacks"
              :key="stack.name"
              :name="stack.name"
              :type="stack.type"
              :label="stack.label"
              :src="stack.src"
              :highlight="stack.highlight"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

import StackCard from '@/components/cards/StackCard.vue';
import { reveal, onReveal, EASE } from '@/composables/useReveal';

const stacks = [
  { name: 'vuejs', type: 'original', label: 'Vue.js', highlight: true },
  { name: 'react', type: 'original', label: 'React', highlight: true },
  { name: 'typescript', type: 'original', label: 'TypeScript', highlight: true },
  { name: 'go', type: 'original', label: 'Go', highlight: true },
  { name: 'ruby', type: 'original', label: 'Ruby', highlight: true },
  { name: 'nextjs', type: 'original', label: 'Next.js' },
  { name: 'nodejs', type: 'original', label: 'Node.js' },
  { name: 'nestjs', type: 'original', label: 'NestJS' },
  { name: 'rails', type: 'original-wordmark', label: 'Rails' },
  { name: 'graphql', type: 'plain', label: 'GraphQL' },
  { name: 'python', type: 'original', label: 'Python' },
  { name: 'mysql', type: 'original', label: 'MySQL' },
  { name: 'docker', type: 'original', label: 'Docker' },
  { name: 'claude-code', src: '/icons/claude-code.svg', label: 'Claude Code' },
  { name: 'linear', src: '/icons/linear.svg', label: 'Linear' },
  { name: 'opencode', src: '/icons/opencode.svg', label: 'OpenCode' },
  { name: 'superset', src: '/icons/superset.svg', label: 'Superset' },
  { name: 'javascript', type: 'original', label: 'JavaScript' },
  { name: 'git', type: 'original', label: 'Git' },
  { name: 'html5', type: 'original', label: 'HTML5' },
  { name: 'css3', type: 'original', label: 'CSS3' },
];

const animateElement = () => {
  const texts = document.querySelectorAll('.summary > *');
  const stackCards = document.querySelectorAll('.stacks-container > *');
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

  reveal(
    stackCards,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0 },
    { duration: 500, stagger: 100, delay: 350 }
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
  background: var(--secondary-background);

  .section-heading {
    margin-bottom: 2rem;

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

  .content-containers {
    display: flex;
    gap: 3rem;
    align-items: flex-start;

    .summary {
      flex: 1.4;
      max-width: 62ch;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: var(--secondary-text);
      line-height: 1.75;
    }

    .tech-stack {
      flex: 1;

      .stack-label {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        color: var(--secondary-text);

        &::before {
          content: '';
          width: 1.5rem;
          height: 2px;
          background-color: var(--accent);
        }
      }

      .stacks-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
      }
    }
  }
}

@media (max-width: 768px) {
  #about {
    .section-heading { margin-bottom: 2rem; }

    .content-containers {
      flex-direction: column;
      gap: 2.5rem;
    }

    .summary { max-width: 100%; }

    .tech-stack {
      width: 100%;

      .stack-label { justify-content: center; }
    }

    .stacks-container { justify-content: center; }
  }
}
</style>
