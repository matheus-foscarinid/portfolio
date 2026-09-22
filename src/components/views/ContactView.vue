<template>
  <section id="contact">
    <div class="container">
      <div class="columns">
        <header class="section-heading">
          <span class="marker" aria-hidden="true"></span>
          <h2>{{ $t('CONTACT.TITLE') }}</h2>
          <p class="subtitle">{{ $t('CONTACT.SUBTITLE') }}</p>
        </header>

        <div class="panel">
          <div class="primary-contact">
            <a
              class="email-cta"
              :href="`mailto:${EMAIL}`"
              @click="trackEvent('contact_click', { channel: 'email', location: 'contact_cta' })"
            >
              <font-awesome-icon icon="fa-solid fa-envelope" aria-hidden="true" />
              <span>{{ $t('CONTACT.EMAIL_CTA') }}</span>
            </a>
            <span class="address">{{ EMAIL }}</span>
          </div>

          <div class="contact-cards">
            <ContactCard
              v-for="(contact, index) in contacts"
              :key="index"
              :contact="contact"
            />
          </div>
        </div>
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
    const panel = document.querySelector('#contact .panel');

    reveal(
      heading,
      { opacity: 0, y: 50, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, stagger: 80, delay: 350, easing: EASE.outBack }
    );

    reveal(
      panel,
      { opacity: 0, y: 30, blur: 2 },
      { opacity: 1, y: 0, blur: 0 },
      { duration: 500, delay: 500 }
    );
  };

  onMounted(() => onReveal('#contact', animateElement));
</script>

<style lang="scss">
  #contact {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: var(--secondary-background);

    .container { width: 100%; }

    // same rail as About, so the two read as a pair
    .columns {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
      align-items: start;
      gap: 4rem;
    }

    .section-heading {
      position: sticky;
      top: 7rem;

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
        max-width: 40ch;
        margin: 0.9rem 0 0;
        color: var(--secondary-text);
        line-height: 1.6;
      }
    }

    // the panel fills the column: the call to action holds the left half, the
    // other ways to reach me stack on the right
    .panel {
      display: grid;
      grid-template-columns: minmax(0, auto) minmax(0, 1fr);
      align-items: center;
      gap: 2.5rem;
      padding: 1.75rem;
      border-radius: 1.25rem;
      border: 1px solid color-mix(in srgb, var(--default-border) 70%, transparent);
      background: var(--default-background);
    }

    .primary-contact {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.6rem;

      .email-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.7rem;
        padding: 1rem 2rem;
        border-radius: 999px;
        white-space: nowrap;
        background-color: var(--accent);
        color: var(--accent-contrast);
        font-size: 1.05rem;
        font-weight: 700;
        text-decoration: none;
        transition: transform 0.25s ease, box-shadow 0.25s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.6rem 1.2rem color-mix(in srgb, var(--accent) 30%, transparent);
        }
      }

      .address {
        text-align: center;
        font-family: 'Fira Code', monospace;
        font-size: 0.82rem;
        color: var(--secondary-text);
      }
    }

    .contact-cards {
      display: grid;
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 900px) {
    #contact {
      .columns {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .section-heading { position: static; }

      .panel {
        grid-template-columns: 1fr;
        gap: 0.6rem;
      }

      .primary-contact {
        padding-bottom: 1.4rem;
        border-bottom: 1px solid var(--default-border);
      }
    }
  }
</style>
