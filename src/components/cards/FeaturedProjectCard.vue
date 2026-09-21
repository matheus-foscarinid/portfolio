<template>
  <article
    class="featured-project-card"
    :class="{ 'reverse': reverse }"
  >
    <div
      v-if="hasMedia"
      class="media"
      @click="openProjectLink"
    >
      <div
        v-if="project.metrics"
        class="perf-panel"
      >
        <div class="perf-chrome">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="perf-url">{{ project.metricsTitle }}</span>
        </div>
        <ul class="perf-metrics">
          <li
            v-for="metric in project.metrics"
            :key="metric.label"
          >
            <span class="key">{{ metric.label }}</span>
            <span class="value">{{ metric.value }}</span>
          </li>
        </ul>
      </div>

      <div
        v-else-if="project.console"
        class="perf-panel term-panel"
      >
        <div class="perf-chrome">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="perf-url">{{ project.consoleTitle }}</span>
        </div>
        <div class="term-lines">
          <span
            v-for="(line, index) in project.console"
            :key="index"
            class="line"
            :class="{ accent: line.accent }"
          >
            <span
              v-if="line.prompt"
              class="prompt"
            >{{ line.prompt }} </span>{{ line.text }}
          </span>
        </div>
      </div>

      <video
        v-else-if="project.video"
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
      <div class="heading">
        <a
          v-if="project.link"
          class="title"
          :href="project.link"
          target="_blank"
        >
          {{ project.name }}
        </a>
        <span v-else class="title static">{{ project.name }}</span>

        <span
          v-if="project.years"
          class="years"
        >{{ project.years }}</span>

        <span
          v-if="project.tag"
          class="tag"
        >{{ project.tag }}</span>
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

      <div class="buttons">
        <button
          v-if="project.link"
          class="primary"
          @click="openProjectLink"
        >
          {{ $t('PROJECTS.VIEW') }}
          <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
        </button>

        <button
          v-if="project.repository"
          class="secondary"
          @click="openRepository"
        >
          {{ $t('PROJECTS.REPOSITORY') }}
          <font-awesome-icon icon="fa-brands fa-github" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps(['project', 'reverse']);

  const hasMedia = computed(() => {
    const p = props.project;
    return Boolean(p.metrics || p.console || p.video || p.scroll || p.image);
  });

  const openProjectLink = () => {
    const url = props.project.link || props.project.repository;
    if (!url) return;
    window.open(url, '_blank');
  }

  const openRepository = () => {
    window.open(props.project.repository, '_blank');
  }
</script>

<style lang="scss" scoped>
  .featured-project-card {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1.5rem 0;
    gap: 4rem;
    text-align: left;
    opacity: 0;

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
      border-radius: 0.9rem;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .media:hover .project-image,
    .media:hover .scroll-image-container,
    .media:hover .perf-panel {
      transform: scale(1.02);
    }

    .perf-panel {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 0.9rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: var(--dark-background);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      text-align: left;

      .perf-chrome {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.6rem 0.85rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);

        .dot {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
        }
        .dot:first-child { background: var(--accent-on-dark); }

        .perf-url {
          margin-left: 0.5rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .perf-metrics {
        list-style: none;
        margin: 0;
        padding: 0.5rem 0.85rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        gap: 0.15rem;
        font-family: 'Fira Code', monospace;

        li {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          padding: 0.35rem 0;
          font-size: clamp(0.72rem, 1.4vw, 0.85rem);
          border-bottom: 1px dashed rgba(255, 255, 255, 0.07);
        }
        li:last-child { border-bottom: 0; }

        .key { color: rgba(255, 255, 255, 0.7); }
        .value { color: var(--accent-on-dark); font-weight: 700; white-space: nowrap; }
      }

      .term-lines {
        margin: 0;
        padding: 0.75rem 0.85rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        font-family: 'Fira Code', monospace;
        font-size: clamp(0.68rem, 1.35vw, 0.82rem);
        line-height: 1.9;
        word-break: break-word;

        .line {
          display: block;
          color: rgba(255, 255, 255, 0.7);
        }
        .line.accent { color: var(--accent-on-dark); font-weight: 700; }
        .prompt {
          color: var(--accent-on-dark);
          margin-right: 0.5rem;
        }
      }
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

      .heading {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 0.75rem;

        .years {
          font-family: 'Fira Code', monospace;
          font-size: 0.78rem;
          color: var(--disabled-text);
          white-space: nowrap;
        }

        .tag {
          padding: 0.28rem 0.6rem;
          border-radius: 0.4rem;
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          color: var(--accent);
          font-family: 'Fira Code', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.02em;
        }
      }

      .title {
        font-size: clamp(1.6rem, 3vw, 2.1rem);
        font-weight: 600;
        letter-spacing: -0.03em;
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
          font-size: 0.73rem;
          color: var(--disabled-text);
          padding: 0.28rem 0.55rem;
          border-radius: 0.4rem;
          background-color: color-mix(in srgb, var(--default-border) 40%, transparent);
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
          padding: 0.6rem 1.25rem;
          border-radius: 999px;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, color 0.25s ease;

          svg { transition: transform 0.25s ease; }

          &.primary {
            background-color: var(--accent);
            color: var(--accent-contrast);

            &:hover {
              transform: translateY(-2px);

              svg { transform: translate(2px, -2px); }
            }
          }

          &.secondary {
            background-color: transparent;
            border-color: color-mix(in srgb, var(--default-border) 70%, transparent);
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
      align-items: stretch;
      padding: 0;
      gap: 1.25rem;

      .media { width: 100%; max-width: 100%; }

      .project-infos,
      &.reverse .project-infos {
        align-items: flex-start;
        text-align: left;
        gap: 0.85rem;


        .title { font-size: 1.5rem; }

        .description {
          font-size: 0.92rem;
          line-height: 1.6;
          max-width: none;
        }

        .buttons {
          width: 100%;

          button {
            flex: 1;
            justify-content: center;
            min-height: 2.75rem;
          }
        }
      }
    }
  }
</style>
