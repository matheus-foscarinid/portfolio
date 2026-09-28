// @vitest-environment happy-dom
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountComponent } from '@/test/factories';
import TypewriterText from './TypewriterText.vue';

const TEXT = 'I build AI hiring tools.';

let onTyped;
let typewriter;

const mountTypewriter = ({ isAnimated = true } = {}) => {
  typewriter = mountComponent(TypewriterText, { props: { text: TEXT, isAnimated, onTyped } });
};

const getPendingText = () => typewriter.root.querySelector('.pending').textContent;
const hasCursor = () => Boolean(typewriter.root.querySelector('.cursor'));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  onTyped = vi.fn();
});

afterEach(() => {
  typewriter.unmount();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('TypewriterText', () => {
  describe('while typing', () => {
    beforeEach(async () => {
      mountTypewriter();
      vi.advanceTimersByTime(100);
      await nextTick();
    });

    it('shows a cursor and keeps the rest of the text laid out but hidden', () => {
      expect(hasCursor()).toBe(true);
      expect(getPendingText().length).toBeGreaterThan(0);
      expect(typewriter.root.textContent).toBe(TEXT);
    });

    it('has not reported being done', () => {
      expect(onTyped).not.toHaveBeenCalled();
    });
  });

  describe('after typing', () => {
    beforeEach(async () => {
      mountTypewriter();
      vi.advanceTimersByTime(2000);
      await nextTick();
    });

    it('shows the whole text without a cursor', () => {
      expect(getPendingText()).toBe('');
      expect(hasCursor()).toBe(false);
    });

    it('reports being done once', () => {
      expect(onTyped).toHaveBeenCalledTimes(1);
    });
  });

  describe('without the animation', () => {
    it.each([
      ['when it was already typed', () => mountTypewriter({ isAnimated: false })],
      ['when the visitor prefers reduced motion', () => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true });
        mountTypewriter();
      }],
    ])('shows the whole text at once %s', (_, mount) => {
      mount();

      expect(getPendingText()).toBe('');
      expect(hasCursor()).toBe(false);
    });
  });
});
