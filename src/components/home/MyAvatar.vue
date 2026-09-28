<template>
  <div
    ref="container"
    class="my-avatar"
  >
    <div class="avatar-controls">
      <AvatarGestureMenu
        v-if="isReady && gestureMenu.length"
        :groups="gestureMenu"
        @play="playGesture"
      />
      <AvatarChat
        v-show="isReady"
        @gesture="playGesture"
      />
    </div>
    <MyPhoto v-if="hasFailed" />
    <canvas
      v-else
      :key="canvasKey"
      ref="canvas"
      :class="{ ready: isReady }"
      role="img"
      :aria-label="$t('HOME.AVATAR_LABEL')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AvatarGestureMenu from './AvatarGestureMenu.vue';
import AvatarChat from './chat/AvatarChat.vue';
import MyPhoto from './MyPhoto.vue';
import { useAvatarScene } from './useAvatarScene';

const container = ref(null);
const canvas = ref(null);
const { isReady, hasFailed, canvasKey, gestureMenu, playGesture } = useAvatarScene({ container, canvas });
</script>

<style lang="scss" scoped>
  .my-avatar {
    position: relative;
    z-index: 2;
    flex: none;
    height: min(44rem, calc(100vh - 11rem));
    aspect-ratio: 3/4;
    display: flex;
    align-items: center;

    // covers the avatar so the chat bubble can place itself against the whole avatar box
    .avatar-controls {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
      padding: 0.5rem;
      pointer-events: none;

      > * { pointer-events: auto; }
    }

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
