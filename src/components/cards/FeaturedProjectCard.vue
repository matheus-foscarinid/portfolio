<template>
  <div 
    class="featured-project-card"
    :class="{ 'reverse': reverse }"
  >
    <div 
      class="project-image"
      @click="openProjectLink"
    />
    <div class="featured-project-sign">
      Featured Project
    </div>

    <div class="project-infos">
      <div>
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
  </div>
</template>

<script setup>
  const props = defineProps(['project', 'reverse']);

  const openProjectLink = () => {
    window.open(props.project.link, '_blank');
  }
</script>

<style lang="scss" scoped>
  .featured-project-card {
    display: flex;
    width: 100%;
    min-height: 15rem;
    padding: 2rem;
    gap: 2rem;
    border-radius: 15px;
    background-color: var(--details-background);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease-in-out;
    text-align: left;

    &.reverse {
      flex-direction: row-reverse;
      text-align: right;


      & .featured-project-sign {
        left: 1rem;
        right: auto;
      }

      .stack {
        align-self: flex-end !important;
      }
    }

    .featured-project-sign {
      position: absolute;
      top: -1.5rem;
      right: 1rem;
      width: 10rem;
      padding: 1rem;
      background: var(--default-border);
      border-radius: 2px;
    }

    .project-image {
      background-color: #b5b5bf;
      border-radius: 15px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
      overflow: hidden;
      width: 30rem;
      height: 20rem;
      cursor: pointer;
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
        cursor: pointer;
      }

      .description {
        font-size: 1rem;
        font-weight: 400;
        color: var(--secondary-text);
        margin-top: 1rem;
        width: 30rem;
      }

      .stack {
        color: var(--disabled-text);
        font-family: var(--alternative-font);
        font-size: 0.875rem;
        display: flex;
        gap: 1rem;
        align-self: flex-start;
        margin-top: 3rem;
      }
    }

  }
</style>