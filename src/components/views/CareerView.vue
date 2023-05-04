<template>
  <section id="career">
    <div class="container">
      <h1>Career</h1>

      <div class="places-container">
        <div class="buttons-container">
          <div 
            class="current-selected-marker"
            :style="{ top: `${currentPlace * 25}%` }"
          />
          <button
            v-for="(place, index) in placesTimeline"
            :key="index"
            :class="{ active: currentPlace === index }"
            @click="setPlaceAsActive(index)"
          >
            {{ place.name }}
          </button>
        </div>

        <div class="active-place-content">
          {{ placesTimeline[currentPlace].description }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from 'vue';

  const currentPlace = ref(0);

  const placesTimeline = [
    { name: 'CIMOL', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.' },
    { name: 'Unisinos', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.' },
    { name: 'Scopi', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.' },
    { name: 'Minha visita', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.' }
  ]

  const setPlaceAsActive = (index) => {
    currentPlace.value = index;
  }
</script>

<style lang="scss" scoped>
  #career {
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .places-container {
      display: flex;
      justify-content: center;
      align-items: start;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 2rem;
      

      & .buttons-container {
        display: flex;
        flex-direction: column;
        
        button {
          margin: 0;
          padding: 1rem;
          border: 0;
          border-left: 2px solid var(--disabled-text);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          color: var(--disabled-text);
          font-weight: 600;

          &:hover {
            background-color: var(--default-border);
          }

          &.active {
            background-color: var(--default-border);
            color: var(--active-text);
          }
        }

        .current-selected-marker {
          width: 3px;
          height: 25%;
          background-color: var(--details-background);
          position: absolute;
          left: 0;
          top: 0;
          transition: all 0.3s ease-in-out;
          z-index: 10;
        }
      }

      & .active-place-content {
        flex: 1;
        padding: 2rem;
      }

    }
  }
</style>