<template>
  <section id="career">
    <div class="container">
      <h2>{{ $t('CAREER.TITLE') }}</h2>

      <div class="places-container">
        <div class="buttons-container">
          <div 
            class="current-selected-marker"
            :style="selectedMarkerStyle"
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

            <ul class="description">
              <li 
                v-for="i in currentPlace.paragraphsQtt"
                :key="i"
              >
                {{ $t(`CAREER.${currentPlace.key}.RESUME_${i}`) }}
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { gsap } from 'gsap';

  import { ref, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t: $t } = useI18n();

  const currentPlaceIndex = ref(0);
  const currentPlace = computed(() => (placesTimeline[currentPlaceIndex.value] || {}));

  const selectedMarkerStyle = computed(() => {
    // If is mobile
    if (window.innerWidth <= 768) {
      return {
        left: `${currentPlaceIndex.value * 25}%`,
      };
    }

    return {
      top: `${currentPlaceIndex.value * 25}%`,
    };
  });

  const placesTimeline = [
    { 
      name: 'CIMOL',
      key: 'CIMOL',
      paragraphsQtt: 3,
      role: 'Student',
      period: 'from 2018 to 2020',
      link: 'https://www.cimol.g12.br/',
   },
    { 
      name: 'Unisinos',
      key: 'UNISINOS',
      paragraphsQtt: 2,
      role: 'Student',
      period: 'from 2021 until now',
      link: 'https://www.unisinos.br/',
    },
    { 
      name: 'Scopi',
      key: 'SCOPI',
      paragraphsQtt: 3,
      role: 'Trainee',
      period: 'from January 2021 to October 2021',
      link: 'https://www.scopi.com.br/',
    },
    { 
      name: 'Minha visita',
      key: 'MINHA_VISITA',
      paragraphsQtt: 3,
      role: 'Fullstack Mid Developer',
      period: 'from October 2021 until now',
      link: 'https://www.minhavisita.app/',
    }
  ]

  const setPlaceAsActive = (index) => {
    currentPlaceIndex.value = index;
  }

  const addObserverOnScroll = () => {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateElement();
          self.unobserve(entry.target);
        }
      });
    });

    const target = document.querySelector('#career .container');
    observer.observe(target)

    function animateElement() {
      const tl = gsap.timeline();

      const title = document.querySelector('#career h2');
      const placesButtons = document.querySelectorAll('.buttons-container > *');
      const placeInfos = document.querySelectorAll('.active-place-content > *');

      gsap.fromTo(
        title, 
        { opacity: 0, y: 50, filter: 'blur(2px)', transition: 'none' }, 
        { opacity: 1, y: 0, duration: .5, filter: 'blur(0px)', ease: 'back.out(1.4)' }
      );

      tl.fromTo(
        placesButtons, 
        { opacity: 0, x: -50, filter: 'blur(2px)', transition: 'none' }, 
        { opacity: 1, x: 0, duration: .5, filter: 'blur(0px)', stagger: .1 }
      );

      gsap.fromTo(
        placeInfos,
        { opacity: 0, y: 20, transition: 'none' }, 
        { opacity: 1, y: 0, duration: .5, stagger: .1 }
      );
    }
  };

  onMounted(addObserverOnScroll);
</script>

<style lang="scss" scoped>
  #career {
    min-height: 90vh;
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
      width: 50px;
      height: 1px;
      margin-right: 20px;
      background-color: var(--default-border);
    }

      &::after {
        content: '';
        display: block;
        position: relative;
        width: 100%;
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
          color: var(--default-text);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0 .5rem .5rem 0;

          &:hover {
            background-color: var(--default-border);
          }

          &.active {
            background-color: var(--default-border) !important;
            color: var(--highlight);
          }
        }

        .current-selected-marker {
          width: 3px;
          height: 25%;
          background-color: var(--highlight);
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
        height: 350px;

        & .title {
          font-size: 1.5rem;
          font-weight: 600;
          
          & .place-name {
            color: var(--default-text);
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease-in-out;

            &::after {
              content: '';
              position: absolute;
              width: 100%;
              transform: scaleX(0);
              height: 3px;
              bottom: 0px;
              left: 0;
              background: var(--default-text);
              transform-origin: bottom right;
              transition: transform 0.25s ease-out;
            }

            &:hover::after {
              transform: scaleX(1);
              transform-origin: bottom left;
            }
          }
        }

        & .period {
          font-size: 1rem;
          color: var(--default-text);
          margin-bottom: 1rem;
        }

        & .description {
          font-size: 1rem;
          color: var(--default-text);
          line-height: 1.5rem;
          text-align: justify;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style-type: circle;
        }
      }
    }
  }

  @media (max-width: 768px) {
    #career {
      .places-container {
        display: flex;
        flex-direction: column;

        & .buttons-container {
          flex-direction: row;
          width: 100%;

          button {
            width: 25%;
            border: none;
            border-top: 1px solid var(--default-border);
            padding: 0.5rem 0.25rem;
            border-radius: 0 0 .5rem .5rem;
          }
        }

        & .current-selected-marker {
          height: 3px !important;
          width: 25% !important;
        }

        & .active-place-content {
          padding: 0 !important;

          .title, .period {
            text-align: center;
          }	
        }

        ul {
          padding: .5rem;
        }
      }
    }
  }
</style>