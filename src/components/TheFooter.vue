<template>
  <footer>
    <div class="texts">
      <span class="logo">matheusdias<span class="dev">.dev</span></span>
      <span class="author">{{ $t('FOOTER.AUTHOR') }}</span>
      <span class="copyright">{{ $t('FOOTER.COPYRIGHT') }}</span>
    </div>

    <div class="icons">
      <button type="button" aria-label="Email" @click="openEmail">
        <font-awesome-icon icon="fa-solid fa-envelope" aria-hidden="true" />
      </button>
      <button type="button" aria-label="LinkedIn" @click="openLinkedin">
        <font-awesome-icon icon="fa-brands fa-linkedin" aria-hidden="true" />
      </button>
      <button type="button" aria-label="GitHub" @click="openGithub">
        <font-awesome-icon icon="fa-brands fa-github" aria-hidden="true" />
      </button>
    </div>
  </footer>
</template>

<script setup>
  const openEmail = () => {
    window.open('mailto:matheus.foscarinid@gmail.com', '_blank');
  };

  const openLinkedin = () => {
    window.open('https://linkedin.com/in/matheus-foscarinid/', '_blank');
  };

  const openGithub = () => {
    window.open('https://github.com/matheus-foscarinid', '_blank');
  };
</script>

<style lang="scss" scoped>
  footer {
    --footer-fg: #fbf1c7;

    width: 100%;
    padding: 2.5rem 3rem;
    background-color: var(--dark-background);
    border-top: 2px solid var(--accent);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .texts {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      .logo {
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: var(--footer-fg);

        .dev { color: var(--accent-on-dark); }
      }

      .author {
        font-size: 0.95rem;
        color: color-mix(in srgb, #fbf1c7 78%, transparent);
      }

      .copyright {
        font-family: 'Fira Code', monospace;
        font-size: 0.78rem;
        color: color-mix(in srgb, #fbf1c7 62%, transparent);
      }
    }

    .icons {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      font-size: 1.5rem;

      button {
        padding: 0;
        border: none;
        background: none;
        color: color-mix(in srgb, #fbf1c7 82%, transparent);
        font-size: inherit;
        line-height: 0;
        cursor: pointer;
        transition: color 0.25s ease, transform 0.25s ease;

        &:hover {
          color: var(--accent-on-dark);
          transform: translateY(-2px);
        }
      }
    }
  }

  @media (max-width: 768px) {
    footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 2rem 1.5rem;
    }
  }
</style>
