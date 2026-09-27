<template>
  <div
    ref="root"
    class="gesture-menu"
    data-avatar-ignore
  >
    <button
      class="toggle"
      :class="{ 'is-calling': !hasOpened }"
      :aria-label="$t('HOME.GESTURE_MENU')"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <font-awesome-icon icon="fas fa-wand-magic-sparkles" aria-hidden="true" />
      <span class="label" aria-hidden="true">{{ $t('HOME.GESTURE_MENU') }}</span>
    </button>

    <div v-if="isOpen" class="panel">
      <section
        v-for="{ group, names } in groups"
        :key="group"
      >
        <h3>{{ $t(`HOME.GESTURE_GROUPS.${group}`) }}</h3>
        <ul>
          <li
            v-for="name in names"
            :key="name"
          >
            <button @click="pick(name)">{{ getLabel(name) }}</button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDismiss } from '@/composables/useDismiss';

defineProps({ groups: { type: Array, required: true } });
const emit = defineEmits(['play']);

const { t, te } = useI18n();
const root = ref(null);
const isOpen = ref(false);
const hasOpened = ref(false);
useDismiss(root, isOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
  hasOpened.value = true;
};

// a gesture file added without a translation still gets a readable label
const humanize = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
const getLabel = (name) => (te(`HOME.GESTURES.${name}`) ? t(`HOME.GESTURES.${name}`) : humanize(name));

const pick = (name) => {
  isOpen.value = false;
  emit('play', name);
};
</script>

<style lang="scss" scoped>
  .gesture-menu {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    z-index: 2;
  }

  .toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.8rem;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--accent) 10%, var(--secondary-background));
    color: var(--accent);
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
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

    &.is-calling::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      border: 1px solid var(--accent);
      animation: call-attention 4s ease-out infinite;
      pointer-events: none;
    }

    &.is-calling svg {
      animation: wiggle 4s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      &.is-calling::after,
      &.is-calling svg { animation: none; }
    }

    @media (max-width: 768px) {
      width: 2.25rem;
      height: 2.25rem;
      justify-content: center;
      padding: 0;

      .label { display: none; }
    }
  }

  @keyframes call-attention {
    0% { opacity: 0.35; transform: scale(1); }
    70%, 100% { opacity: 0; transform: scale(1.35, 1.6); }
  }

  @keyframes wiggle {
    0%, 60%, 100% { transform: rotate(0); }
    70% { transform: rotate(-14deg); }
    80% { transform: rotate(12deg); }
    90% { transform: rotate(-6deg); }
  }

  .panel {
    position: absolute;
    top: 2.6rem;
    left: 0;
    width: 12rem;
    max-height: min(32rem, 70vh);
    overflow-y: auto;
    scrollbar-width: thin;
    padding: 0.4rem;
    border: 1px solid var(--default-border);
    border-radius: 0.6rem;
    background-color: var(--secondary-background);
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12);

    section + section {
      margin-top: 0.35rem;
      padding-top: 0.35rem;
      border-top: 1px solid var(--default-border);
    }

    h3 {
      padding: 0.3rem 0.6rem 0.2rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--disabled-text);
    }

    ul {
      padding: 0;
      list-style: none;
    }

    button {
      width: 100%;
      padding: 0.3rem 0.6rem;
      border: none;
      border-radius: 0.4rem;
      background: none;
      color: var(--default-text);
      font-size: 0.85rem;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;

      &:hover,
      &:focus-visible {
        background-color: var(--details-background);
        color: var(--accent);
      }
    }
  }
</style>
