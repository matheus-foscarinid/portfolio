<template>
  <div class="contact-card">
    <div class="icon">
      <font-awesome-icon :icon="props.contact.icon" />
    </div>

    <span class="text">
      {{ props.contact.text }}
    </span>
  </div>
</template>

<script setup>
  const props = defineProps(['contact']);
</script>

<style lang="scss" scoped>
  .contact-card {
    display: flex;
    padding: 1rem 1.5rem;
    border-radius: 15px;
    transition: all 0.3s ease-in-out;
    border: 1px solid var(--default-border);

    &:hover {
      border: 1px solid var(--default-background);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      transform: scale(1.01) translateY(-0.1rem);
    }

    & .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      padding: 1rem;
      margin-right: 1rem;
      border-radius: 50%;
      transition: all 0.3s ease-in-out;
      color: var(--secondary-text);

      &:hover {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
      }

      svg {
        width: 100%;
        height: 100%;
      }
    }

    & .text {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--secondary-text);
    }
  }
</style>
