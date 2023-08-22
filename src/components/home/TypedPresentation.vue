<template>
  <h3>
    I'm a <span class="typed-text">{{ typedValue }}</span>
    <span class="cursor" :class="{'typing': isTyping}">|</span>
  </h3>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();

const typedValue = ref('');
const isTyping = ref(false);
const titlesArray = computed(() =>[$t('HOME.TITLE_1'), $t('HOME.TITLE_2'), $t('HOME.TITLE_3'), $t('HOME.TITLE_4')]);

const TYPING_SPEED = 30;
const ERASING_SPEED = 30;
const NEW_TEXT_DELAY = 3500;

let titlesArrayIndex = 0;
let charIndex = 0;

const typeText = () => {
  const currentWord = titlesArray.value[titlesArrayIndex];

  if(charIndex < currentWord.length) {
    if(!isTyping.value) isTyping.value = true;

    typedValue.value += currentWord.charAt(charIndex);
    charIndex += 1;

    setTimeout(typeText, TYPING_SPEED);
  } else {
    isTyping.value = false;
    setTimeout(eraseText, NEW_TEXT_DELAY);
  }
};

const eraseText = () => {
  if(charIndex > 0) {
    if(!isTyping.value) isTyping.value = true;

    typedValue.value = titlesArray.value[titlesArrayIndex].substring(0, charIndex - 1);
    charIndex -= 1;
    setTimeout(eraseText, ERASING_SPEED);
  } else {
    isTyping.value = false;
    titlesArrayIndex += 1;
    if(titlesArrayIndex >= titlesArray.value.length) titlesArrayIndex = 0;

    setTimeout(typeText, TYPING_SPEED);
  }
}

onMounted(() => setTimeout(typeText, 1000));
</script>

<style lang="scss" scoped>
  h3 {
    color: var(--secondary-text);
    font-size: 2.5rem;
    margin: 0;

    & .typed-text {
      font-weight: 700;
    }
    & .cursor {
      content: "&nbsp;";
      display: inline-block;
      margin-left: 1px;
      animation: cursorBlink 1s infinite;

      &.typing {
        animation: none;
      }
    }
  }

  @keyframes cursorBlink {
    49% { opacity: 1; }
    50% { opacity: 0; }
    99% { opacity: 0; }
  }
</style>