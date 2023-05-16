<template>
  <section id="contact">
    <div class="container">
      <h2>Contact</h2>

      <div class="contact-cards">
        <ContactCard
          v-for="(contact, index) in contacts"
          :key="index"
          :contact="contact"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
  import ContactCard from '@/components/cards/ContactCard.vue';

  const contacts = [
    {
      icon: 'fa-solid fa-location-pin',
      text: 'Rio Grande do Sul, Brazil',
    },
    {
      icon: 'fa-solid fa-envelope',
      text: 'matheus.foscarinid@gmail.com',
    },
    {
      icon: 'fa-brands fa-github',
      text: 'matheus-foscarinid',
      link: 'https://github.com/matheus-foscarinid'
    },
    {
      icon: 'fa-brands fa-linkedin',
      text: 'Matheus Foscarini Dias',
      link: 'https://linkedin.com/in/matheus-foscarinid/'
    },
  ];
</script>

<style lang="scss">
  #contact {
    min-height: 60vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: white;

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
        width: 50px;
        height: 1px;
        margin-right: 20px;
        background-color: var(--default-border);
      }
      &::after {
        content: '';
        display: block;
        position: relative;
        width: 530px;
        height: 1px;
        margin-left: 20px;
        background-color: var(--default-border);
      }
    }

    .contact-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    #contact {
      h2 {
        &::before, &::after {
          width: 50%;
        }
      }
    }
  }
</style>