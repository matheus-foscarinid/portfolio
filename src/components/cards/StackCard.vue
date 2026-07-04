<template>
  <div class="stack">
    <div class="icon" :class="{ 'invert-on-dark': monochrome.includes(props.name) }">
      <img
        :src="`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${props.name}/${props.name}-${props.type}.svg`"
        :alt="props.label"
      />
    </div>
    <span class="label">{{ props.label }}</span>
  </div>
</template>

<script setup>
  const props = defineProps(['name', 'type', 'label']);

  const monochrome = ['nextjs'];
</script >

<style lang="scss" scoped>
  .stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 4.5rem;

    .icon {
      background-color: var(--details-background);
      width: 2rem;
      height: 2rem;
      padding: 0.75rem;
      box-sizing: content-box;
      border-radius: 50%;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      img {
        width: 100%;
        height: 100%;
      }
    }

    [data-theme="dark"] .icon.invert-on-dark img {
      filter: invert(1);
    }

    .label {
      font-family: 'Fira Code', monospace;
      font-size: 0.75rem;
      color: var(--secondary-text);
      text-align: center;
    }

    &:hover .icon {
      transform: scale(1.1);
      box-shadow: 0 0.5rem 1.2rem rgba(0, 0, 0, 0.2);
    }
  }
</style>
