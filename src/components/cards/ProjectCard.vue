<template>
  <div 
    class="project-card"
    :class="{ 'reverse': reverse }"
  >
    <div class="project-image"/>

    <div class="project-infos">
      <a 
        class="title"
        :href="project.link"
        target="_blank"
      >
        {{ project.name }}
      </a>
  
      <div class="description">
        {{ project.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['project', 'reverse']);
</script>

<style lang="scss" scoped>
  .project-card {
    display: flex;
    width: 100%;
    min-height: 15rem;
    padding: 2rem;
    gap: 2rem;
    border-radius: 15px;
    background-color: var(--details-background);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease-in-out;
    text-align: center;

    &.reverse {
      flex-direction: row-reverse;
    }

    .project-image {
      background-color: #b5b5bf;
      border-radius: 15px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
      overflow: hidden;
      width: 30rem;
      height: 20rem;
    }

    .project-infos {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-text);
        text-decoration: none;
        transition: all 0.3s ease-in-out;
        text-transform: uppercase;
      }

      .description {
        font-size: 1rem;
        font-weight: 400;
        color: var(--secondary-text);
        margin-top: 1rem;
        width: 30rem;
      }
    }

  }
</style>