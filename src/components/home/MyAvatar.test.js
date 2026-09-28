// @vitest-environment happy-dom
import { nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { createChatResponse, getChatBubbles, mountComponent, sendChatMessage } from '@/test/factories';
import MyAvatar from './MyAvatar.vue';

const QUESTION = 'What do you do?';
const REPLY = 'I build AI hiring tools.';

const scene = vi.hoisted(() => ({ current: null }));

vi.mock('./useAvatarScene', () => ({ useAvatarScene: () => scene.current }));

let avatar;

beforeEach(async () => {
  vi.stubGlobal('fetch', vi.fn(async () => createChatResponse({ reply: REPLY, gesture: null })));
  scene.current = { isReady: ref(true), hasFailed: ref(false), canvasKey: ref(0), gestureMenu: ref([]), playGesture: vi.fn() };
  i18n.global.locale.value = 'en';
  avatar = mountComponent(MyAvatar, { plugins: [i18n] });
  avatar.root.querySelector('.avatar-chat .toggle').click();
  await nextTick();
  await sendChatMessage(avatar.root, QUESTION);
});

afterEach(() => {
  avatar.unmount();
  vi.unstubAllGlobals();
});

describe('MyAvatar', () => {
  describe('after the scene is released off-screen and rebuilt', () => {
    beforeEach(async () => {
      scene.current.isReady.value = false;
      await nextTick();
      scene.current.isReady.value = true;
      await nextTick();
    });

    it('keeps the chat history', () => {
      expect(getChatBubbles(avatar.root)).toEqual([i18n.global.t('HOME.CHAT.INTRO'), QUESTION, REPLY]);
    });
  });
});
