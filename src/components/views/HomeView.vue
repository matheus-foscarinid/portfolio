<template>
  <section id="home">
    <div class="container appear-on-scroll">
      <div class="myself-container">
        <img src="@/assets/images/me.jpg" alt="Matheus Foscarini Dias" />
      </div>
      
      <div class="presentation-container">
        <span class="presentation">{{  $t('HOME.PRESENTATION_1') }}</span>
        <h2>Matheus Foscarini Dias</h2>
        <h3>{{  $t('HOME.PRESENTATION_2') }}</h3>
    
        <p class="summary">{{  $t('HOME.SUMMARY') }}</p>

        <button 
          class="cv-button"
          @click="downloadCV"
        >
          {{  $t('HOME.DOWNLOAD_CV') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
  const downloadCV = () => {
    const link = document.createElement('a');

    link.href = '/dias-matheus-cv.pdf';
    link.download = 'dias-matheus-cv.pdf';
    link.click();
  };
</script>

<style lang="scss" scoped>
  #home {
    min-height: calc(100vh - 5rem);
    display: flex;

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5rem;

      .presentation-container {
        flex: 3;
  
        .presentation {
          color: var(--secondary-text);
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
    
        h2 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
        }
    
        h3 {
          color: var(--secondary-text);
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
        }
    
        .summary {
          max-width: 700px;
          text-align: justify;
          margin-top: 1rem;
        }

        .cv-button {
          margin-top: 2rem;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          background-color: var(--details-background);
          color: var(--default-text);
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid var(--default-border);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          

          &:hover {
            transform: scale(1.05);
            background-color: var(--secondary-background);
            box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
          }
        }
      }
  
      .myself-container {
        flex: 2;
  
        img {
          width: 100%;
          border-radius: 50%;
          aspect-ratio: 1/1;
          object-fit: cover;
          transition: all 0.3s ease-in-out;
          border: 2px solid var(--default-border);
  
          &:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 20px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }

  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
  }
</style>