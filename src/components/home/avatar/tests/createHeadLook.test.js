// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createLookRig, moveCursorTo } from '@/test/factories';
import { createHeadLook, getLookTarget } from '../createHeadLook';

const HEAD = { x: 200, y: 200 };
const FRAMES_TO_SETTLE = 200;

let headLook;

const setup = ({ isReducedMotion = false } = {}) => {
  headLook = createHeadLook({ ...createLookRig(), isReducedMotion });
};

const runFrames = (count) => {
  let look;
  for (let frame = 0; frame < count; frame += 1) look = headLook.update();
  return look;
};

afterEach(() => headLook?.dispose());

describe('getLookTarget', () => {
  it('looks straight ahead at a cursor on the head', () => {
    expect(getLookTarget(HEAD, HEAD)).toEqual({ yaw: 0, pitch: 0 });
  });

  it('turns toward the cursor', () => {
    const target = getLookTarget({ x: 400, y: 300 }, HEAD);
    expect(target.yaw).toBeGreaterThan(0);
    expect(target.pitch).toBeGreaterThan(0);
  });

  it('caps how far the head turns', () => {
    expect(getLookTarget({ x: 100_000, y: 100_000 }, HEAD)).toEqual({ yaw: 0.7, pitch: 0.3 });
  });
});

describe('createHeadLook', () => {
  describe('before the cursor moves', () => {
    beforeEach(() => setup());

    it('faces front and is settled', () => {
      expect(runFrames(1)).toEqual({ yaw: 0, pitch: 0, isSettled: true });
    });
  });

  describe('after the cursor moves', () => {
    beforeEach(() => {
      setup();
      moveCursorTo(400, 200);
    });

    it('turns toward it gradually', () => {
      const look = runFrames(1);
      expect(look.yaw).toBeGreaterThan(0);
      expect(look.isSettled).toBe(false);
    });

    it('settles once it catches up', () => {
      expect(runFrames(FRAMES_TO_SETTLE).isSettled).toBe(true);
    });
  });

  describe('with reduced motion', () => {
    it('jumps straight to the cursor', () => {
      setup({ isReducedMotion: true });
      moveCursorTo(400, 200);
      expect(runFrames(1).isSettled).toBe(true);
    });
  });

  it('stops following the cursor once disposed', () => {
    setup();
    headLook.dispose();
    moveCursorTo(400, 200);
    expect(runFrames(1).yaw).toBe(0);
  });
});
