const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 400;
const ROLES = ['user', 'assistant'];

const isValidMessage = (message) =>
  ROLES.includes(message?.role) &&
  typeof message.content === 'string' &&
  message.content.trim().length > 0 &&
  message.content.length <= MAX_MESSAGE_LENGTH;

// returns null for anything the chat ui would never send
export const parseChatRequest = (body) => {
  const { messages, locale } = body ?? {};
  if (!Array.isArray(messages) || !messages.length || messages.length > MAX_MESSAGES) return null;
  if (!messages.every(isValidMessage) || messages.at(-1).role !== 'user') return null;

  return {
    messages: messages.map(({ role, content }) => ({ role, content: content.trim() })),
    locale: /^[a-z]{2}$/.test(locale) ? locale : 'en',
  };
};
