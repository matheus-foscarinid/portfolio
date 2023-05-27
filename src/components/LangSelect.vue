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
const lang = ref('pt')

watch(lang, (newLang) => {
  i18n.global.locale = newLang;
})

</script>