<template>
  <div class="container">
    <h1>I'm a
      <span class="typed-text">{{ typeValue }}</span>
      <span class="cursor" :class="{'typing': typeStatus}">&nbsp;</span>
    </h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const typeValue = ref('');
const typeStatus = ref(false);

const typeArray = ['developer', 'designer', 'animals lover', 'teacher'];

// constants
const TYPING_SPEED = 200;
const ERASING_SPEED = 100;
const NEW_TEXT_DELAY = 2000;

// Indexes
const typeArrayIndex = 0;
const charIndex = 0;

</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 6rem;
    font-weight: normal;

    span.typed-text {
      color: #D2B94B;
    }

    span.cursor {
      display: inline-block;
      margin-left: 3px;
      width: 4px;
      background-color: #fff;
      animation: cursorBlink 1s infinite;
    }

    span.cursor.typing {
      animation: none;
    }
  }

  @keyframes cursorBlink {
    49% { background-color: #fff; }
    50% { background-color: transparent; }
    99% { background-color: transparent; }
  }
</style>