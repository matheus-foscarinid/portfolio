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

      <div class="tier">
        <div class="tier-heading">
          <h3>{{ $t('PROJECTS.WORK_TITLE') }}</h3>
          <p>{{ $t('PROJECTS.WORK_SUBTITLE') }}</p>
        </div>

        <div class="project-cards work">
          <ProjectCard
            v-for="(project, index) in workProjects"
            :key="index"
            :project="project"
          />
        </div>
      </div>

      <div class="tier">
        <div class="tier-heading">
          <h3>{{ $t('PROJECTS.SIDE_TITLE') }}</h3>
        </div>

        <div class="project-cards">
          <ProjectCard
            v-for="(project, index) in projects"
            :key="index"
            :project="project"
          />
        </div>
      </div>

      <div class="coming-soon-message">
        <span class="prompt">~/projects $</span>
        <span class="text">{{ $t('PROJECTS.COMING_SOON') }}</span>
      </div>

      <LighthouseScores />
    </div>
  </section>
</template>

<script setup>
  import { computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  import FeaturedProjectCard from '@/components/cards/FeaturedProjectCard.vue';
  import ProjectCard from '@/components/cards/ProjectCard.vue';
  import LighthouseScores from '@/components/LighthouseScores.vue';
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

  const workProjects = computed(() => [
    {
      link: 'https://www.hipeople.io/',
      name: 'HiPeople',
      years: '2025 - now',
      tag: $t('PROJECTS.TAG_PROFESSIONAL'),
      description: $t('PROJECTS.HIPEOPLE'),
      stack: ['Go', 'React', 'Next.js', 'OpenAI'],
      srcset: '/images/projects/hipeople_w_600.webp 600w, /images/projects/hipeople.webp 1200w',
      image: '/images/projects/hipeople.webp',
    },
    {
      link: 'https://www.benchprep.com/',
      name: 'BenchPrep',
      years: '2024 - 2025',
      tag: $t('PROJECTS.TAG_PROFESSIONAL'),
      description: $t('PROJECTS.BENCHPREP'),
      stack: ['Vue', 'Nuxt', 'Ruby on Rails', 'Docker'],
      srcset: '/images/projects/benchprep_w_600.webp 600w, /images/projects/benchprep.webp 1200w',
      image: '/images/projects/benchprep.webp',
    },
    {
      link: 'https://www.minhavisita.app/',
      name: 'Minha Visita',
      years: '2021 - 2024',
      tag: $t('PROJECTS.TAG_PROFESSIONAL'),
      description: $t('PROJECTS.MINHA_VISITA'),
      stack: ['Vue', 'NestJS', 'PostgreSQL'],
      srcset: '/images/projects/minhavisita_w_600.webp 600w, /images/projects/minhavisita.webp 1200w',
      image: '/images/projects/minhavisita.webp',
    },
  ]);

  const projects = computed(() => [
    {
      name: 'Site Construsausen',
      years: '2021',
      tag: $t('PROJECTS.TAG_PERSONAL'),
      description: $t('PROJECTS.CONSTRUSAUSEN'),
      stack: ['Vue', 'Typescript', 'SCSS'],
      srcset: '/images/construsausen_w_200.webp 200w, /images/construsausen_w_667.webp 667w, /images/construsausen_w_954.webp 954w',
      image: '/images/construsausen_w_954.webp',
      scroll: true,
    },
    {
      repository: 'https://github.com/matheus-foscarinid/whatsapp-web-hide-chats-tools',
      name: 'Wpp Web Hide Chats Tools',
      years: '2024',
      tag: $t('PROJECTS.TAG_PERSONAL'),
      description: $t('PROJECTS.WW_HIDE_CHATS_TOOLS'),
      stack: ['Javascript', 'Google Chrome API'],
      video: '/images/ww_hide_chats_tools.mp4',
    },
  ]);

  const animateElement = () => {
    const heading = document.querySelectorAll('#projects .section-heading > *');
    const featuredCards = document.querySelectorAll('.featured-project-cards > *');
    const tiers = document.querySelectorAll('#projects .tier');
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
      tiers,
      { opacity: 0, y: 60, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, stagger: 150, delay: 500 }
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

    .featured-project-cards {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 1.5rem;
    }

    .tier {
      margin-top: 4rem;

      .tier-heading {
        margin-bottom: 1.5rem;

        h3 {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0;
        }

        p {
          margin: 0.4rem 0 0;
          max-width: 52ch;
          color: var(--secondary-text);
          font-size: 0.95rem;
        }
      }
    }

    .project-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;

      &.work { grid-template-columns: repeat(3, 1fr); }
    }

    #lighthouse { margin-top: 2.5rem; }

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

  @media (max-width: 1024px) {
    #projects .project-cards.work { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    #projects {
      .tier { margin-top: 3rem; }

      .project-cards,
      .project-cards.work { grid-template-columns: 1fr; }
    }
  }
</style>
