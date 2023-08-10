<template>
  <section id="projects">
    <div class="container appear-on-scroll">
      <h2>Projects</h2>

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
  import FeaturedProjectCard from '@/components/cards/FeaturedProjectCard.vue';
  import ProjectCard from '@/components/cards/ProjectCard.vue';

  /**
   * {
   *   link: 'test.co',
   *   name: '...',
   *   description: '...',
   *   stack: ['React', 'Next', 'SCSS']
   * }
   */
  const projects = [];
  const featuredProjects = [];
</script>

<style lang="scss" scoped>
  #projects {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: var(--details-background);

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