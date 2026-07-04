<template>
  <TheHeader />

  <main>
    <HomeView />
    <AboutView />
    <CareerView />
    <ProjectsView />
    <ContactView />
  </main>

  <TheFooter />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';
import HomeView from './components/views/HomeView.vue';

const AboutView = defineAsyncComponent(() => import('./components/views/AboutView.vue'));
const CareerView = defineAsyncComponent(() => import('./components/views/CareerView.vue'));
const ProjectsView = defineAsyncComponent(() => import('./components/views/ProjectsView.vue'));
const ContactView = defineAsyncComponent(() => import('./components/views/ContactView.vue'));

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

