<template>
  <section id="career">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('CAREER.TITLE') }}</h2>
      </header>

      <div class="places-container">
        <div class="buttons-container">
          <div class="current-selected-marker" :style="selectedMarkerStyle" />
          <button
            v-for="(place, index) in placesTimeline"
            :key="index"
            :class="{ active: currentPlaceIndex === index }"
            @click="setPlaceAsActive(index)"
          >
            {{ place.name }}
          </button>
        </div>

        <Transition name="fade" mode="out-in">
          <div class="active-place-content" :key="currentPlaceIndex">
            <div class="title">
              <span>{{ currentPlace.role }} at </span>
              <a class="place-name" :href="currentPlace.link" target="_blank">
                {{ currentPlace.name }}
              </a>
            </div>

            <div class="period">
              {{ currentPlace.period }}
            </div>

            <ul class="description">
              <li v-for="i in currentPlace.paragraphsQtt" :key="i">
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { reveal, onReveal, EASE } from '@/composables/useReveal'

const { t: $t } = useI18n()

const placesTimeline = [
  {
    name: 'ETEC Monteiro Lobato',
    key: 'CIMOL',
    paragraphsQtt: 3,
    role: 'Student',
    period: 'from 2018 to 2020',
    link: 'https://www.cimol.g12.br/'
  },
  {
    name: 'Unisinos',
    key: 'UNISINOS',
    paragraphsQtt: 2,
    role: 'Student',
    period: 'from 2021 to 2025',
    link: 'https://www.unisinos.br/'
  },
  {
    name: 'Scopi',
    key: 'SCOPI',
    paragraphsQtt: 3,
    role: 'Trainee',
    period: 'from January 2021 to October 2021',
    link: 'https://www.scopi.com.br/'
  },
  {
    name: 'Minha visita',
    key: 'MINHA_VISITA',
    paragraphsQtt: 3,
    role: 'Full-stack Software Engineer',
    period: 'from October 2021 to November 2024',
    link: 'https://www.minhavisita.app/'
  },
  {
    name: 'Fullstack Labs',
    key: 'FULLSTACK_LABS',
    paragraphsQtt: 3,
    role: 'Mid-level Software Engineer',
    period: 'from November 2024 to July 2025',
    link: 'https://www.fullstack.com/'
  },
  {
    name: 'HiPeople',
    key: 'HIPEOPLE',
    paragraphsQtt: 4,
    role: 'Software Engineer',
    period: 'from July 2025 to present',
    link: 'https://www.hipeople.io/'
  }
]

const currentPlaceIndex = ref(placesTimeline.length - 1)

const currentPlace = computed(() => placesTimeline[currentPlaceIndex.value] || {})

const selectedMarkerStyle = computed(() => ({
  top: `${currentPlaceIndex.value * (100 / placesTimeline.length)}%`
}))

const setPlaceAsActive = (index) => {
  currentPlaceIndex.value = index
}

const animateElement = () => {
  const heading = document.querySelectorAll('#career .section-heading > *')
  const placesButtons = document.querySelectorAll('.buttons-container > *')
  const placeInfos = document.querySelectorAll('.active-place-content > *')

  reveal(
    heading,
    { opacity: 0, y: 50, blur: 2 },
    { opacity: 1, y: 0, blur: 0 },
    { duration: 500, stagger: 80, easing: EASE.outBack }
  )

  reveal(
    placesButtons,
    { opacity: 0, x: -50, blur: 2 },
    { opacity: 1, x: 0, blur: 0 },
    { duration: 500, stagger: 100 }
  )

  reveal(
    placeInfos,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0 },
    { duration: 500, stagger: 100 }
  )
}

onMounted(() => {
  onReveal('#career .container', animateElement)

  const activeChip = document.querySelector('#career .buttons-container button.active')
  if (activeChip) activeChip.scrollIntoView({ block: 'nearest', inline: 'center' })
})
</script>

<style lang="scss" scoped>
#career {
  min-height: 90vh;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .section-heading {
    margin-bottom: 2.5rem;

    .marker {
      display: block;
      width: 2.5rem;
      height: 3px;
      background-color: var(--accent);
      margin-bottom: 1rem;
    }

    h2 {
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
    }
  }

  .places-container {
    display: flex;
    justify-content: center;
    align-items: start;
    flex-wrap: wrap;
    gap: 0.5rem;

    & .buttons-container {
      display: flex;
      flex-direction: column;
      position: relative;

      button {
        margin: 0;
        margin-left: 1px;
        padding: 0.85rem 1.25rem;
        border: 0;
        border-left: 1px solid var(--default-border);
        background: transparent;
        color: var(--secondary-text);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        text-align: left;
        white-space: nowrap;

        &:hover {
          color: var(--default-text);
          background-color: color-mix(in srgb, var(--accent) 10%, transparent);
        }

        &.active {
          color: var(--default-text);
          font-weight: 700;
        }
      }

      .current-selected-marker {
        width: 2px;
        height: calc(100% / 6);
        background-color: var(--accent);
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.3s ease-in-out !important;
        z-index: 10;
      }
    }

    & .active-place-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 2.5rem;
      height: 350px;

      & .title {
        font-size: 1.4rem;
        font-weight: 700;

        & .place-name {
          color: var(--accent);
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease-in-out;

          &::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: -2px;
            left: 0;
            background: var(--accent);
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
        font-family: 'Fira Code', monospace;
        font-size: 0.85rem;
        color: var(--secondary-text);
        margin-top: 0.4rem;
        margin-bottom: 1.5rem;
      }

      & .description {
        font-size: 1rem;
        color: var(--secondary-text);
        line-height: 1.7;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-left: 1.1rem;
        list-style-type: square;

        li::marker { color: var(--accent); }
      }
    }
  }
}

@media (max-width: 768px) {
  #career {
    .section-heading { margin-bottom: 1.5rem; }

    .container { min-width: 0; }

    .places-container {
      flex-direction: column;
      align-items: stretch;
      min-width: 0;
      gap: 1.75rem;

      & .buttons-container {
        flex-direction: row;
        width: calc(100vw - 2.4rem);
        max-width: calc(100vw - 2.4rem);
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scrollbar-width: none;

        &::-webkit-scrollbar { display: none; }

        .current-selected-marker { display: none; }

        button {
          flex: 0 0 auto;
          width: auto;
          margin-left: 0;
          border: 1px solid var(--default-border);
          border-radius: 2rem;
          padding: 0.5rem 1rem;
          white-space: nowrap;

          &.active {
            color: var(--accent);
            border-color: var(--accent);
            background-color: color-mix(in srgb, var(--accent) 12%, transparent);
          }
        }
      }

      & .active-place-content {
        height: auto;
        padding: 0 !important;
      }
    }
  }
}
</style>
