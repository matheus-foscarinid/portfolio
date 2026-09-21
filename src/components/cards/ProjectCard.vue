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
      <span
        v-if="project.tag"
        class="tag"
      >{{ project.tag }}</span>

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
        :srcset="project.srcset"
        :src="project.image"
        sizes="(max-width: 768px) 92vw, 30vw"
        :alt="project.name"
        loading="lazy"
      />
    </div>

    <div class="body">
      <div class="header">
        <span class="title">
          {{ project.name }}
          <span
            v-if="project.years"
            class="years"
          >{{ project.years }}</span>
        </span>

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
    gap: 1.1rem;

    &.clickable { cursor: pointer; }

    &:hover .header .title { color: var(--accent); }

    .media {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 0.9rem;
      overflow: hidden;
      background-color: var(--details-background);

      .tag {
        position: absolute;
        z-index: 1;
        top: 0.7rem;
        left: 0.7rem;
        padding: 0.25rem 0.55rem;
        border-radius: 0.4rem;
        backdrop-filter: blur(8px);
        background: color-mix(in srgb, var(--dark-background) 55%, transparent);
        color: #fff;
        font-family: 'Fira Code', monospace;
        font-size: 0.66rem;
        letter-spacing: 0.02em;
      }

      .thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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

    &:hover .media {
      .scroll-image-container .scroll-image { object-position: bottom; }

      .thumb { transform: scale(1.04); }
    }

    .body {
      flex: 1;
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
        font-size: 1.15rem;
        line-height: 1.25;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: var(--default-text);
        transition: color 0.25s ease;

        .years {
          margin-left: 0.6rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--disabled-text);
          white-space: nowrap;
        }
      }

      .icons {
        display: flex;
        gap: 0.6rem;
        color: var(--disabled-text);
        flex-shrink: 0;

        svg { width: 0.95rem; height: 0.95rem; }
      }
    }

    .description {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--secondary-text);
    }

    .stack {
      margin-top: auto;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0;

      li {
        font-family: 'Fira Code', monospace;
        font-size: 0.72rem;
        color: var(--disabled-text);
        padding: 0.28rem 0.55rem;
        border-radius: 0.4rem;
        background-color: color-mix(in srgb, var(--default-border) 40%, transparent);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .project-card .media .thumb { transition: none; }

    .project-card:hover .media .thumb { transform: none; }
  }

  @media (max-width: 768px) {
    .project-card {
      gap: 0.9rem;

      .header .title { font-size: 1.1rem; }

      .description {
        font-size: 0.9rem;
        line-height: 1.55;
      }
    }
  }
</style>
