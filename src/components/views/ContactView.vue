<template>
  <section id="contact">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('CONTACT.TITLE') }}</h2>
      </header>

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
  import { computed, onMounted } from 'vue';
  import ContactCard from '@/components/cards/ContactCard.vue';
  import LeetCodeIcon from '@/assets/svgs/leetcode-icon.vue';
  import { reveal, onReveal, EASE } from '@/composables/useReveal';

  import { useI18n } from 'vue-i18n';
  const { t: $t } = useI18n();

  const contacts = computed(() => [
    {
      icon: 'fa-solid fa-envelope',
      label: 'Email',
      text: 'matheus.foscarinid@gmail.com',
      link: 'mailto:matheus.foscarinid@gmail.com'
    },
    {
      icon: 'fa-brands fa-github',
      label: 'GitHub',
      text: 'matheus-foscarinid',
      link: 'https://github.com/matheus-foscarinid'
    },
    {
      icon: 'fa-brands fa-linkedin',
      label: 'LinkedIn',
      text: 'Matheus Foscarini Dias',
      link: 'https://linkedin.com/in/matheus-foscarinid/'
    },
    {
      customIcon: LeetCodeIcon,
      label: 'LeetCode',
      text: 'Matheus Foscarini Dias',
      link: 'https://leetcode.com/matheus-foscarinid/'
    },
  ]);

  const animateElement = () => {
    const heading = document.querySelectorAll('#contact .section-heading > *');
    const contactCards = document.querySelectorAll('.contact-cards > *');

    reveal(
      heading,
      { opacity: 0, y: 50, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, stagger: 80, delay: 350, easing: EASE.outBack }
    );

    reveal(
      contactCards,
      { opacity: 0, y: 30, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, stagger: 100, delay: 500 }
    );
  };

  onMounted(() => onReveal('#contact .container', animateElement));
</script>

<style lang="scss">
  #contact {
    min-height: 50vh;
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

    .contact-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    #contact .contact-cards {
      grid-template-columns: 1fr;
    }
  }
</style>