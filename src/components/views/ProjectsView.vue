<template>
  <section id="projects">
    <div class="container">
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
    </div>
  </section>
</template>

<script setup>
  import FeaturedProjectCard from '@/components/cards/FeaturedProjectCard.vue';
  import ProjectCard from '@/components/cards/ProjectCard.vue';


  const featuredProjects = [
    {
      link: 'test.co',
      name: 'Test',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Vue', 'Vite', 'Quasar', 'SCSS' ]
    },
    {
      link: 'test.co',
      name: 'Test',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Vue', 'Vite', 'Quasar', 'SCSS' ]
    },
    {
      link: 'test.co',
      name: 'Test',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Vue', 'Vite', 'Quasar', 'SCSS' ]
    },
  ];

  const projects = [
    {
      link: 'test.co',
      name: 'Test project 1 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Vue', 'Vite', 'Quasar', 'SCSS' ]
    },
    {
      link: 'test.co',
      name: 'Test project 2 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Ruby on Rails', 'Sass', 'SQLite']
    },
    {
      link: 'test.co',
      name: 'Test project 3 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Angular', 'Tailwind', 'Firebase']
    },
    {
      link: 'test.co',
      name: 'Test project 4 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['React', 'Next', 'SCSS']
    },
    {
      link: 'test.co',
      name: 'Test project 5 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Vue', 'Vite', 'Quasar', 'SCSS' ]
    },
    {
      link: 'test.co',
      name: 'Test project 6 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Ruby on Rails', 'Sass', 'SQLite']
    },
    {
      link: 'test.co',
      name: 'Test project 7 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['Angular', 'Tailwind', 'Firebase']
    },
    {
      link: 'test.co',
      name: 'Test project 8 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['React', 'Next', 'SCSS']
    },
    {
      link: 'test.co',
      name: 'Test project 9 - A really nice name!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
      stack: ['React', 'Next', 'SCSS']
    },
  ]
</script>

<style lang="scss" scoped>
  #projects {
    min-height: 100vh;
    margin: 10rem 0;
    display: flex;
    justify-content: center;
    flex-direction: column;

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
  }
</style>