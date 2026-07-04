<template>
  <section id="projects">
    <div class="container">
      <h2>{{ $t('PROJECTS.TITLE') }}</h2>

      <div class="featured-project-cards">
        <FeaturedProjectCard
          v-for="(project, index) in featuredProjects"
          :key="index"
          :project="project"
          :reverse="index % 2 === 0"
        />
      </div>

      <div class="project-cards">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="index"
          :project="project"
        />
      </div>

      <div class="coming-soon-message">
        <h1>{{ $t('PROJECTS.COMING_SOON')}}</h1>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  import FeaturedProjectCard from '@/components/cards/FeaturedProjectCard.vue';
  import ProjectCard from '@/components/cards/ProjectCard.vue';
  import { reveal, onReveal, EASE } from '@/composables/useReveal';
  
  const { t: $t } = useI18n();
  const featuredProjects = computed(() => [
    {
      link: 'https://marketplace.visualstudio.com/items?itemName=matheus-foscarinid.json-searcher',
      repository: 'https://github.com/matheus-foscarinid/json-searcher-vscode',
      name: 'JSON Searcher',
      description: $t('PROJECTS.JSON_SEARCHER'),
      stack: ['Typescript', 'VSCode API'],
      video: '/images/json_searcher.mp4'
    },
    {
      name: 'Site Construsausen',
      description: $t('PROJECTS.CONSTRUSAUSEN'),
      stack: ['Vue', 'Typescript', 'SCSS'],
      srcset: '/images/construsausen_w_200.webp 200w, /images/construsausen_w_667.webp 667w, /images/construsausen_w_954.webp 954w',
      image: '/images/construsausen_w_954.webp',
      scroll: true,
    },
    {
      repository: 'https://github.com/matheus-foscarinid/whatsapp-web-hide-chats-tools',
      name: 'Wpp Web Hide Chats Tools',
      description: $t('PROJECTS.WW_HIDE_CHATS_TOOLS'),
      stack: ['Javascript', 'Google Chrome API'],
      video: '/images/ww_hide_chats_tools.mp4',
    },
  ]);

  const projects = [];

  const animateElement = () => {
    const title = document.querySelector('#projects h2');
    const featuredCards = document.querySelectorAll('.featured-project-cards > *');
    const message = document.querySelector('.coming-soon-message');

    reveal(
      title,
      { opacity: 0, y: 50, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, delay: 350, easing: EASE.outBack }
    );

    reveal(
      featuredCards,
      { opacity: 0, y: 75, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, stagger: 250, delay: 500 }
    );

    reveal(
      message,
      { opacity: 0, y: 75, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, delay: 500 }
    );
  };

  onMounted(() => onReveal('#projects .container', animateElement));
</script>

<style lang="scss" scoped>
  #projects {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: var(--secondary-background);

    h2 {
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2.5rem;
      color: var(--secondary-text);
      // Opacity 0 to prevent the animation from running before the element is visible
      opacity: 0;

      &::before {
      content: '';
      display: block;
      position: relative;
      width: 50%;
      height: 1px;
      margin-right: 20px;
      background-color: var(--default-border);
    }

      &::after {
        content: '';
        display: block;
        position: relative;
        width: 50%;
        height: 1px;
        margin-left: 20px;
        background-color: var(--default-border);
      }
    }

    .featured-project-cards {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      flex-wrap: wrap;
      gap: 3rem;
      margin-top: 2rem;
    }

    .project-cards {
      margin-top: 3rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .coming-soon-message {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-weight: 700;
      color: var(--secondary-text);
    }
  }
</style>