<template>
  <section id="lighthouse" class="lighthouse">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('LIGHTHOUSE.TITLE') }}</h2>
      </header>

      <p class="subtitle">{{ $t('LIGHTHOUSE.SUBTITLE') }}</p>

      <div class="scores">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="score"
        >
          <div class="ring">
            <svg
              class="ring-svg"
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <circle
                class="track"
                cx="60"
                cy="60"
                r="54"
              />
              <circle
                class="progress"
                cx="60"
                cy="60"
                r="54"
                :stroke-dasharray="CIRCUMFERENCE"
                :stroke-dashoffset="offsetFor(metric.value)"
              />
            </svg>
            <span class="number">{{ Math.round(metric.value * progress) }}</span>
          </div>
          <span class="label">{{ metric.label }}</span>
        </div>
      </div>

      <a
        class="verify"
        :href="verifyUrl"
        target="_blank"
        rel="noopener"
      >
        {{ $t('LIGHTHOUSE.VERIFY') }}
      </a>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { onReveal } from '@/composables/useReveal';

  const { t: $t } = useI18n();

  // single source of truth - swap to a committed lighthouse.json to make it auto-update
  const metrics = [
    { label: 'Performance', value: 100 },
    { label: 'Accessibility', value: 100 },
    { label: 'Best Practices', value: 100 },
    { label: 'SEO', value: 100 },
  ];

  const verifyUrl = 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmatheusdias.dev';

  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress = ref(0);

  const offsetFor = (value) =>
    CIRCUMFERENCE * (1 - (value / 100) * progress.value);

  const animateIn = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      progress.value = 1;
      return;
    }

    const DURATION = 1200;
    let startTime = null;

    const step = (now) => {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / DURATION, 1);
      progress.value = 1 - Math.pow(1 - t, 3);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  onMounted(() => onReveal('#lighthouse', animateIn));
</script>

<style lang="scss" scoped>
  .lighthouse {
    --score: #2f9e5f;

    padding: 2.5rem 0;
    text-align: center;

    .section-heading {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.6rem;

      .marker {
        display: block;
        width: 2.5rem;
        height: 3px;
        background-color: var(--accent);
        margin-bottom: 1rem;
      }

      h2 {
        font-size: clamp(2rem, 4vw, 2.75rem);
        font-weight: 800;
        letter-spacing: -0.02em;
        margin: 0;
      }
    }

    .subtitle {
      color: var(--secondary-text);
      max-width: 48ch;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .scores {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem 2.5rem;
    }

    .score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .ring {
        position: relative;
        width: 5.5rem;
        height: 5.5rem;

        .ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .track {
          fill: none;
          stroke: var(--default-border);
          stroke-width: 6;
        }

        .progress {
          fill: none;
          stroke: var(--score);
          stroke-width: 6;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.1s linear;
        }

        .number {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fira Code', monospace;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--score);
        }
      }

      .label {
        font-family: 'Fira Code', monospace;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--secondary-text);
        max-width: 8rem;
      }
    }

    .verify {
      display: inline-block;
      margin-top: 2rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      color: var(--secondary-text);
      text-decoration: none;
      border-bottom: 1px solid var(--default-border);
      padding-bottom: 2px;
      transition: color 0.25s ease, border-color 0.25s ease;

      &:hover {
        color: var(--accent);
        border-color: var(--accent);
      }
    }
  }

  html[data-theme="dark"] .lighthouse {
    --score: #8ec07c;
  }

  @media (max-width: 560px) {
    .lighthouse .scores {
      gap: 2rem;
    }
  }
</style>
