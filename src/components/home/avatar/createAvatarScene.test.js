import { describe, expect, it } from 'vitest';
import { createAvatarFrame } from '@/test/factories';
import { isStill } from './createAvatarScene';

const BREATHING_LAG = 0.006;

describe('isStill', () => {
  it('is still when only the breathing moves', () => {
    expect(isStill(createAvatarFrame({ target: { yaw: 0.2 + BREATHING_LAG, pitch: 0.1 } }))).toBe(true);
  });

  it.each([
    ['a gesture plays', { frames: [{ name: 'wave', weight: 1 }] }],
    ['the head is still turning to the cursor', { target: { yaw: 0.5, pitch: 0.1 } }],
    ['the head is still tilting to the cursor', { target: { yaw: 0.2, pitch: 0.3 } }],
    ['it spins after a drag', { angle: 0.3, previousAngle: 0.25 }],
    ['it slowly turns back to front', { angle: 0.002, previousAngle: 0 }],
  ])('is moving while %s', (_, overrides) => {
    expect(isStill(createAvatarFrame(overrides))).toBe(false);
  });
});
