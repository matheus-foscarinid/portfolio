<template>
  <div id="stack" class="stack-band">
    <div class="container">
      <span class="label">{{ $t('ABOUT.STACK_TITLE') }}</span>

      <div class="stacks-container">
        <StackCard
          v-for="stack in stacks"
          :key="stack.name"
          :name="stack.name"
          :type="stack.type"
          :label="stack.label"
          :src="stack.src"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  import StackCard from '@/components/cards/StackCard.vue';
  import { reveal, onReveal } from '@/composables/useReveal';

  const { t: $t } = useI18n();

  const stacks = [
    { name: 'vuejs', type: 'original', label: 'Vue.js' },
    { name: 'react', type: 'original', label: 'React' },
    { name: 'typescript', type: 'original', label: 'TypeScript' },
    { name: 'go', type: 'original', label: 'Go' },
    { name: 'ruby', type: 'original', label: 'Ruby' },
    { name: 'nextjs', type: 'original', label: 'Next.js' },
    { name: 'nodejs', type: 'original', label: 'Node.js' },
    { name: 'nestjs', type: 'original', label: 'NestJS' },
    { name: 'rails', type: 'original-wordmark', label: 'Rails' },
    { name: 'graphql', type: 'plain', label: 'GraphQL' },
    { name: 'python', type: 'original', label: 'Python' },
    { name: 'mysql', type: 'original', label: 'MySQL' },
    { name: 'docker', type: 'original', label: 'Docker' },
    { name: 'claude-code', src: '/icons/claude-code.svg', label: 'Claude Code' },
    { name: 'linear', src: '/icons/linear.svg', label: 'Linear' },
    { name: 'opencode', src: '/icons/opencode.svg', label: 'OpenCode' },
    { name: 'superset', src: '/icons/superset.svg', label: 'Superset' },
    { name: 'javascript', type: 'original', label: 'JavaScript' },
    { name: 'git', type: 'original', label: 'Git' },
    { name: 'html5', type: 'original', label: 'HTML5' },
    { name: 'css3', type: 'original', label: 'CSS3' },
  ];

  const animateElement = () => {
    reveal(
      document.querySelectorAll('.stack-band .stacks-container > *'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      { duration: 400, stagger: 40 }
    );
  };

  onMounted(() => onReveal('.stack-band', animateElement));
</script>

<style lang="scss" scoped>
  .stack-band {
    background: var(--secondary-background);
    border-block: 1px solid var(--default-border);

    .container {
      margin: 0 auto;
      padding-block: 2.75rem;
      text-align: center;
    }

    .label {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      color: var(--secondary-text);

      &::before {
        content: '';
        width: 1.5rem;
        height: 2px;
        background-color: var(--accent);
      }
    }

    // centred wrap: each row fills the width the screen allows and the last row
    // stays centred under it, so no row reads as a leftover
    .stacks-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.75rem 2rem;
    }
  }

  @media (max-width: 768px) {
    .stack-band {
      .container { padding-block: 1.5rem; }

      .stacks-container { gap: 0.9rem 0.5rem; }

      // denser cards so a row holds six: at the desktop size the last row was
      // left with a single item
      :deep(.stack) {
        width: 3.2rem;

        .icon {
          width: 1.5rem;
          height: 1.5rem;
          padding: 0.5rem;
        }

        .label { font-size: 0.62rem; }
      }
    }
  }
</style>
