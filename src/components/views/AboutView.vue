<template>
  <section id="about">
    <div class="container">
      <h2>{{ $t('ABOUT.TITLE') }}</h2>
      <div class="content-containers">
        <div class="summary">
          <p v-html="$t('ABOUT.SUMMARY_1')" />
          <p v-html="$t('ABOUT.SUMMARY_2')" />
          <p v-html="$t('ABOUT.SUMMARY_3')" />
          <p v-html="$t('ABOUT.SUMMARY_4')" />
        </div>

        <div class="tech-stack">
          <div class="stacks-container">
            <StackCard 
              v-for="stack in stacks"
              :key="stack.name"
              :name="stack.name"
              :type="stack.type"
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
  { name: 'html5', type: 'original'},
  { name: 'css3', type: 'original'},
  { name: 'javascript', type: 'original'},
  { name: 'typescript', type: 'original'},
  { name: 'ruby', type: 'original'},
  { name: 'rails', type: 'original-wordmark'},
  { name: 'vuejs', type: 'original'},
  { name: 'nodejs', type: 'original'},
  { name: 'python', type: 'original'},
  { name: 'mysql', type: 'original'},
  { name: 'docker', type: 'original'},
  { name: 'git', type: 'original'},
  { name: 'graphql', type: 'plain'},
];

const animateElement = () => {
  const texts = document.querySelectorAll('.summary > *');
  const stackCards = document.querySelectorAll('.stacks-container > *');
  const title = document.querySelector('#about h2');

  reveal(
    title,
    { opacity: 0, y: 50, blur: 2 },
    { opacity: 1, y: 0, blur: 0 },
    { duration: 500, easing: EASE.outBack }
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

  h2 {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--secondary-text);

    &::before {
      content: '';
      display: block;
      position: relative;
      width: 50px;
      height: 1px;
      margin-right: 20px;
      background-color: var(--default-border);
    }
    &::after {
      content: '';
      display: block;
      position: relative;
      width: 530px;
      height: 1px;
      margin-left: 20px;
      background-color: var(--default-border);
    }
  }

  .content-containers {
    display: flex;
    gap: 3rem;

    .summary {
      max-width: 700px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tech-stack {
      .stacks-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      h3 {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--secondary-text);

        &::before {
          content: '';
          display: block;
          position: relative;
          width: 120px;
          height: 1px;
          margin-right: 20px;
          background-color: var(--default-border);
        }
        &::after {
          content: '';
          display: block;
          position: relative;
          width: 50px;
          height: 1px;
          margin-left: 20px;
          background-color: var(--default-border);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  #about {

    h2 {
      &::before, &::after {
        width: 50%;
      }
    }
    .content-containers {
      display: flex;
      flex-direction: column;
    }

    .summary { text-align: justify; }
    .stacks-container { justify-content: center; }
  }
}
</style>
