<template>
  <button
    class="avatar-toggle"
    :aria-label="label"
  >
    <font-awesome-icon :icon="icon" aria-hidden="true" />
    <span class="label" aria-hidden="true">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
});
</script>

<style lang="scss" scoped>
  .avatar-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-width: 6.5rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--secondary-background) 45%, transparent);
    backdrop-filter: blur(4px);
    color: var(--accent);
    font-family: 'Fira Code', monospace;
    font-size: 0.68rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

    &:hover,
    &:focus-visible,
    &[aria-expanded="true"] {
      background-color: var(--accent);
      color: var(--accent-contrast);
    }

    &:active { transform: scale(0.96); }

    @media (max-width: 768px) {
      min-width: 0;
      width: 1.9rem;
      height: 1.9rem;
      padding: 0;

      .label { display: none; }
    }
  }
</style>
