// @vitest-environment happy-dom
import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createChatResponse, getFetchBody } from '@/test/factories';
import { useAvatarChat } from './useAvatarChat';

const QUESTION = 'What do you do?';
const REPLY = 'I build AI hiring tools.';

let fetchMock;
let onGesture;

const startChat = ({ locale = 'en' } = {}) => useAvatarChat({ locale: ref(locale), onGesture });

beforeEach(() => {
  fetchMock = vi.fn(async () => createChatResponse({ reply: REPLY, gesture: 'typeOnLaptop' }));
  vi.stubGlobal('fetch', fetchMock);
  onGesture = vi.fn();
});

afterEach(() => vi.unstubAllGlobals());

describe('useAvatarChat', () => {
  describe('after a successful reply', () => {
    it('keeps the question and the reply in order', async () => {
      const chat = startChat();

      expect(await chat.send(`  ${QUESTION}  `)).toBe(true);
      expect(chat.messages.value).toEqual([
        { role: 'user', content: QUESTION },
        { role: 'assistant', content: REPLY },
      ]);
      expect(chat.isSending.value).toBe(false);
    });

    it('thinks while waiting, then plays the reply gesture', async () => {
      await startChat().send(QUESTION);

      expect(onGesture.mock.calls).toEqual([['think'], ['typeOnLaptop']]);
    });

    it('skips the reply gesture when the api has none', async () => {
      fetchMock.mockResolvedValue(createChatResponse({ reply: REPLY, gesture: null }));

      await startChat().send(QUESTION);

      expect(onGesture.mock.calls).toEqual([['think']]);
    });

    it('sends the locale and only the latest 8 messages', async () => {
      const chat = startChat({ locale: 'pt' });
      for (let count = 0; count < 5; count++) await chat.send(`question ${count}`);

      const { messages, locale } = getFetchBody(fetchMock);
      expect(locale).toBe('pt');
      expect(messages).toHaveLength(8);
      expect(messages.at(-1)).toEqual({ role: 'user', content: 'question 4' });
    });
  });

  describe('before sending', () => {
    it('ignores a blank message', async () => {
      expect(await startChat().send('   ')).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('ignores a second message while one is on the way', async () => {
      const chat = startChat();
      const first = chat.send(QUESTION);

      expect(await chat.send('another one')).toBe(false);
      await first;
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('after a failed reply', () => {
    it.each([
      ['the daily limit', () => createChatResponse({ status: 429, error: 'rate_limited' }), 'rate_limited'],
      ['a server error', () => createChatResponse({ status: 502, error: 'unavailable' }), 'unavailable'],
      ['a response that is not json', () => new Response('<html>', { status: 504 }), 'unavailable'],
    ])('on %s it drops the question, shrugs and reports %s', async (_, buildResponse, errorCode) => {
      fetchMock.mockResolvedValue(buildResponse());
      const chat = startChat();

      expect(await chat.send(QUESTION)).toBe(false);
      expect(chat.messages.value).toEqual([]);
      expect(chat.errorCode.value).toBe(errorCode);
      expect(onGesture).toHaveBeenLastCalledWith('shrug');
    });

    it('reports unavailable when the network is down', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
      const chat = startChat();

      await chat.send(QUESTION);

      expect(chat.errorCode.value).toBe('unavailable');
    });

    it('clears the error on the next successful message', async () => {
      fetchMock.mockResolvedValueOnce(createChatResponse({ status: 502, error: 'unavailable' }));
      const chat = startChat();

      await chat.send(QUESTION);
      await chat.send(QUESTION);

      expect(chat.errorCode.value).toBe(null);
    });
  });
});
