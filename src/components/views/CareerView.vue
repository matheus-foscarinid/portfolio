<template>
  <section id="career">
    <div class="container">
      <h2>Career</h2>

      <div class="places-container">
        <div class="buttons-container">
          <div 
            class="current-selected-marker"
            :style="{ top: `${currentPlaceIndex * 25}%` }"
          />
          <button
            v-for="(place, index) in placesTimeline"
            :key="index"
            :class="{ active: currentPlaceIndex === index }"
            @click="setPlaceAsActive(index)"
          >
            {{ place.name }}
          </button>
        </div>

        <Transition 
          name="fade"
          mode="out-in"
        >
          <div 
            class="active-place-content"
            :key="currentPlaceIndex"
          >
            <div class="title">
              <span>{{ currentPlace.role }} at </span>
              <a 
                class="place-name"
                :href="currentPlace.link"
                target="_blank"
              >
                {{ currentPlace.name }}
              </a>
            </div>

            <div class="period">
              {{ currentPlace.period }}
            </div>

            <div class="description">
              {{ currentPlace.description }}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, computed } from 'vue';

  const currentPlaceIndex = ref(0);
  const currentPlace = computed(() => (placesTimeline[currentPlaceIndex.value] || {}));

  const placesTimeline = [
    { 
      name: 'CIMOL', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.',
      role: 'Student',
      period: 'from 2018 to 2020',
      link: 'https://www.cimol.g12.br/',
   },
    { 
      name: 'Unisinos', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.',
      role: 'Student',
      period: 'from 2021 until now',
      link: 'https://www.unisinos.br/',
    },
    { 
      name: 'Scopi', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.',
      role: 'Trainee',
      period: 'from January 2021 to October 2021',
      link: 'https://www.scopi.com.br/',
    },
    { 
      name: 'Minha visita', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc magna, porta id cursus quis, molestie in leo. Nam condimentum, velit non dapibus molestie, libero nisl imperdiet ipsum, eget interdum est ligula at enim. Proin ac tristique metus, nec porttitor justo. Cras scelerisque risus turpis, sed aliquet risus aliquam vitae. Etiam ac dictum ex. Sed mattis pharetra malesuada. Cras bibendum dolor id consectetur facilisis. Quisque feugiat est a facilisis maximus. Duis vel venenatis quam, in auctor nisl. Phasellus sit amet nunc id lorem molestie bibendum. Donec sit amet eleifend metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent egestas dictum dui, sit amet accumsan leo elementum quis. Aenean consectetur ultricies aliquam. Pellentesque eget maximus lorem, sit amet sollicitudin dui. Nullam tempor sem vitae nibh malesuada, id pellentesque eros iaculis.',
      role: 'Fullstack Mid Developer',
      period: 'from October 2021 until now',
      link: 'https://www.minhavisita.app/',
    }
  ]

  const setPlaceAsActive = (index) => {
    currentPlaceIndex.value = index;
  }
</script>

<style lang="scss" scoped>
  #career {
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;

    h2 {
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--secondary-text);

      &::before {
      content: '';
      display: block;
      position: relative;
      width: 15%;
      height: 1px;
      margin-right: 20px;
      background-color: var(--default-border);
    }

      &::after {
        content: '';
        display: block;
        position: relative;
        width: 85%;
        height: 1px;
        margin-left: 20px;
        background-color: var(--default-border);
      }
    }

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
          margin-left: 1px;
          padding: 1rem;
          border: 0;
          border-left: 1px solid var(--default-border);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          color: var(--disabled-text);
          font-size: 1rem;
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
        display: flex;
        flex-direction: column;
        padding: 0 2rem;

        & .title {
          font-size: 1.5rem;
          font-weight: 600;
          
          & .place-name {
            color: var(--secondary-text);
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease-in-out;
          }
        }

        & .period {
          font-size: 1rem;
          color: var(--secondary-text);
          margin-bottom: 1rem;
        }

        & .description {
          font-size: 1rem;
          color: var(--secondary-text);
          line-height: 1.5rem;
          text-align: justify;
          max-width: 800px;
        }
      }
    }
  }
</style>