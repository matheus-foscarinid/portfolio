<template>
  <span>{{ typedText }}</span>
  <span
    v-if="isTyping"
    class="cursor"
    aria-hidden="true"
  ></span>
  <!-- the untyped rest is laid out invisibly so the bubble keeps its final size while typing -->
  <span class="pending">{{ pendingText }}</span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const CHARS_PER_SECOND = 90;

const props = defineProps({
  text: { type: String, required: true },
  isAnimated: { type: Boolean, default: true },
});
const emit = defineEmits(['typed']);

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typedCount = ref(props.isAnimated && !isReducedMotion ? 0 : props.text.length);
const typedText = computed(() => props.text.slice(0, typedCount.value));
const pendingText = computed(() => props.text.slice(typedCount.value));
const isTyping = computed(() => typedCount.value < props.text.length);

let frame = null;

const typeUntilDone = (startTime) => {
  frame = requestAnimationFrame((now) => {
    typedCount.value = Math.min(props.text.length, Math.floor(((now - startTime) / 1000) * CHARS_PER_SECOND));
    if (isTyping.value) typeUntilDone(startTime);
    else emit('typed');
  });
};

onMounted(() => {
  if (isTyping.value) typeUntilDone(performance.now());
});
onUnmounted(() => cancelAnimationFrame(frame));
</script>

<style lang="scss" scoped>
  .pending {
    color: transparent;
  }

  .cursor {
    display: inline-block;
    width: 0.45em;
    height: 1em;
    margin-left: 1px;
    vertical-align: text-bottom;
    background-color: var(--accent);
    animation: blink 0.9s step-end infinite;
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
</style>
