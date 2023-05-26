<template>
  <div class="lang-select" v-if="false">
    <select v-model="lang" @change="changeLang">
      <option v-for="lang in langs" :key="lang.value" :value="lang.value">
        {{ lang.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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
  console.log(this.$i18n);
})

</script>