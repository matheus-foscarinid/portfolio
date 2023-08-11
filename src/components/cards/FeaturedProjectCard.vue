<template>
  <div 
    class="featured-project-card"
    :class="{ 'reverse': reverse }"
  >
    <img 
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
          @click="openProjectLink"
        >
          {{ project.name }}
        </a>
    
        <div class="description">
          <span>{{ project.description }}</span>
        </div>
      </div>

      <div class="bottom">
        <div class="stack">
          <span 
            v-for="item in project.stack"
            :key="item"
          >
            {{ item }}
          </span>
        </div>
  
        <div class="buttons">
          <button @click="openProjectLink">
            {{  $t('PROJECTS.VIEW') }}
          </button>
  
          <button @click="openRepository">
            {{  $t('PROJECTS.REPOSITORY') }}
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
      min-width: 10rem;
      padding: 1rem;
      background: var(--default-border);
      border-radius: 2px;
    }

    .project-image {
      border-radius: 15px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
      background-size: cover;
      width: 30rem;
      cursor: pointer;
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
        justify-content: flex-end;
        gap: 1rem;
        margin-bottom: .5rem;
      }

      .buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;

        button {
          padding: .5rem 1rem;
          border-radius: 0.5rem;
          background-color: var(--details-background);
          color: var(--default-text);
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid var(--default-border);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          

          &:hover {
            transform: scale(1.05);
            background-color: var(--secondary-background);
            box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

  }

  @media (max-width: 768px) {
    .featured-project-card {
      flex-direction: column !important;

      .project-image {
        width: 100%;
        margin-top: 1rem;
      }

      .title, .description {
        text-align: center;
      }

      .bottom {
        .stack {
          margin: 1rem 0;
          justify-content: center;
        }

        .buttons {
          justify-content: center;
        }
      }
    }
  }
</style>