<template>
  <section id="career">
    <div class="container">
      <h2>Career</h2>

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
                v-for="(paragraph, index) in currentPlace.paragraphs"
                :key="index"
              >
                {{ paragraph }}
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
      paragraphs: [
        'The CIMOL is a technical school that offers a variety of courses in areas like informatics, design and electronics.',
        'In the technical course integrated with high school, I was presented to a variety of subjects, including programming, web development, graphic design, and hardware. Through this comprehensive curriculum, I acquired a solid foundation in the field of information technology.',
        'By the end of the course, I was well-equipped with the knowledge and skills necessary to enter the job market with confidence. Thanks to the practical training and real-world experience provided by the program, I was able to seamlessly transition into my professional career and continue to build upon the strong foundation I had established during my time in the course.'
      ],
      role: 'Student',
      period: 'from 2018 to 2020',
      link: 'https://www.cimol.g12.br/',
   },
    { 
      name: 'Unisinos', 
      paragraphs: [
        'At Internet Systems college, we gain a deep understanding of the foundational concepts behind internet technologies and systems. In addition to the technical knowledge we acquire, we also learn about the broader internet ecosystem and how it functions as a whole. This well-rounded education prepares us to excel in the ever-evolving field of web development.',
        'With a focus on practical skills and hands-on experience, I expect to graduate from this program in 2025 with a thorough understanding of how to build effective and efficient digital solutions.'
      ],
      role: 'Student',
      period: 'from 2021 until now',
      link: 'https://www.unisinos.br/',
    },
    { 
      name: 'Scopi', 
      paragraphs: [
        'Scopi is a software company that offers a variety of solutions for strategic planning, project management, and performance monitoring. As a trainee, I was responsible for developing new features and maintaining existing ones for the company’s flagship product, Scopi.',
        'During my time at Scopi, I was able to gain valuable experience working with a variety of technologies, including Angular, Ruby and SQL. I also learned how to work effectively as part of a team using SCRUM, and how to communicate and collaborate with my colleagues to achieve our shared goals.',
        'I am grateful for the opportunity to have worked at Scopi, and I am confident that the skills and experience I gained there will serve me well in my future endeavors.'
      ],
      role: 'Trainee',
      period: 'from January 2021 to October 2021',
      link: 'https://www.scopi.com.br/',
    },
    { 
      name: 'Minha visita', 
      paragraphs: [
        'Minha Visita is a startup that offers the simplest and most efficient way to manage commercial visits to customers. As a fullstack developer, I am responsible for developing new features and maintaining existing ones for the company’s flagship product, Minha Visita.',
        'Currently we are developing a new version of the product, using the latest technologies, like Vue and NestJS, and best practices. I propose and implement scalable solutions to issues identified with our services and the application.',
        'I\'m collaborating with our team to ensure thoughtful and consistent user experiences across the web application and the apps.',

      ],
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