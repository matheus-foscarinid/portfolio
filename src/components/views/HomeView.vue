<template>
  <section id="home">
    <div class="container">
      <div class="myself-container">
        <img src="@/assets/images/me.jpg" alt="Matheus Foscarini Dias" />
      </div>
      
      <div class="presentation-container">
        <span class="presentation">Hi! My name is</span>
        <h2>Matheus Foscarini Dias</h2>
        <h3>I'm a Fullstack developer.</h3>
    
        <p class="summary">As a fullstack mid-level developer based in Rio Grande do Sul, Brazil. I specialize in creating high-quality, scalable applications with exceptional user experiences. With expertise in both front-end and back-end development, I'm able to build end-to-end solutions that are efficient. Whether it's complex architecture or intuitive user interfaces, I'm committed to delivering results that exceed client expectations.</p>
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  #home {
    height: calc(100vh - 5rem);
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
</style>