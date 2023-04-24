<template>
  <section id="career">
    <div class="container">
      <h1>Career</h1>

      <div class="places-container">
        <button
          v-for="(place, index) in placesTimeline"
          :key="index"
        >
          {{ place.name }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
  const placesTimeline = [
    { name: 'CIMOL', description: '' },
    { name: 'Unisinos', description: '' },
    { name: 'Scopi', description: '' },
    { name: 'Minha visita', description: '' }
  ]
</script>

<style lang="scss" scoped>
  #career {
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .places-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: wrap;
      max-width: 300px;

      button {
        margin: 0 10px 10px 0;
        padding: 10px 20px;
        border: 1px solid #000;
        border-radius: 5px;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }
    }
  }
</style>