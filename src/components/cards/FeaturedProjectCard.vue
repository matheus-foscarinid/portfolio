<template>
  <div 
    class="featured-project-card"
    :class="{ 'reverse': reverse }"
  >
    <div
      v-if="project.scroll" 
      class="scroll-image-container"
    >
      <img
        class="scroll-image"
        :srcset="project.srcset"
        :src="project.image"
        alt="Project Image"
        @click="openProjectLink"
      >
    </div>

    <img
      v-else
      class="project-image"
      :src="project.image"
      alt="Project Image"
      @click="openProjectLink"
    />

    <div class="featured-project-sign">
      {{ $t('PROJECTS.FEATURED') }}
    </div>

    <div class="project-infos">
      <div>
        <a 
          class="title"
          :href="project.link"
        >
          {{ project.name }}
        </a>
    
        <div class="description">
          <span>{{ project.description }}</span>
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

      <div class="bottom">
        <div class="buttons">
          <button @click="openProjectLink">
            {{ $t('PROJECTS.VIEW') }}
            <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
          </button>
  
          <button 
            v-if="project.repository"
            @click="openRepository"
          >
            {{ $t('PROJECTS.REPOSITORY') }}
            <font-awesome-icon icon="fa-brands fa-github" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['project', 'reverse']);

  const openProjectLink = () => {
    window.open(props.project.link, '_blank');
  }

  const openRepository = () => {
    window.open(props.project.repository, '_blank');
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
    text-align: left;
    opacity: 0;

    &.reverse {
      flex-direction: row-reverse;
      text-align: right;


      & .featured-project-sign {
        left: 1rem;
        right: auto;
      }

      .stack, .buttons {
        justify-content: flex-end;
      }
    }

    .featured-project-sign {
      position: absolute;
      top: -1.5rem;
      right: 1rem;
      min-width: 10rem;
      text-align: center;
      padding: .5rem 1rem;
      background: var(--disabled-text);
      color: var(--highlight);
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
    }

    .project-image {
      border-radius: 15px;
      background-size: cover;
      width: 30rem;
      aspect-ratio: 16/9;
      cursor: pointer;
      box-shadow: 0 0.1rem 1rem rgba(0, 0, 0, 0.15);
      transition: transform .3s ease-in-out;

      &:hover {
        transform: scale(1.025);
      }
    }

    .scroll-image-container {
      position: relative;
      width: 30rem;
      aspect-ratio: 16/9;
      overflow: hidden;
      border-radius: 15px;
      background-color: var(--details-background);
      transition: transform .3s ease-in-out;
      box-shadow: 0 0.1rem 1rem rgba(0, 0, 0, 0.15);
      cursor: pointer;

      &:hover {
        transform: scale(1.025);
      }

      .scroll-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        transition: object-position 8s ease-in-out;

        &:hover {
          object-position: bottom;
        }
      }
    }

    .project-infos {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

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
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;

        span {
          max-width: 30rem;
        }
      }

      .bottom {
        width: 100%;
      }

      .stack {
        color: var(--disabled-text);
        font-family: var(--alternative-font);
        font-size: 0.875rem;
        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        margin-top: .5rem;
      }

      .buttons {
        display: flex;
        gap: .5rem;
        justify-content: flex-start;

        button {
          padding: .5rem 1rem;
          border-radius: 0.5rem;
          background-color: var(--details-background);
          color: var(--default-text);
          font-size: 1.2rem;
          cursor: pointer;
          border: none;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          align-self: center;
          justify-content: center;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

  }

  @media (max-width: 768px) {
    .featured-project-card {
      padding: 1rem;
      flex-direction: column !important;

      .project-image, .scroll-image-container {
        width: 100%;
        margin-top: 1rem;
      }

      .title, .description {
        text-align: center;
      }

      .stack {
        margin: 1rem 0;
        justify-content: center !important;
      }

      .buttons {
        justify-content: center !important;
      }

      .title {
        display: flex;
        justify-content: center;
        font-size: 1.5rem !important;
        text-align: center;
      }
    }
  }
</style>