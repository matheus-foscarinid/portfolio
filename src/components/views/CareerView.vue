<template>
  <section id="career">
    <div class="container appear-on-scroll">
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
  import { ref, computed } from 'vue';
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
        height: 350px;

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
      }
    }
  }
</style>