<template>
  <section id="projects">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('PROJECTS.TITLE') }}</h2>
      </header>

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
        <span class="prompt">~/projects $</span>
        <span class="text">{{ $t('PROJECTS.COMING_SOON') }}</span>
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
      link: 'https://matheusdias.dev',
      repository: 'https://github.com/matheus-foscarinid/portfolio',
      name: 'This Portfolio',
      description: $t('PROJECTS.THIS_SITE'),
      stack: ['Vue 3', 'Vite + Rolldown', 'Web Animations API'],
      metricsTitle: 'matheusdias.dev',
      metrics: [
        { label: 'JS shipped', value: '~78 KB gzip' },
        { label: 'Bundler', value: 'Vite 8 + Rolldown' },
        { label: 'Animations', value: 'Native, 0 libs' },
        { label: 'Media', value: 'Modern WebP + video' },
        { label: 'Sections', value: 'Lazy-loaded' },
      ],
    },
    {
      repository: 'https://github.com/matheus-foscarinid/gb-emu-go',
      name: 'GB Emulator',
      description: $t('PROJECTS.GB_EMU'),
      stack: ['Go', 'Emulation'],
      consoleTitle: '~/gb-emu-go',
      console: [
        { prompt: '$', text: 'go run . tetris.gb' },
        { text: 'header  parsed OK' },
        { text: 'cpu     decoding ops' },
        { text: 'mem     ROM mapped' },
        { text: 'status: work in progress', accent: true },
      ],
    },
    {
      link: 'https://marketplace.visualstudio.com/items?itemName=matheus-foscarinid.json-searcher',
      repository: 'https://github.com/matheus-foscarinid/json-searcher-vscode',
      name: 'JSON Searcher',
      description: $t('PROJECTS.JSON_SEARCHER'),
      stack: ['Typescript', 'VSCode API'],
      video: '/images/json_searcher.mp4'
    },
  ]);

  const projects = computed(() => [
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

  const animateElement = () => {
    const heading = document.querySelectorAll('#projects .section-heading > *');
    const featuredCards = document.querySelectorAll('.featured-project-cards > *');
    const message = document.querySelector('.coming-soon-message');

    reveal(
      heading,
      { opacity: 0, y: 50, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, stagger: 80, delay: 350, easing: EASE.outBack }
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

    .section-heading {
      margin-bottom: 3rem;

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

    .featured-project-cards {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 1.5rem;
    }

    .project-cards {
      margin-top: 3rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .coming-soon-message {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 2.5rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      background: var(--dark-background);
      font-family: 'Fira Code', monospace;

      .prompt { color: var(--accent-on-dark); }
      .text { color: rgba(255, 255, 255, 0.82); }
    }
  }

  @media (max-width: 768px) {
    #projects .project-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
