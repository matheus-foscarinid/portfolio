<template>
  <header>
    <div class="logo">
      <h2>Matheus.dev</h2>
    </div>

    <ul class="menu">
      <li><a href="#about">About</a></li>
      <li><a href="#career">Career</a></li>
      <!-- <li><a href="#projects">Projects</a></li> -->
      <li><a href="#contact">Contact</a></li>
    </ul>

    <div class="mobile-menu-icon">
      <font-awesome-icon 
        icon="fas fa-bars"
        @click="openMobileMenu"
      />
    </div>
    
    <Transition 
        name="slide-in"
        mode="out-in"
      >
      <div 
        v-if="isMenuOpen"
        class="mobile-menu"
      >
        <div class="top-container">
          <font-awesome-icon
            class="close-icon"
            icon="fas fa-close"
            @click="closeMobileMenu"
          />
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
  import { ref } from 'vue'
  const isMenuOpen = ref(false);

  const openMobileMenu = () => {
    console.log('open');
    isMenuOpen.value = true;
  }

  const closeMobileMenu = () => {
    console.log('close');
    isMenuOpen.value = false;
  }
</script>

<style lang="scss" scoped>
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 5rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: var(--secondary-background);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);

    h2 {
      font-weight: 700;
    }
    .menu {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
      text-decoration: none;
      list-style: none;

      a {
        text-decoration: none;
        font-weight: 700;
        color: var(--text-default);

        &:hover {
          color: var(--secondary-text);
        }
      }
    }

    .mobile-menu-icon {
      display: none;
    }

    .mobile-menu {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 60vw;
      height: 100vh;
      background-color: var(--secondary-background);
      z-index: 1;
      display: flex;
      flex-direction: column;
    }
  }

  @media (max-width: 768px) {
    header {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .menu {
        display: none;
      }

      .top-container {
        display: flex;
        justify-content: flex-end;
      }

      .mobile-menu-icon {
        display: block;
        font-size: 1.5rem;
      }

      .close-icon {
        display: block;
        font-size: 1.8rem;
        padding: 26px 32px;
      }
    }
  }

  /* slide transition */
  .slide-in-enter-active,
  .slide-in-leave-active {
    transition: all 0.3s ease;
  }

  .slide-in-enter-from,
  .slide-in-leave-to {
    transform: translateX(100%);
  }

  .slide-in-enter-to,
  .slide-in-leave-from {
    transform: translateX(0);
  }
</style>