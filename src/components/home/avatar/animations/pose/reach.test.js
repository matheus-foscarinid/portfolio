import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { createPosedArmRig, getFingerDirection, getPalmCenter, getPalmNormal } from '@/test/factories';
import { reachHand } from './reach';

const PALM_UP_GRIP = {
  palmAt: new Vector3(0.1, 1.15, 0.35),
  palm: new Vector3(0, 1, 0),
  fingers: new Vector3(0, 0, 1),
  pole: new Vector3(0.3, -1, -0.3),
};

describe('reachHand', () => {
  it('puts the palm on the grip point', () => {
    const { poser, arm } = createPosedArmRig();
    reachHand(poser, arm, PALM_UP_GRIP, 1);
    expect(getPalmCenter(arm).distanceTo(PALM_UP_GRIP.palmAt)).toBeLessThan(0.025);
  });

  it('points the fingers and turns the palm the way the grip asks', () => {
    const { poser, arm } = createPosedArmRig();
    reachHand(poser, arm, PALM_UP_GRIP, 1);
    expect(getFingerDirection(arm).dot(PALM_UP_GRIP.fingers)).toBeGreaterThan(0.99);
    expect(getPalmNormal(arm).dot(PALM_UP_GRIP.palm)).toBeGreaterThan(0.99);
  });

  it('bends the elbow toward the pole', () => {
    const { poser, arm } = createPosedArmRig();
    reachHand(poser, arm, PALM_UP_GRIP, 1);
    const shoulderHeight = arm.arm.getWorldPosition(new Vector3()).y;
    expect(arm.foreArm.getWorldPosition(new Vector3()).y).toBeLessThan(shoulderHeight);
  });

  it('leaves the arm alone at zero weight', () => {
    const { poser, arm } = createPosedArmRig();
    const restingPalm = getPalmCenter(arm);
    reachHand(poser, arm, PALM_UP_GRIP, 0);
    expect(getPalmCenter(arm).distanceTo(restingPalm)).toBe(0);
  });
});
