<template>
  <button
    class="resume-button"
    :class="{ compact: props.compact, round: props.round }"
    type="button"
    :aria-label="props.round ? $t('HOME.VIEW_CV') : undefined"
    :title="props.round ? $t('HOME.VIEW_CV') : undefined"
    @click="open"
  >
    <font-awesome-icon icon="fas fa-file-lines" aria-hidden="true" />
    <span v-if="!props.round">{{ $t('HOME.VIEW_CV') }}</span>
  </button>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';
  import { viewCV } from '@/composables/useResume';

  const { t: $t } = useI18n();

  const props = defineProps({
    location: { type: String, required: true },
    compact: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
  });

  const open = () => viewCV(props.location);
</script>

<style lang="scss" scoped>
  .resume-button {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.85rem 1.9rem;
    border: none;
    border-radius: 999px;
    background-color: var(--accent);
    color: var(--accent-contrast);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    // sheen sweeps across on hover. sits under the label, which needs its
    // own stacking context to stay above it
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 45%;
      height: 100%;
      background: linear-gradient(
        100deg,
        transparent,
        color-mix(in srgb, var(--accent-contrast) 28%, transparent),
        transparent
      );
      transform: translateX(-180%);
      transition: transform 0.6s ease;
    }

    span, svg {
      position: relative;
      z-index: 1;
    }

    svg { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

    &:hover {
      transform: translateY(-3px);

      &::before { transform: translateX(320%); }

      svg { transform: translateY(-2px) rotate(-6deg); }
    }

    &:active { transform: translateY(-1px); }

    &.compact {
      gap: 0.6rem;
      padding: 0.85rem 1.4rem;
      font-size: 0.95rem;
    }

    &.round {
      width: 3.5rem;
      height: 3.5rem;
      padding: 0;
      justify-content: center;
      font-size: 1.2rem;

      // the sheen reads as a glint across a disc, so it sweeps slower and wider
      &::before { width: 60%; }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .resume-button,
    .resume-button svg,
    .resume-button::before { transition: none; }
  }
</style>
