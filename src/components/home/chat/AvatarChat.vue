<template>
  <div
    ref="root"
    class="avatar-chat"
    data-avatar-ignore
  >
    <AvatarToggle
      class="toggle"
      icon="fas fa-comments"
      :label="$t('HOME.CHAT.TOGGLE')"
      :aria-expanded="isOpen"
      aria-controls="avatar-chat-panel"
      @click="toggle"
    />

    <div
      v-if="isOpen"
      id="avatar-chat-panel"
      class="panel"
      role="dialog"
      :aria-label="$t('HOME.CHAT.TITLE')"
    >
      <!-- additions only, so screen readers read each reply once instead of every typed letter -->
      <ol
        ref="messageList"
        class="messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        <li class="message assistant">{{ $t('HOME.CHAT.INTRO') }}</li>
        <li
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.role"
        >
          <TypewriterText
            v-if="message.role === 'assistant'"
            :text="message.content"
            :is-animated="index > lastTypedIndex"
            @typed="lastTypedIndex = index"
          />
          <template v-else>{{ message.content }}</template>
        </li>
        <li
          v-if="isSending"
          class="message assistant is-typing"
          :aria-label="$t('HOME.CHAT.TYPING')"
        >
          <span></span><span></span><span></span>
        </li>
      </ol>

      <p
        v-if="errorCode"
        class="error"
        role="alert"
      >
        {{ $t(`HOME.CHAT.ERRORS.${errorCode}`) }}
      </p>

      <ul
        v-if="!messages.length"
        class="suggestions"
      >
        <li
          v-for="key in SUGGESTION_KEYS"
          :key="key"
        >
          <button @click="submit($t(key))">{{ $t(key) }}</button>
        </li>
      </ul>

      <form @submit.prevent="submit(draft)">
        <input
          ref="input"
          v-model="draft"
          :aria-label="$t('HOME.CHAT.PLACEHOLDER')"
          :placeholder="$t('HOME.CHAT.PLACEHOLDER')"
          maxlength="400"
          autocomplete="off"
        >
        <button
          type="submit"
          :disabled="isSending || !draft.trim()"
          :aria-label="$t('HOME.CHAT.SEND')"
        >
          <font-awesome-icon icon="fas fa-paper-plane" aria-hidden="true" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDismiss } from '@/composables/useDismiss';
import AvatarToggle from '../AvatarToggle.vue';
import TypewriterText from './TypewriterText.vue';
import { useAvatarChat } from './useAvatarChat';

const SUGGESTION_KEYS = ['HOME.CHAT.SUGGESTIONS.WORK', 'HOME.CHAT.SUGGESTIONS.STACK', 'HOME.CHAT.SUGGESTIONS.CATS'];

const emit = defineEmits(['gesture']);

const { locale } = useI18n();
const root = ref(null);
const messageList = ref(null);
const input = ref(null);
const isOpen = ref(false);
const draft = ref('');
// replies already typed out show in full when the bubble is reopened
const lastTypedIndex = ref(-1);
useDismiss(root, isOpen);

const { messages, isSending, errorCode, send } = useAvatarChat({
  locale,
  onGesture: (name) => emit('gesture', name),
});

const scrollToLatest = async () => {
  await nextTick();
  messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' });
};
watch([() => messages.value.length, isSending], scrollToLatest);

const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) return;
  await nextTick();
  input.value?.focus();
};

const submit = async (text) => {
  draft.value = '';
  const isSent = await send(text);
  if (!isSent) draft.value = text;
};
</script>

<style lang="scss" scoped>
  // opts out of the global position: relative so the bubble sizes itself against the whole avatar
  .avatar-chat {
    position: static;
  }

  .panel {
    --tail-size: 1.1rem;

    position: absolute;
    top: 3.25rem;
    left: 64%;
    // overlapping the hero text is fine while the chat is open
    width: 28rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 85%;
    padding: 1rem;
    border: 1px solid var(--default-border);
    border-radius: 1.25rem;
    background-color: var(--secondary-background);
    // a glow in the page color keeps the hero text behind it from crowding the edges
    box-shadow:
      0 0 0 0.4rem var(--default-background),
      0 0 2.5rem 1.25rem var(--default-background),
      0 1rem 2rem rgba(0, 0, 0, 0.14);
    transform-origin: 0 2rem;
    animation: bubble-pop 0.22s ease-out;

    &::before {
      content: '';
      position: absolute;
      top: 1.5rem;
      left: calc(var(--tail-size) / -2);
      width: var(--tail-size);
      height: var(--tail-size);
      border-bottom: 1px solid var(--default-border);
      border-left: 1px solid var(--default-border);
      background-color: inherit;
      transform: rotate(45deg);
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    // the avatar column is too narrow for a side bubble, so it sits under the head instead
    @media (max-width: 768px) {
      top: auto;
      right: 0.5rem;
      bottom: 0.5rem;
      left: 0.5rem;
      width: auto;
      max-height: 62%;
      transform-origin: 50% 0;

      &::before {
        top: calc(var(--tail-size) / -2);
        left: calc(50% - var(--tail-size) / 2);
        border-bottom: none;
        border-top: 1px solid var(--default-border);
      }
    }
  }

  @keyframes bubble-pop {
    from { opacity: 0; transform: scale(0.85); }
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    padding: 0;
    list-style: none;
  }

  .message {
    max-width: 85%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.8rem;
    font-size: 0.9rem;
    line-height: 1.45;
    overflow-wrap: anywhere;

    &.assistant {
      align-self: flex-start;
      border-bottom-left-radius: 0.2rem;
      background-color: var(--details-background);
      color: var(--default-text);
    }

    &.user {
      align-self: flex-end;
      border-bottom-right-radius: 0.2rem;
      background-color: var(--accent);
      color: var(--accent-contrast);
    }

    &.is-typing {
      display: inline-flex;
      gap: 0.25rem;
      padding: 0.65rem 0.8rem;

      span {
        width: 0.35rem;
        height: 0.35rem;
        border-radius: 50%;
        background-color: var(--disabled-text);
        animation: typing 1.2s ease-in-out infinite;

        &:nth-child(2) { animation-delay: 0.15s; }
        &:nth-child(3) { animation-delay: 0.3s; }
      }

      @media (prefers-reduced-motion: reduce) {
        span { animation: none; }
      }
    }
  }

  @keyframes typing {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-3px); }
  }

  .error {
    font-size: 0.8rem;
    color: var(--accent);
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding: 0;
    list-style: none;

    button {
      padding: 0.3rem 0.65rem;
      border: 1px solid var(--default-border);
      border-radius: 999px;
      background: none;
      color: var(--secondary-text);
      font-size: 0.78rem;
      cursor: pointer;
      transition: border-color 0.15s ease, color 0.15s ease;

      &:hover,
      &:focus-visible {
        border-color: var(--accent);
        color: var(--accent);
      }
    }
  }

  form {
    display: flex;
    gap: 0.4rem;

    input {
      flex: 1;
      min-width: 0;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--default-border);
      border-radius: 999px;
      background-color: var(--default-background);
      color: var(--default-text);
      font: inherit;
      font-size: 0.85rem;

      &:focus-visible {
        outline: none;
        border-color: var(--accent);
      }
    }

    button {
      flex: none;
      width: 2.2rem;
      height: 2.2rem;
      border: none;
      border-radius: 50%;
      background-color: var(--accent);
      color: var(--accent-contrast);
      cursor: pointer;
      transition: opacity 0.15s ease;

      &:disabled {
        opacity: 0.45;
        cursor: default;
      }
    }
  }
</style>
