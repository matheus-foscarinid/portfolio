<template>
  <div
    class="project-card"
    :class="{ clickable: url }"
    @click="openProjectLink"
  >
    <div
      v-if="hasMedia"
      class="media"
    >
      <video
        v-if="project.video"
        class="thumb"
        :src="project.video"
        autoplay
        loop
        muted
        playsinline
        preload="metadata"
      />

      <div
        v-else-if="project.scroll"
        class="scroll-image-container"
      >
        <img
          class="scroll-image"
          :srcset="project.srcset"
          :src="project.image"
          alt="Project Image"
          loading="lazy"
        >
      </div>

      <img
        v-else
        class="thumb"
        :src="project.image"
        alt="Project Image"
        loading="lazy"
      />
    </div>

    <div class="body">
      <div class="header">
        <span class="title">{{ project.name }}</span>

        <span class="icons">
          <font-awesome-icon
            v-if="project.repository"
            icon="fa-brands fa-github"
            aria-hidden="true"
          />
          <font-awesome-icon
            v-if="project.link"
            icon="fa-solid fa-arrow-up-right-from-square"
            aria-hidden="true"
          />
        </span>
      </div>

      <p class="description">{{ project.description }}</p>

      <ul class="stack">
        <li
          v-for="item in project.stack"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps(['project']);

  const url = computed(() => props.project.link || props.project.repository);

  const hasMedia = computed(() => {
    const p = props.project;
    return Boolean(p.video || p.scroll || p.image);
  });

  const openProjectLink = () => {
    if (!url.value) return;
    window.open(url.value, '_blank');
  }
</script>

<style lang="scss" scoped>
  .project-card {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem;
    border-radius: 1rem;
    background-color: var(--details-background);
    border: 1px solid var(--default-border);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

    &.clickable { cursor: pointer; }

    &:hover {
      transform: translateY(-4px);
      border-color: color-mix(in srgb, var(--accent) 55%, var(--default-border));
      box-shadow: 0 1rem 2rem color-mix(in srgb, var(--accent) 14%, transparent);
    }

    .media {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 0.1rem 1rem rgba(0, 0, 0, 0.15);

      .thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .scroll-image-container {
        position: relative;
        width: 100%;
        height: 100%;

        .scroll-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: object-position 6s ease-in-out;
        }
      }
    }

    &:hover .media .scroll-image-container .scroll-image {
      object-position: bottom;
    }

    .body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;

      .title {
        font-size: 1.25rem;
        line-height: 1.2;
        font-weight: 700;
        color: var(--default-text);
      }

      .icons {
        display: flex;
        gap: 0.6rem;
        color: var(--secondary-text);
        flex-shrink: 0;

        svg { width: 1.1rem; height: 1.1rem; }
      }
    }

    .description {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--secondary-text);
    }

    .stack {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0;
      margin: 0;

      li {
        font-family: 'Fira Code', monospace;
        font-size: 0.72rem;
        color: var(--secondary-text);
        padding: 0.3rem 0.6rem;
        border: 1px solid var(--default-border);
        border-radius: 0.4rem;
      }
    }
  }
</style>
