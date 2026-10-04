// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import i18n from '@/i18n';
import LighthouseScores from './LighthouseScores.vue';
import {
  getScoreNumbers,
  mockElementTop,
  mockReducedMotion,
  mountComponent,
  stubIntersectionObserver,
} from '@/test/factories';

const VIEWPORT_HEIGHT = 800;
const BELOW_FOLD_TOP = VIEWPORT_HEIGHT + 200;
const ON_SCREEN_TOP = 300;
const REAL_SCORES = ['100', '100', '100', '100'];
const RESET_SCORES = ['0', '0', '0', '0'];

let lighthouse;
let scrollObservedIntoView;

const mountLighthouse = ({ scoresTop = BELOW_FOLD_TOP, isReducedMotion = false } = {}) => {
  mockReducedMotion(isReducedMotion);
  mockElementTop(scoresTop);
  lighthouse = mountComponent(LighthouseScores, { plugins: [i18n] });
};

const scrollToSection = async () => {
  scrollObservedIntoView();
  await nextTick();
};

describe('LighthouseScores', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en';
    window.innerHeight = VIEWPORT_HEIGHT;
    scrollObservedIntoView = stubIntersectionObserver();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
  });

  afterEach(() => {
    lighthouse.unmount();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('before the section scrolls into view', () => {
    it('shows the real scores', () => {
      mountLighthouse();
      expect(getScoreNumbers(lighthouse.root)).toEqual(REAL_SCORES);
    });
  });

  describe('after the section scrolls into view', () => {
    it('resets the rings to 0 to animate them when they are below the fold', async () => {
      mountLighthouse();
      await scrollToSection();
      expect(getScoreNumbers(lighthouse.root)).toEqual(RESET_SCORES);
    });

    it('keeps the real scores when the rings are already on screen', async () => {
      mountLighthouse({ scoresTop: ON_SCREEN_TOP });
      await scrollToSection();
      expect(getScoreNumbers(lighthouse.root)).toEqual(REAL_SCORES);
    });

    it('keeps the real scores with reduced motion', async () => {
      mountLighthouse({ isReducedMotion: true });
      await scrollToSection();
      expect(getScoreNumbers(lighthouse.root)).toEqual(REAL_SCORES);
    });
  });
});
