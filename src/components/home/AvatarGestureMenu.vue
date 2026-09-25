<template>
  <div
    ref="root"
    class="gesture-menu"
    data-avatar-ignore
  >
    <button
      class="toggle"
      :aria-label="$t('HOME.GESTURE_MENU')"
      :title="$t('HOME.GESTURE_MENU')"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <font-awesome-icon icon="fas fa-wand-magic-sparkles" aria-hidden="true" />
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
useDismiss(root, isOpen);

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

  // stays faint until the avatar is hovered, so it doesn't compete with the hero
  .toggle {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 50%;
    background: none;
    color: var(--disabled-text);
    font-size: 0.85rem;
    opacity: 0.35;
    cursor: pointer;
    transition: opacity 0.25s ease, color 0.25s ease;

    :global(.my-avatar:hover) &,
    &:focus-visible,
    &[aria-expanded="true"] {
      opacity: 1;
    }

    &:hover,
    &[aria-expanded="true"] {
      color: var(--accent);
    }
  }

  .panel {
    position: absolute;
    top: 2.5rem;
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
