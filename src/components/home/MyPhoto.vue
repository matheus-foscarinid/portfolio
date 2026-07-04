<template>
  <div class="my-photo">
    <img
      ref="myPhoto"
      srcset="
        /images/me/me_w_280.webp 280w,
        /images/me/me_w_794.webp 794w,
        /images/me/me_w_1130.webp 1130w,
        /images/me/me_w_1440.webp 1440w
      "
      sizes="(max-width: 768px) 280px, 380px"
      src="/images/me/me_w_1440.webp"
      alt="Matheus Foscarini Dias"
      fetchpriority="high"
      width="380"
      height="380"
      :style="{ transform: cardTransform, boxShadow: cardBoxShadow }"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const myPhoto = ref(null);

const elementX = ref(0);
const elementY = ref(0);
const elementWidth = ref(0);
const elementHeight = ref(0);
const isOutside = ref(true);

const handleMouseMove = (event) => {
  const el = myPhoto.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  elementWidth.value = rect.width;
  elementHeight.value = rect.height;
  elementX.value = event.clientX - rect.left;
  elementY.value = event.clientY - rect.top;
  isOutside.value =
    elementX.value < 0 ||
    elementY.value < 0 ||
    elementX.value > rect.width ||
    elementY.value > rect.height;
};

onMounted(() => document.addEventListener('mousemove', handleMouseMove));
onUnmounted(() => document.removeEventListener('mousemove', handleMouseMove));

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
    flex: 1;
    max-width: 380px;

    &::before {
      content: '';
      position: absolute;
      inset: -0.9rem;
      border-radius: 50%;
      border: 2px solid var(--accent);
      clip-path: polygon(0 0, 100% 0, 100% 55%, 0 55%);
      pointer-events: none;
    }

    img {
      width: 100%;
      border-radius: 50%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border: 2px solid var(--default-border);
      transition: all 0.25s ease-out;
    }
  }

  @media (max-width: 768px) {
    .my-photo {
      align-self: center;
      max-width: 280px;
      &::before { inset: -0.7rem; }

      img { height: 100%; }
    }
  }
</style>