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
    transition: all 0.3s ease-in-out;

    img {
      width: 100%;
      height: 100%;
    }

    &:hover {
      transform: translateY(-0.15rem) scale(1.05);
      box-shadow: 0 0.75rem 1.2rem rgba(0, 0, 0, 0.15);
    }
  }
</style>