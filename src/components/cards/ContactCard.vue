<template>
  <a
    class="contact-card"
    :class="{ hoverable: props.contact.link }"
    :href="props.contact.link || undefined"
    :target="props.contact.link ? '_blank' : undefined"
    rel="noopener"
    @click="trackContactClick"
  >
    <div class="icon">
      <font-awesome-icon
        v-if="contact.icon"
        :icon="props.contact.icon"
        aria-hidden="true"
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
      aria-hidden="true"
    />
  </a>
</template>

<script setup>
  import { trackEvent } from '@/composables/useAnalytics';

  const props = defineProps(['contact']);

  const trackContactClick = () => {
    if (!props.contact.link) return;
    trackEvent('social_click', {
      network: props.contact.label.toLowerCase(),
      location: 'contact'
    });
  };
</script>

<style lang="scss" scoped>
  .contact-card {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.85rem 0.5rem;
    border-radius: 0.6rem;
    text-decoration: none;
    opacity: 0;
    transition: background-color 0.25s ease, padding 0.25s ease;

    & + .contact-card { box-shadow: 0 -1px 0 var(--default-border); }

    &.hoverable {
      cursor: pointer;

      &:hover {
        background: color-mix(in srgb, var(--accent) 8%, transparent);

        .icon { color: var(--accent); border-color: var(--accent); }
        .arrow { color: var(--accent); opacity: 1; transform: none; }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 2.1rem;
      height: 2.1rem;
      padding: 0.45rem;
      border-radius: 50%;
      border: 1px solid var(--default-border);
      color: var(--secondary-text);
      transition: color 0.25s ease, border-color 0.25s ease;

      svg { width: 100%; height: 100%; }
    }

    .info {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      min-width: 0;

      .label {
        flex: 0 0 5.5rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.78rem;
        color: var(--secondary-text);
      }

      .text {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--default-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .arrow {
      margin-left: auto;
      color: var(--disabled-text);
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.25s ease, transform 0.25s ease, color 0.25s ease;
    }
  }

  @media (hover: none) {
    .contact-card .arrow { opacity: 0.6; transform: none; }
  }

  @media (max-width: 768px) {
    .contact-card .info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.1rem;

      .label { flex: none; font-size: 0.72rem; }
    }
  }
</style>
