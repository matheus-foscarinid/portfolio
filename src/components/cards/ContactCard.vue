<template>
  <div 
    class="contact-card"
    :class="props.contact.link ? 'hoverable' : ''"
    @click="openLink(props.contact.link)"
  >
    <div 
      v-if="contact.icon"
      class="icon"
    >
      <font-awesome-icon :icon="props.contact.icon" />
    </div>

    <div 
      v-else
    >
      <!-- pass customIcon as a custom component name  -->
      <component 
        :is="props.contact.customIcon"
        class="icon"
      />
    </div>

    <span class="text">
      {{ props.contact.text }}
    </span>
  </div>
</template>

<script setup>
  const props = defineProps(['contact']);

  const openLink = (link) => {
    if (!link) return;

    window.open(link, '_blank');
  };
</script>

<style lang="scss" scoped>
  .contact-card {
    width: 100%;
    display: flex;
    padding: 1rem 1.5rem;
    border-radius: 15px;
    transition: all 0.3s ease-in-out;
    background: var(--secondary-background);
    opacity: 0;

    &.hoverable {
      cursor: pointer;

      &:hover {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        transform: scale(1.01) translateY(-0.1rem) !important;

        & .icon {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
          background: var(--details-background);
        }
      }
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
