<template>
  <header>
    <div class="logo">
      <h2>Matheus.dev</h2>
    </div>

    <ul class="menu">
      <li><a href="#">About</a></li>
      <li><a href="#">Career</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  header {
    position: absolute;
    z-index: 1;
    width: 100vw;
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
          color: var(--text-hover);
        }
      }
    }
  }
</style>