<template>
  <span
    class="company-mark"
    :style="{ '--mark': `url('/icons/companies/${name}.svg')` }"
  />
</template>

<script setup>
  defineProps({
    name: { type: String, required: true },
  });
</script>

<style lang="scss" scoped>
  // each logo is traced to single-color paths and painted through a mask, so it
  // takes the theme's color and stays out of the JS bundle
  .company-mark {
    display: inline-block;
    background-color: currentColor;
    mask-image: var(--mark);
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    -webkit-mask-image: var(--mark);
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
  }
</style>
