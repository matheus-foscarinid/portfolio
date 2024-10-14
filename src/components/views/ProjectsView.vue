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
  import { gsap } from 'gsap';

  import { computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  import FeaturedProjectCard from '@/components/cards/FeaturedProjectCard.vue';
  import ProjectCard from '@/components/cards/ProjectCard.vue';
  
  const { t: $t } = useI18n();
  const featuredProjects = computed(() => [
    {
      link: 'https://marketplace.visualstudio.com/items?itemName=matheus-foscarinid.json-searcher',
      repository: 'https://github.com/matheus-foscarinid/json-searcher-vscode',
      name: 'JSON Searcher',
      description: $t('PROJECTS.JSON_SEARCHER'),
      stack: ['Typescript', 'VSCode API'],
      image: 'https://github-production-user-asset-6210df.s3.amazonaws.com/57161520/254410881-7a6b8067-167d-4b9c-b324-5eef96fd35db.gif'
    },
    {
      name: 'Site Construsausen',
      description: $t('PROJECTS.CONSTRUSAUSEN'),
      stack: ['Vue', 'Typescript', 'SCSS'],
      srcset: '/images/construsausen_w_200.webp 200w, /images/construsausen_w_667.webp 667w, /images/construsausen_w_954.webp 954w, /images/construsausen_w_1293.webp 1293w, /images/construsausen_w_1400.webp 1400w',
      image: '/images/construsausen_w_1400.webp',
      scroll: true,
    },
    {
      repository: 'https://github.com/matheus-foscarinid/whatsapp-web-hide-chats-tools',
      name: 'Wpp Web Hide Chats Tools',
      description: $t('PROJECTS.WW_HIDE_CHATS_TOOLS'),
      stack: ['Javascript', 'Google Chrome API'],
      image: '/images/ww_hide_chats_tools.gif',
    },
  ]);

  const projects = [];

  const addObserverOnScroll = () => {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateElement();
          self.unobserve(entry.target);
        }
      });
    });

    const target = document.querySelector('#projects .container');
    observer.observe(target)

    function animateElement() {
      const tl = gsap.timeline();

      const title = document.querySelector('#projects h2');
      const featuredCards = document.querySelectorAll('.featured-project-cards > *');
      const message = document.querySelector('.coming-soon-message');

      gsap.fromTo(
        title, 
        { opacity: 0, y: 50, filter: 'blur(2px)' }, 
        { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', ease: 'back.out(1.4)', delay: .35 }
      );

      tl.fromTo(
        featuredCards, 
        { opacity: 0, y: 75, filter: 'blur(2px)' }, 
        { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', stagger: .25, delay: .5 }
      );

      gsap.fromTo(
        message, 
        { opacity: 0, y: 75, filter: 'blur(2px)' }, 
        { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', delay: .5 }
      );
    }
  };

  onMounted(addObserverOnScroll);
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