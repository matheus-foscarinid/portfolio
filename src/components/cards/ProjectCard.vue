<template>
  <div class="project-card">
    <div class="top-content">
      <font-awesome-icon icon="fa-brands fa-github" />
      <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
    </div>

    <div class="main-content">
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

    <div class="stack">
      <span 
        v-for="item in project.stack"
        :key="item"
      >
        {{ item }}
      </span>
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

    &:hover {
      transform: scale(1.01) translateY(-0.5rem);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
    }

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
        width: 1.25rem;
        height: 1.25rem;
        transition: all 0.3s ease-in-out;
      }
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .title {
        font-size: 1.5rem;
        line-height: 1.2;
        font-weight: 700;
        color: var(--primary-text);
        text-decoration: none;
        transition: all 0.3s ease-in-out;
        cursor: pointer;
      }
  
      .description {
        font-size: 1rem;
        font-weight: 400;
        color: var(--secondary-text);
      }
    }

    .stack {
      color: var(--disabled-text);
      font-family: var(--alternative-font);
      font-size: 0.875rem;
      display: flex;
      gap: 1rem;
    }
  }
</style>