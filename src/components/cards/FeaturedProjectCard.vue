<template>
  <article
    class="featured-project-card"
    :class="{ 'reverse': reverse }"
  >
    <div class="media" @click="openProjectLink">
      <video
        v-if="project.video"
        class="project-image"
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
        class="project-image"
        :src="project.image"
        alt="Project Image"
        loading="lazy"
      />
    </div>

    <div class="project-infos">
      <span class="featured-tag">{{ $t('PROJECTS.FEATURED') }}</span>

      <a
        v-if="project.link"
        class="title"
        :href="project.link"
        target="_blank"
      >
        {{ project.name }}
      </a>
      <span v-else class="title static">{{ project.name }}</span>

      <p class="description">{{ project.description }}</p>

      <ul class="stack">
        <li
          v-for="item in project.stack"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>

      <div class="buttons">
        <button
          v-if="project.link"
          class="primary"
          @click="openProjectLink"
        >
          {{ $t('PROJECTS.VIEW') }}
          <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
        </button>

        <button
          v-if="project.repository"
          class="secondary"
          @click="openRepository"
        >
          {{ $t('PROJECTS.REPOSITORY') }}
          <font-awesome-icon icon="fa-brands fa-github" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
  const props = defineProps(['project', 'reverse']);

  const openProjectLink = () => {
    if (!props.project.link) return;
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
    padding: 1.75rem;
    gap: 2.5rem;
    border-radius: 1rem;
    background-color: var(--details-background);
    border: 1px solid var(--default-border);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
    text-align: left;
    opacity: 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      border-color: color-mix(in srgb, var(--accent) 55%, var(--default-border));
      box-shadow: 0 1rem 2rem color-mix(in srgb, var(--accent) 14%, transparent);
    }

    &.reverse {
      flex-direction: row-reverse;

      .project-infos { align-items: flex-end; text-align: right; }
    }

    .media {
      flex: 0 0 auto;
      width: 28rem;
      max-width: 55%;
      cursor: pointer;
    }

    .project-image,
    .scroll-image-container {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 0.75rem;
      object-fit: cover;
      box-shadow: 0 0.1rem 1rem rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease-in-out;
    }

    .media:hover .project-image,
    .media:hover .scroll-image-container {
      transform: scale(1.025);
    }

    .scroll-image-container {
      position: relative;
      overflow: hidden;

      .scroll-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        transition: object-position 8s ease-in-out;
      }

      &:hover .scroll-image { object-position: bottom; }
    }

    .project-infos {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 1rem;

      .featured-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--secondary-text);

        &::before {
          content: '';
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: var(--accent);
        }
      }

      .title {
        font-size: clamp(1.6rem, 3vw, 2.1rem);
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.1;
        color: var(--default-text);
        text-decoration: none;

        &:not(.static) {
          cursor: pointer;

          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -3px;
            width: 100%;
            height: 2px;
            background: var(--accent);
            transform: scaleX(0);
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
          }

          &:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
        }
      }

      .description {
        color: var(--secondary-text);
        line-height: 1.65;
        max-width: 42ch;
      }

      .stack {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0;

        li {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--secondary-text);
          padding: 0.3rem 0.6rem;
          border: 1px solid var(--default-border);
          border-radius: 0.4rem;
        }
      }

      .buttons {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;

        button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, color 0.25s ease;

          svg { transition: transform 0.25s ease; }

          &.primary {
            background-color: var(--accent);
            color: var(--accent-contrast);

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 0.5rem 1rem color-mix(in srgb, var(--accent) 30%, transparent);

              svg { transform: translate(2px, -2px); }
            }
          }

          &.secondary {
            background-color: transparent;
            border-color: var(--default-border);
            color: var(--default-text);

            &:hover {
              border-color: var(--accent);
              color: var(--accent);
            }
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .featured-project-card {
      flex-direction: column !important;
      padding: 1rem;
      gap: 1.5rem;

      .media { width: 100%; max-width: 100%; }

      .project-infos,
      &.reverse .project-infos {
        align-items: flex-start;
        text-align: left;
      }
    }
  }
</style>
