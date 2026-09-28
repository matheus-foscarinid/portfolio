// @vitest-environment happy-dom
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { createChatResponse, flushPromises, getChatBubbles, mountComponent, sendChatMessage } from '@/test/factories';
import AvatarChat from './AvatarChat.vue';

const QUESTION = 'What do you do?';
const REPLY = 'I build AI hiring tools.';
const { t } = i18n.global;

let fetchMock;
let chat;

beforeEach(async () => {
  fetchMock = vi.fn(async () => createChatResponse({ reply: REPLY, gesture: 'typeOnLaptop' }));
  vi.stubGlobal('fetch', fetchMock);
  i18n.global.locale.value = 'en';
  chat = mountComponent(AvatarChat, { plugins: [i18n] });
  chat.root.querySelector('.toggle').click();
  await nextTick();
});

afterEach(() => {
  chat.unmount();
  vi.unstubAllGlobals();
});

describe('AvatarChat', () => {
  describe('after a successful reply', () => {
    beforeEach(() => sendChatMessage(chat.root, QUESTION));

    it('shows the question and the reply and clears the input', () => {
      expect(getChatBubbles(chat.root)).toEqual([t('HOME.CHAT.INTRO'), QUESTION, REPLY]);
      expect(chat.root.querySelector('input').value).toBe('');
    });

    it('hides the suggestions', () => {
      expect(chat.root.querySelector('.suggestions')).toBeNull();
    });
  });

  describe('after a reply is typed out and the bubble reopens', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
      await sendChatMessage(chat.root, QUESTION);
      vi.advanceTimersByTime(2000);
      chat.root.querySelector('.toggle').click();
      await nextTick();
      chat.root.querySelector('.toggle').click();
      await nextTick();
    });

    afterEach(() => vi.useRealTimers());

    it('shows the reply in full without typing it again', () => {
      expect(chat.root.querySelector('.cursor')).toBeNull();
      expect(getChatBubbles(chat.root)).toEqual([t('HOME.CHAT.INTRO'), QUESTION, REPLY]);
    });
  });

  describe('after a failed reply', () => {
    it.each([
      ['rate_limited', 429],
      ['unavailable', 502],
    ])('puts the question back in the input and explains %s', async (errorCode, status) => {
      fetchMock.mockResolvedValue(createChatResponse({ status, error: errorCode }));

      await sendChatMessage(chat.root, QUESTION);

      expect(chat.root.querySelector('input').value).toBe(QUESTION);
      expect(getChatBubbles(chat.root)).toEqual([t('HOME.CHAT.INTRO')]);
      expect(chat.root.querySelector('[role="alert"]').textContent.trim()).toBe(t(`HOME.CHAT.ERRORS.${errorCode}`));
    });
  });

  describe('from a suggestion', () => {
    it('sends the suggestion as the question', async () => {
      chat.root.querySelector('.suggestions button').click();
      await flushPromises();
      await nextTick();

      expect(getChatBubbles(chat.root)).toEqual([t('HOME.CHAT.INTRO'), t('HOME.CHAT.SUGGESTIONS.WORK'), REPLY]);
    });
  });
});
