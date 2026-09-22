<template>
  <Transition name="fab">
    <ResumeButton
      v-if="isVisible"
      class="resume-fab"
      location="fab"
      round
    />
  </Transition>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  import ResumeButton from '@/components/ResumeButton.vue';

  const isVisible = ref(false);

  // shows once the hero (and its own resume button) has scrolled away
  let observer = null;

  onMounted(() => {
    const hero = document.querySelector('#home');
    if (!hero) return;

    observer = new IntersectionObserver(
      ([entry]) => { isVisible.value = !entry.isIntersecting; },
      { rootMargin: '-40% 0px 0px 0px' }
    );
    observer.observe(hero);
  });

  onUnmounted(() => observer?.disconnect());
</script>

<style lang="scss" scoped>
  .resume-fab {
    position: fixed;
    right: calc(2rem + env(safe-area-inset-right));
    bottom: calc(2rem + env(safe-area-inset-bottom));
    z-index: 90;
    // the accent-tinted layer lifts the disc off the page, the dark one grounds it
    box-shadow:
      0 0.75rem 1.75rem color-mix(in srgb, var(--accent) 45%, transparent),
      0 0.2rem 0.5rem rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow:
        0 1rem 2.25rem color-mix(in srgb, var(--accent) 55%, transparent),
        0 0.25rem 0.6rem rgba(0, 0, 0, 0.24);
    }
  }

  .fab-enter-active,
  .fab-leave-active {
    transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .fab-enter-from,
  .fab-leave-to {
    opacity: 0;
    transform: translateY(0.75rem) scale(0.85);
  }

  @media (prefers-reduced-motion: reduce) {
    .fab-enter-active,
    .fab-leave-active { transition: opacity 0.25s ease; }

    .fab-enter-from,
    .fab-leave-to { transform: none; }
  }

  @media (max-width: 768px) {
    .resume-fab {
      right: calc(1.2rem + env(safe-area-inset-right));
      bottom: calc(1.2rem + env(safe-area-inset-bottom));
    }
  }
</style>
