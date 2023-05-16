<template>
  <footer>
    <div class="texts">
      <span class="author">Designed & Built by Matheus Dias</span>
      <span class="copyright">Copyright © 2023. All rights are reserved</span>
    </div>

    <div class="icons">
      <font-awesome-icon 
        icon="fa-brands fa-linkedin"
        @click="openLinkedin"
      />
      <font-awesome-icon 
        icon="fa-brands fa-github"
        @click="openGithub"
      />
    </div>
  </footer>
</template>

<script setup>
  const openLinkedin = () => {
    window.open('https://linkedin.com/in/matheus-foscarinid/', '_blank');
  };

  const openGithub = () => {
    window.open('https://github.com/matheus-foscarinid', '_blank');
  };
</script>

<style lang="scss" scoped>
  footer {
    width: 100%;
    padding: 3rem;
    background-color: var(--dark-background);
    color: var(--text-default);
    display: flex;
    justify-content: space-between;
    
    .texts {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .author {
        font-size: 1.2rem;
        font-weight: 400;
        line-height: 1.5;
        text-align: center;
        text-align: start;
        color: var(--default-border);
      }
  
      .copyright {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        text-align: center;
        text-align: start;
        color: var(--disabled-text);
      }
    }

    .icons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      font-size: 1.75rem;
      color: var(--default-border);

      svg {
        transition: color 0.3s ease-in-out;
        cursor: pointer;

        &:hover {
          color: var(--details-background);
        }
      }
    }

  }
</style>