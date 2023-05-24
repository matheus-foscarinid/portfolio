<template>
  <label class="switch">
    <input type="checkbox" @change="changeTheme">
    <span class="slider"></span>
  </label>
</template>

<script setup>
  import { ref } from 'vue'

  const isDarkTheme = ref(false);

  const changeTheme = () => {
    isDarkTheme.value = !isDarkTheme.value;

    if (isDarkTheme.value) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
</script>

<style lang="scss" scoped>
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--default-border);
      box-shadow: inset 0 0 3px 3px rgba(0, 0, 0, 0.05);
      -webkit-transition: .4s;
      border-radius: 34px;
      transition: .4s;

      &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        border-radius: 50%;
        box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);
        transition: .4s;
      }
    }
  }
</style>