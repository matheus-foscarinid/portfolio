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
import { gsap } from 'gsap';
import { onMounted } from 'vue';

import StackCard from '@/components/cards/StackCard.vue';

const stacks = [
  { name: 'html5', type: 'original'},
  { name: 'css3', type: 'original'},
  { name: 'javascript', type: 'original'},
  { name: 'typescript', type: 'original'},
  { name: 'vuejs', type: 'original'},
  { name: 'nodejs', type: 'original'},
  { name: 'nestjs', type: 'plain'},
  { name: 'mysql', type: 'original'},
  { name: 'git', type: 'original'},
  { name: 'rails', type: 'original-wordmark'}
];

const addObserverOnScroll = () => {
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateElement();
        self.unobserve(entry.target);
      }
    });
  });

  const target = document.querySelector('#about');
  observer.observe(target)

  function animateElement() {
    const tl = gsap.timeline();

    const texts = document.querySelectorAll('.summary > *');
    const stackCards = document.querySelectorAll('.stacks-container > *');
    const title = document.querySelector('#about h2');

    gsap.fromTo(
      title, 
      { opacity: 0, y: 50, filter: 'blur(2px)' }, 
      { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', ease: 'back.out(1.4)' }
    );

    tl.fromTo(
      texts, 
      { opacity: 0, y: 50, filter: 'blur(2px)' }, 
      { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', stagger: .1, ease: 'back.out(1.4)', delay: .35 }
    );

    gsap.fromTo(
      stackCards,
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: .5, stagger: .1, delay: .35 }
    );
  }
};

onMounted(addObserverOnScroll);

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
  }
}
</style>
