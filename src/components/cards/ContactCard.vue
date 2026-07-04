<template>
  <a
    class="contact-card"
    :class="{ hoverable: props.contact.link }"
    :href="props.contact.link || undefined"
    :target="props.contact.link ? '_blank' : undefined"
    rel="noopener"
  >
    <div class="icon">
      <font-awesome-icon
        v-if="contact.icon"
        :icon="props.contact.icon"
      />
      <component
        v-else
        :is="props.contact.customIcon"
      />
    </div>

    <div class="info">
      <span class="label">{{ props.contact.label }}</span>
      <span class="text">{{ props.contact.text }}</span>
    </div>

    <font-awesome-icon
      v-if="props.contact.link"
      class="arrow"
      icon="fa-solid fa-arrow-right"
    />
  </a>
</template>

<script setup>
  const props = defineProps(['contact']);
</script>

<style lang="scss" scoped>
  .contact-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.35rem;
    border-radius: 0.85rem;
    border: 1px solid var(--default-border);
    background: var(--details-background);
    text-decoration: none;
    opacity: 0;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

    &.hoverable {
      cursor: pointer;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--accent);
        box-shadow: 0 0.75rem 1.5rem color-mix(in srgb, var(--accent) 14%, transparent);

        .icon { color: var(--accent); border-color: var(--accent); }
        .arrow { color: var(--accent); transform: translateX(3px); }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 2.75rem;
      height: 2.75rem;
      padding: 0.7rem;
      border-radius: 50%;
      border: 1px solid var(--default-border);
      color: var(--secondary-text);
      transition: all 0.25s ease;

      svg { width: 100%; height: 100%; }
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;

      .label {
        font-family: 'Fira Code', monospace;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--disabled-text);
      }

      .text {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--default-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .arrow {
      margin-left: auto;
      color: var(--disabled-text);
      transition: all 0.25s ease;
    }
  }

  @media (max-width: 768px) {
    .contact-card {
      padding: 1rem;

      .info .text { font-size: 0.95rem; }
    }
  }
</style>
