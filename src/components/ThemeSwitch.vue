<template>
  <label class="switch">
    <input type="checkbox" @change="changeTheme">
    <span class="slider">
      <div class="slider-circle">
        <font-awesome-icon 
          v-if="isDarkTheme"
          icon="fa-solid fa-moon"
          class="moon"
        />
        <font-awesome-icon 
          v-else
          icon="fa-solid fa-sun"
          class="sun"
        />
      </div>
    </span>
  </label>
</template>

<script setup>
  import { ref } from 'vue'

  const deviceDefaultIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkTheme = ref(deviceDefaultIsDark);
  if (isDarkTheme.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const changeTheme = () => {
    isDarkTheme.value = !isDarkTheme.value;
    const newTheme = isDarkTheme.value ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
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

      &:checked + .slider {
        .slider-circle {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
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

      & .slider-circle {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: var(--details-background);
        border-radius: 50%;
        box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);
        transition: .4s;
        -webkit-transition: .4s;

        svg {
          font-size: 16px;
          padding: 5px;
        }

        .sun {
          color: #f39d12;
        }

        .moon {
          color: #f4ca25;
        }
      }
    }
  }
</style>