<template>
  <TheHeader />

  <main>
    <HomeView />
    <AboutView />
    <CareerView />
    <ProjectsView />
    <ContactView />
    <LighthouseScores />
  </main>

  <TheFooter />
</template>

<script setup>
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';
import HomeView from './components/views/HomeView.vue';
import AboutView from './components/views/AboutView.vue';
import CareerView from './components/views/CareerView.vue';
import ProjectsView from './components/views/ProjectsView.vue';
import ContactView from './components/views/ContactView.vue';
import LighthouseScores from './components/LighthouseScores.vue';

</script>

<style lang="scss" scoped>
  main {
    display: block;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-color: var(--default-background);
    color: var(--text-default);
    scroll-behavior: smooth;
  }
</style>

