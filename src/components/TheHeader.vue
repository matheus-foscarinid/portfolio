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
        <div 
          class="menu-item"
          :class="{ active: currentActiveSection === section.id }"
        >
          <a :href="`#${section.id}`">
            <span>{{ section.label }}</span>
          </a>
        </div>
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
      <button type="button" aria-label="Open menu" @click="openMobileMenu">
        <font-awesome-icon icon="fas fa-bars" aria-hidden="true" />
      </button>
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
          <button type="button" class="close-icon" aria-label="Close menu" @click="closeMobileMenu">
            <font-awesome-icon icon="fas fa-close" aria-hidden="true" />
          </button>
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
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n';
  import ThemeSwitch from './ThemeSwitch.vue';
  import LangSelect from './LangSelect.vue';

  const { t: $t } = useI18n();

  const sectionOptions = [
    { id: 'home', label: $t('HEADER.HOME') },
    { id: 'career', label: $t('HEADER.CAREER') },
    { id: 'projects', label: $t('HEADER.PROJECTS') },
    { id: 'about', label: $t('HEADER.ABOUT') },
    { id: 'contact', label: $t('HEADER.CONTACT') },
  ];
  
  const isMenuOpen = ref(false);

  const openMobileMenu = () => {
    isMenuOpen.value = true;
    document.body.classList.add('no-scroll');
  }

  const closeMobileMenu = () => {
    isMenuOpen.value = false;
    document.body.classList.remove('no-scroll');
  }

  const hasScrolled = ref(false);
  const currentActiveSection = ref(null);

  const watchCurrentActiveSection = () => {
    const sections = Array.from(document.querySelectorAll('section'));
    const viewportMiddle = window.innerHeight / 2;

    const currentShowedSection = sections.find((section) => {
      const rectangle = section.getBoundingClientRect();
      return rectangle.top <= viewportMiddle && rectangle.bottom >= viewportMiddle;
    });

    if (currentShowedSection) currentActiveSection.value = currentShowedSection.id;
  }

  // coalesce scroll work into one rAF so the geometry reads happen once per
  // frame (batched, before paint) instead of synchronously on every scroll
  // event, which was forcing a reflow per section per event
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      hasScrolled.value = window.scrollY > 0;
      watchCurrentActiveSection();
      ticking = false;
    });
  };

  onMounted(() => {
    watchCurrentActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    document.body.classList.remove('no-scroll');
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
    // don't transition backdrop-filter: animating the blur is expensive
    transition: background-color .5s ease, box-shadow .5s ease, color .5s ease;

    &.scrolled {
      background-color: color-mix(in srgb, var(--secondary-background) 82%, transparent);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 var(--default-border);
      color: var(--default-text);
    }

    h2 {
      font-weight: 700;
      .dev {
        color: var(--accent);
      }
    }
    .menu {
      display: flex;
      justify-content: space-between;
      text-decoration: none;
      list-style: none;

      & .menu-item {
        height: 5rem;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        position: relative;
        transition: all .2s ease;

        a {
          text-decoration: none;
          font-weight: 700;
          color: var(--text-default);
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 1.4rem;
          left: 1rem;
          right: 1rem;
          height: 2px;
          background-color: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s ease;
        }

        &.active::after,
        &:hover::after {
          transform: scaleX(1);
        }
      }

    }

    .mobile-menu-icon {
      display: none;

      button {
        padding: 0;
        border: none;
        background: none;
        color: inherit;
        font-size: inherit;
        line-height: 0;
        cursor: pointer;
      }
    }

    .close-icon {
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      font-size: inherit;
      line-height: 0;
      cursor: pointer;
    }

    .mobile-menu {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(80vw, 22rem);
      height: 100dvh;
      padding-top: env(safe-area-inset-top);
      padding-right: env(safe-area-inset-right);
      padding-bottom: env(safe-area-inset-bottom);
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
        padding: 1rem 2rem;
        gap: 0.25rem;

        a {
          display: block;
          padding: 0.75rem 0;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: -0.01em;
          color: var(--default-text);

          &:active { color: var(--accent); }
        }
      }

      & .mobile-theme-switch {
        position: absolute;
        bottom: calc(2rem + env(safe-area-inset-bottom));
        left: 2rem;
      }

      & .mobile-lang-select {
        position: absolute;
        bottom: calc(2rem + env(safe-area-inset-bottom));
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
      height: calc(4.5rem + env(safe-area-inset-top));
      padding-top: env(safe-area-inset-top);
      padding-left: max(1.2rem, env(safe-area-inset-left));
      padding-right: max(1.2rem, env(safe-area-inset-right));

      // blurring behind a sticky header repaints every scroll frame, which is
      // the main source of dropped frames on mobile. use a near-solid bg instead
      &.scrolled {
        backdrop-filter: none;
        background-color: color-mix(in srgb, var(--secondary-background) 96%, transparent);
      }

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

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
        }
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
    height: 100dvh;
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