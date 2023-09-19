<template>
  <header :class="{ scrolled: hasScrolled }">
    <div class="logo">
      <h2>matheusdias<span class="dev">.dev</span></h2>
    </div>

    <ul class="menu">
      <li
        v-for="section in sectionOptions"
        :key="section.id"
      >
        <a 
          :href="`#${section.id}`" 
          :class="{ active: currentActiveSection === section.id }"
        >
          {{ section.label }}
        </a>
      </li>
    </ul>

    <div class="buttons-container">
      <div class="desktop-theme-switch">
        <ThemeSwitch />
      </div>
      <div class="desktop-lang-select">
        <LangSelect />
      </div>
    </div>

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

        <ul 
          class="mobile-menu-items"
          @click="closeMobileMenu"
        >
        <li
          v-for="section in sectionOptions"
          :key="section.id"
        >
          <a :href="`#${section.id}`">
            {{ section.label }}
          </a>
        </li>
        </ul>

        <ThemeSwitch class="mobile-theme-switch" />
        <LangSelect class="mobile-lang-select"/>
      </div>
    </Transition>

    <Transition 
      name="fade"
      mode="out-in"
    >
      <div 
        v-if="isMenuOpen"
        class="defocus"
        @click="closeMobileMenu"
      />
    </Transition>
  </header>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n';
  import ThemeSwitch from './ThemeSwitch.vue';
  import LangSelect from './LangSelect.vue';

  const { t: $t } = useI18n();

  const sectionOptions = [
    { id: 'home', label: $t('HEADER.HOME') },
    { id: 'about', label: $t('HEADER.ABOUT') },
    { id: 'career', label: $t('HEADER.CAREER') },
    { id: 'projects', label: $t('HEADER.PROJECTS') },
    { id: 'contact', label: $t('HEADER.CONTACT') },
  ];
  
  const isMenuOpen = ref(false);

  const openMobileMenu = () => {
    isMenuOpen.value = true;
  }

  const closeMobileMenu = () => {
    isMenuOpen.value = false;
  }

  const hasScrolled = ref(false);
  const currentActiveSection = ref(null);

  const watchCurrentActiveSection = (sections) => {
    const currentShowedSection = sections.find((section) => {
      const rectangle = section.getBoundingClientRect();
      return rectangle.top <= window.innerHeight / 2 && rectangle.bottom >= window.innerHeight / 2;
    });

    currentActiveSection.value = currentShowedSection.id;
  }

  onMounted(() => {
    const sectionsNodeList = document.querySelectorAll('section');
    const sections = Array.from(sectionsNodeList);

    window.addEventListener('scroll', () => {
      hasScrolled.value = window.scrollY > 0;
      watchCurrentActiveSection(sections);
    });
  });
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
    transition: all .3s ease;
    

    &.scrolled {
      background-color: var(--secondary-background);
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);
      color: var(--default-text);
    }

    h2 {
      font-weight: 700;

      .dev {
        color: var(--secondary-text);
      }
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

        &.active {
          // add underline to active section with animation
          position: relative;
          &::after {
            content: '';
            position: absolute;
            bottom: 1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--secondary-text);
            animation: underline .35s ease-in-out;
          }
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
      width: 65vw;
      height: 100vh;
      background-color: var(--secondary-background);
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      flex-direction: column;

      & .mobile-menu-items {
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem;
        text-align: center;
        gap: 1rem;

        a {
          text-decoration: none;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--text-default);

          &:hover {
            color: var(--secondary-text);
          }
        }
      }

      & .mobile-theme-switch {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
      }

      & .mobile-lang-select {
        position: absolute;
        bottom: 5rem;
        right: 2rem;
      }
    }

    .buttons-container {
      display: flex;
      gap: 1rem;
      align-items: center;
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

      .desktop-theme-switch, .desktop-lang-select {
        display: none;
      }
    }
  }

  .defocus {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.2);
    overscroll-behavior: contain;
    overflow: hidden;
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

  // underline animation from left to right
  @keyframes underline {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
</style>