<template>
  <div class="my-avatar">
    <MyPhoto v-if="hasFailed" />
    <canvas
      v-else
      ref="canvas"
      :class="{ ready: isReady }"
      role="img"
      aria-label="3D avatar of Matheus Foscarini Dias"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import MyPhoto from './MyPhoto.vue';

const canvas = ref(null);
const isReady = ref(false);
const hasFailed = ref(false);

let avatarScene = null;
let visibilityObserver = null;
let isUnmounted = false;

const toggleRendering = ([entry]) => {
  if (entry.isIntersecting) avatarScene.start();
  else avatarScene.stop();
};

onMounted(async () => {
  try {
    const { createAvatarScene } = await import('./avatar/createAvatarScene');
    if (!canvas.value) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = await createAvatarScene(canvas.value, { isReducedMotion });
    if (isUnmounted) return scene.dispose();

    avatarScene = scene;
    visibilityObserver = new IntersectionObserver(toggleRendering);
    visibilityObserver.observe(canvas.value);
    isReady.value = true;
  } catch {
    hasFailed.value = true;
  }
});

onUnmounted(() => {
  isUnmounted = true;
  visibilityObserver?.disconnect();
  avatarScene?.dispose();
});
</script>

<style lang="scss" scoped>
  .my-avatar {
    flex: none;
    height: min(44rem, calc(100vh - 11rem));
    aspect-ratio: 3/4;
    display: flex;
    align-items: center;

    canvas {
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: pan-y;
      opacity: 0;
      transition: opacity 0.6s ease;

      &:active { cursor: grabbing; }
      &.ready { opacity: 1; }
    }
  }
</style>
