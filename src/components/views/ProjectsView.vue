<template>
  <section id="projects">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('PROJECTS.TITLE') }}</h2>
        <p class="subtitle">{{ $t('PROJECTS.SUBTITLE') }}</p>
      </header>

      <div class="project-stream">
        <template
          v-for="(block, index) in stream"
          :key="index"
        >
          <FeaturedProjectCard
            v-if="block.featured"
            :project="block.featured"
            :reverse="index % 4 === 0"
          />

          <div
            v-else
            class="project-row"
          >
            <ProjectCard
              v-for="project in block.row"
              :key="project.name"
              :project="project"
            />
          </div>
        </template>
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

  // one stream, alternating a wide card with a row of three. professional and
  // personal work sit side by side, and the tag says which is which
  const stream = computed(() => [
    {
      featured: {
        link: 'https://matheusdias.dev',
        repository: 'https://github.com/matheus-foscarinid/portfolio',
        name: 'This Portfolio',
        years: '2026',
        tag: $t('PROJECTS.TAG_PERSONAL'),
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
    },
    {
      row: [
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
      ],
    },
    {
      featured: {
        repository: 'https://github.com/matheus-foscarinid/gb-emu-go',
        name: 'GB Emulator',
        years: '2026',
        tag: $t('PROJECTS.TAG_PERSONAL'),
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
    },
    {
      row: [
        {
          link: 'https://marketplace.visualstudio.com/items?itemName=matheus-foscarinid.json-searcher',
          repository: 'https://github.com/matheus-foscarinid/json-searcher-vscode',
          name: 'JSON Searcher',
          years: '2023',
          tag: $t('PROJECTS.TAG_PERSONAL'),
          description: $t('PROJECTS.JSON_SEARCHER'),
          stack: ['Typescript', 'VSCode API'],
          video: '/images/json_searcher.mp4',
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
      ],
    },
  ]);

  const animateElement = () => {
    const heading = document.querySelectorAll('#projects .section-heading > *');
    const blocks = document.querySelectorAll('.project-stream > *');
    const message = document.querySelector('.coming-soon-message');

    reveal(
      heading,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0 },
      { duration: 500, stagger: 80, delay: 350, easing: EASE.outBack }
    );

    reveal(
      blocks,
      { opacity: 0, y: 75 },
      { opacity: 1, y: 0 },
      { duration: 500, stagger: 200, delay: 500 }
    );

    reveal(
      message,
      { opacity: 0, y: 75 },
      { opacity: 1, y: 0 },
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
        font-weight: 600;
        letter-spacing: -0.03em;
        margin: 0;
      }

      .subtitle {
        max-width: 56ch;
        margin: 0.9rem 0 0;
        color: var(--secondary-text);
        line-height: 1.6;
      }
    }

    .project-stream {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .project-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    #lighthouse { margin-top: 3rem; }

    .coming-soon-message {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid color-mix(in srgb, var(--default-border) 60%, transparent);
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;

      .prompt { color: var(--accent); }
      .text { color: var(--disabled-text); }
    }
  }

  @media (max-width: 1024px) {
    #projects .project-row {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  // on a phone each row of three becomes a swipeable rail that bleeds to both
  // screen edges, so it stays one row instead of three screens of scrolling
  @media (max-width: 768px) {
    #projects {
      .container { min-width: 0; }

      .project-stream { gap: 1.5rem; }

      .project-row {
        display: flex;
        grid-template-columns: none;
        min-width: 0;
        gap: 1.25rem;
        margin-left: calc(-1 * max(1.2rem, env(safe-area-inset-left)));
        margin-right: calc(-1 * max(1.2rem, env(safe-area-inset-right)));
        padding: 0.25rem max(1.2rem, env(safe-area-inset-right)) 0.75rem max(1.2rem, env(safe-area-inset-left));
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar { display: none; }

        > * {
          flex: 0 0 82vw;
          scroll-snap-align: center;
        }
      }
    }
  }
</style>
