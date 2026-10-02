import { describe, expect, it } from 'vitest';
import { createFramePacer } from '../createFramePacer';

const DISPLAY_FRAME = 1000 / 60;
const FULL_RATE = 0;
const PHONE_RATE = 1000 / 30;

const countDueFrames = (pacer, frameCount) =>
  Array.from({ length: frameCount }, (_, frame) => frame * DISPLAY_FRAME).filter(pacer.isDue).length;

describe('createFramePacer', () => {
  describe('while the avatar moves', () => {
    it('renders every display frame at full rate', () => {
      expect(countDueFrames(createFramePacer(FULL_RATE), 60)).toBe(60);
    });

    it('renders every other display frame on phones', () => {
      expect(countDueFrames(createFramePacer(PHONE_RATE), 60)).toBe(30);
    });

    it('still renders a frame that lands a little early', () => {
      const pacer = createFramePacer(PHONE_RATE);
      pacer.isDue(0);
      expect(pacer.isDue(PHONE_RATE - 1)).toBe(true);
    });
  });

  describe('while the avatar is still', () => {
    it.each([
      ['at full rate', FULL_RATE],
      ['on phones', PHONE_RATE],
    ])('renders every other display frame %s', (_, rate) => {
      const pacer = createFramePacer(rate);
      pacer.setStill(true);
      expect(countDueFrames(pacer, 60)).toBe(30);
    });
  });
});
