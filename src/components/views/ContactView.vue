<template>
  <section id="contact">
    <div class="container">
      <header class="section-heading">
        <span class="marker" aria-hidden="true"></span>
        <h2>{{ $t('CONTACT.TITLE') }}</h2>
        <p class="subtitle">{{ $t('CONTACT.SUBTITLE') }}</p>
      </header>

      <div class="primary-contact">
        <a
          class="email-cta"
          :href="`mailto:${EMAIL}`"
          @click="trackEvent('contact_click', { channel: 'email', location: 'contact_cta' })"
        >
          <font-awesome-icon icon="fa-solid fa-envelope" aria-hidden="true" />
          <span>{{ $t('CONTACT.EMAIL_CTA') }}</span>
        </a>
        <span class="note">{{ $t('CONTACT.NOTE') }}</span>
      </div>

      <span class="elsewhere">{{ $t('CONTACT.ELSEWHERE') }}</span>

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
  import { trackEvent } from '@/composables/useAnalytics';

  import { useI18n } from 'vue-i18n';
  const { t: $t } = useI18n();

  const EMAIL = 'matheus.foscarinid@gmail.com';

  const contacts = computed(() => [
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
    const cta = document.querySelector('#contact .primary-contact');
    const elsewhere = document.querySelector('#contact .elsewhere');
    const contactCards = document.querySelectorAll('.contact-cards > *');

    reveal(
      heading,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0 },
      { duration: 420, stagger: 50, easing: EASE.outExpo }
    );

    reveal(
      cta,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      { duration: 420, delay: 140 }
    );

    reveal(
      elsewhere,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      { duration: 420, delay: 210 }
    );

    reveal(
      contactCards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      { duration: 420, stagger: 60, delay: 260 }
    );
  };

  onMounted(() => onReveal('#contact .container', animateElement));
</script>

<style lang="scss">
  #contact {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: var(--secondary-background);

    .container { width: 100%; }

    .section-heading {
      margin-bottom: 2rem;

      .marker {
        display: block;
        width: 2.5rem;
        height: 3px;
        background-color: var(--accent);
        margin-bottom: 1rem;
      }

      h2 {
        font-size: clamp(2rem, 4vw, 2.75rem);
        font-weight: 600;
        letter-spacing: -0.03em;
        margin: 0;
      }

      .subtitle {
        max-width: 52ch;
        margin: 0.9rem 0 0;
        color: var(--secondary-text);
        line-height: 1.6;
      }
    }

    .primary-contact {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      margin-bottom: 3rem;

      .email-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
        padding: 1rem 2rem;
        border-radius: 999px;
        background-color: var(--accent);
        color: var(--accent-contrast);
        font-size: 1.05rem;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.25s ease, box-shadow 0.25s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.6rem 1.2rem color-mix(in srgb, var(--accent) 30%, transparent);
        }
      }

      .note {
        color: var(--secondary-text);
        font-size: 0.9rem;
      }
    }

    .elsewhere {
      display: block;
      margin-bottom: 1rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      color: var(--secondary-text);
    }

    .contact-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 900px) {
    #contact .contact-cards { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    #contact {
      .primary-contact {
        margin-bottom: 2.25rem;

        .email-cta {
          width: 100%;
          justify-content: center;
        }
      }

      .contact-cards { grid-template-columns: 1fr; }
    }
  }
</style>
