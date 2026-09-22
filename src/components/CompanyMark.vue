<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-if="name === 'cimol'">
      <path d="M12 3 4.5 5.8v5.4c0 4.2 3 7.4 7.5 8.9 4.5-1.5 7.5-4.7 7.5-8.9V5.8L12 3Z" />
      <circle cx="12" cy="11" r="1" />
      <ellipse cx="12" cy="11" rx="5.4" ry="2" transform="rotate(-30 12 11)" />
      <ellipse cx="12" cy="11" rx="5.4" ry="2" transform="rotate(30 12 11)" />
    </template>

    <template v-else-if="name === 'unisinos'">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <path d="M9 8.25v4.5a3 3 0 0 0 6 0v-4.5" />
    </template>

    <template v-else-if="name === 'scopi'">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </template>

    <template v-else-if="name === 'minhavisita'">
      <path d="M6 21V3.8" />
      <path d="M6 3.8h11.5l-2.6 3.9 2.6 3.9H6" />
    </template>

    <template v-else-if="name === 'fullstack'">
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </template>

    <template v-else-if="name === 'hipeople'">
      <circle cx="9.5" cy="8.5" r="3" />
      <path d="M4 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.8" />
      <path d="M17 14.6a5.5 5.5 0 0 1 3 4.9" />
    </template>
  </svg>
</template>

<script setup>
  defineProps({
    name: { type: String, required: true },
  });
</script>
