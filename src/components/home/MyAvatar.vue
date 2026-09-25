<template>
  <div
    ref="container"
    class="my-avatar"
  >
    <MyPhoto v-if="hasFailed" />
    <canvas
      v-else
      :key="canvasKey"
      ref="canvas"
      :class="{ ready: isReady }"
      role="img"
      aria-label="3D avatar of Matheus Foscarini Dias"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MyPhoto from './MyPhoto.vue';
import { useAvatarScene } from './useAvatarScene';

const container = ref(null);
const canvas = ref(null);
const { isReady, hasFailed, canvasKey } = useAvatarScene({ container, canvas });
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
