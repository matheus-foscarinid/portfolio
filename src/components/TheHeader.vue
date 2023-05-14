<template>
  <header>
    <div class="logo">
      <h2>Matheus.dev</h2>
    </div>

    <ul class="menu">
      <li><a href="#about">About</a></li>
      <li><a href="#career">Career</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  header {
    position: sticky;
    top: 0;
    z-index: 1;
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
  }

  @media (max-width: 768px) {
    header {
      place-content: center;
      .menu {
        display: none;
      }
    }
  }
</style>