<template>
  <div class="lang-select">
    <select v-model="lang" @change="changeLang">
      <option v-for="lang in langs" :key="lang.value" :value="lang.value">
        {{ lang.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import i18n from '../i18n';

const langs = [
  {
    label: 'English',
    value: 'en'
  }, 
  {
    label: 'Português',
    value: 'pt'
  }
];
const lang = ref(i18n.global.locale)

watch(lang, (newLang) => {
  i18n.global.locale = newLang;
})

</script>

<style lang="scss" scoped>
.lang-select {
  select {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 1rem;
    font-family: inherit;
    cursor: pointer;
    outline: none;
  }
}
</style>