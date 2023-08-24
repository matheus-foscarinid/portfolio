<template>
  <div 
    class="lang-select" 
    tabindex="0"
    @blur="isDropdownOpen = false"
  >
    <div 
      class="selected-option"
      :class="{ 'active': isDropdownOpen }"
      @click="toggleDropdown"
    >
      <img :src="selectedLang.img" alt="lang" />
      {{ selectedLang.label }}

      <font-awesome-icon 
        icon="fas fa-caret-down"
        class="arrow"
        :class="{ rotated: isDropdownOpen }"
      />
    </div>

    <Transition 
      name="fade"
      mode="out-in"
    >
      <div
        v-if="isDropdownOpen"
        class="options"
      >
        <div v-for="lang in langs" :key="lang.value" @click="selectLang(lang.value)">
          <img :src="lang.img" alt="lang" />
          {{ lang.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import i18n from '../i18n';

import ptFlagImg from '@/assets/images/pt.png';
import enFlagImg from '@/assets/images/en.png';

const isDropdownOpen = ref(false);
const lang = ref(i18n.global.locale)

const selectedLang = computed(() => {
  return langs.find(({ value }) => value === lang.value);
});

const langs = [
  {
    label: 'English',
    value: 'en',
    img: enFlagImg
  }, 
  {
    label: 'Português',
    value: 'pt',
    img: ptFlagImg
  }
];

const selectLang = (newLang) => {
  console.log(newLang);
  lang.value = newLang;
  i18n.global.locale = newLang;
  isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<style lang="scss" scoped>
  .lang-select {
    position: relative;
    cursor: pointer;
  }

  img {
    width: 1.2rem;
    height: 1.2rem;
  }

  .selected-option {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--details-background);
    color: var(--default-text);
    font-size: 1rem;
    font-family: inherit;
    outline: none;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);
    gap: .5rem;
    transition: box-shadow 0.2s ease-in-out;

    &.active {
      border-radius: 0.5rem 0.5rem 0 0;
    }

    &:hover {
      box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.07);
    }
  }

  .arrow {
    align-self: center;
    font-size: 0.8rem;
    transition: transform 0.2s ease-in-out;

    &.rotated {
      transform: rotate(180deg);
    }
  }


  .options {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    overflow-y: auto;
    background-color: var(--details-background);
    border-radius: 0 0 .5rem .5rem;
    border-top: 1px solid var(--default-border);

    & > div {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;

      &:hover {
        background-color: var(--secondary-background);
      }
    }
  }
</style>