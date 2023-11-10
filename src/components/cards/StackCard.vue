<template>
  <div class="stack" :title="props.name">
    <img 
      :src="`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${props.name}/${props.name}-${props.type}.svg`"
      :alt="props.name"
    />
  </div>
</template>

<script setup>
  const props = defineProps(['name', 'type']);
</script >

<style lang="scss" scoped>
  .stack {
    background-color: var(--details-background);
    width: 2rem;
    height: 2rem;
    padding: 0.75rem;
    box-sizing: content-box;
    border-radius: 50%;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0.5rem 1.2rem rgba(0, 0, 0, 0.2);
    }
  }
</style>