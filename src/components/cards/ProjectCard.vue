<template>
  <div class="project-card">
    <div class="top-content">
      <font-awesome-icon icon="fa-brands fa-github" />
      <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
    </div>
    <a 
      class="title"
      @click="openProjectLink"
    >
      {{ project.name }}
    </a>

    <div class="description">
      {{ project.description }}
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['project', 'reverse']);

  const openProjectLink = () => {
    window.open(props.project.link, '_blank');
  }
</script>

<style lang="scss" scoped>
  .project-card {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
    border-radius: 15px;
    background-color: var(--details-background);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease-in-out;
    text-align: center;

    .top-content {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      align-items: self-start;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      background-color: var(--primary-background);
      transition: all 0.3s ease-in-out;

      svg {
        width: 1.5rem;
        height: 1.5rem;
        transition: all 0.3s ease-in-out;
      }
    }

    .title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-text);
      text-decoration: none;
      transition: all 0.3s ease-in-out;
      text-transform: uppercase;
      cursor: pointer;
    }

    .description {
      font-size: 1rem;
      font-weight: 400;
      color: var(--secondary-text);
      margin-top: 1rem;
    }
  }
</style>