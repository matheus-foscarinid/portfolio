import { ref } from 'vue';
import { trackEvent } from '@/composables/useAnalytics';
import { requestAvatarReply } from './requestAvatarReply';

// the api rejects longer histories, so only the latest messages go along
const HISTORY_SIZE = 8;

export const useAvatarChat = ({ locale, onGesture }) => {
  const messages = ref([]);
  const isSending = ref(false);
  const errorCode = ref(null);

  const send = async (text) => {
    const content = text.trim();
    if (!content || isSending.value) return false;

    messages.value.push({ role: 'user', content });
    isSending.value = true;
    errorCode.value = null;
    onGesture('think');
    trackEvent('avatar_chat', { lang: locale.value });

    try {
      const { reply, gesture } = await requestAvatarReply({ messages: messages.value.slice(-HISTORY_SIZE), locale: locale.value });
      messages.value.push({ role: 'assistant', content: reply });
      if (gesture) onGesture(gesture);
      return true;
    } catch (error) {
      messages.value.pop();
      errorCode.value = error.code ?? 'unavailable';
      onGesture('shrug');
      return false;
    } finally {
      isSending.value = false;
    }
  };

  return { messages, isSending, errorCode, send };
};
