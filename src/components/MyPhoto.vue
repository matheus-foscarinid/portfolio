<template>
  <div class="my-photo">
    <img
      ref="myPhoto"
      src="@/assets/images/me.jpg" 
      alt="Matheus Foscarini Dias" 
      :style="{ transform: cardTransform, boxShadow: cardBoxShadow }"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMouseInElement } from '@vueuse/core';

const myPhoto = ref(null);
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(myPhoto);	

const cardTransform = computed(() => {
  if (isOutside.value) return '';

  const MAX_ROTATION = 6;

  const xRotation = MAX_ROTATION / 2 - (elementY.value / elementHeight.value) * MAX_ROTATION;
  const fixedXRotation = xRotation.toFixed(2);

  const yRotation = (elementX.value / elementWidth.value) * MAX_ROTATION - MAX_ROTATION / 2;
  const fixedYRotation = yRotation.toFixed(2);

  const rotation = `rotateX(${fixedXRotation}deg) rotateY(${fixedYRotation}deg)`;
  const perspective = `perspective(${elementWidth.value}px)`;
  return `${perspective} ${rotation}`;
});

const cardBoxShadow = computed(() => {
  if (isOutside.value) return '';

  const MAX_SHADOW = 20;

  const xShadow = MAX_SHADOW / 2 - (elementY.value / elementHeight.value) * MAX_SHADOW;
  const fixedXShadow = xShadow.toFixed(2);

  const yShadow = (elementX.value / elementWidth.value) * MAX_SHADOW - MAX_SHADOW / 2;
  const fixedYShadow = -yShadow.toFixed(2);

  const shadow = `${fixedYShadow}px ${fixedXShadow}px 20px rgba(0, 0, 0, 0.25)`;
  return shadow;
});
</script>

<style lang="scss" scoped>
  .my-photo {
    flex: 2;
    img {
      width: 100%;
      border-radius: 50%;
      aspect-ratio: 1/1;
      border: 2px solid var(--default-border);
      transition: all 0.25s ease-out;
    }
  }
</style>