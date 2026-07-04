<template>
  <p class="roles">
    <span
      v-for="(role, index) in roles"
      :key="role"
    >
      <span class="role">{{ role }}</span>
      <span
        v-if="index < roles.length - 1"
        class="sep"
        aria-hidden="true"
      >·</span>
    </span>
    <span class="cursor" aria-hidden="true"></span>
  </p>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();

const roles = computed(() => [
  $t('HOME.TITLE_1'),
  $t('HOME.TITLE_2'),
  $t('HOME.TITLE_3'),
  $t('HOME.TITLE_4'),
  $t('HOME.TITLE_5'),
].map((role) => role.replace(/\.$/, '')));
</script>

<style lang="scss" scoped>
  .roles {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    row-gap: 0.5rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.95rem;
    color: var(--secondary-text);
    margin: 0;

    > span { display: inline-flex; align-items: center; }

    .role {
      white-space: nowrap;
    }

    .sep {
      color: var(--accent);
      font-weight: 700;
      margin: 0 0.6rem;
    }

    .cursor {
      display: inline-block;
      width: 0.5rem;
      height: 1rem;
      margin-left: 0.4rem;
      transform: translateY(1px);
      background-color: var(--accent);
      animation: cursorBlink 1.1s step-end infinite;
    }
  }

  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .roles .cursor { animation: none; }
  }

  @media (max-width: 768px) {
    .roles {
      font-size: 0.8rem;
      line-height: 2.1;

      .sep { margin: 0 0.4rem; }
    }
  }
</style>
