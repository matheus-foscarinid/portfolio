import { Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { createObjectAt, createPosedArmRig, createStubPoser, getPalmCenter } from '@/test/factories';
import { defineProp } from './defineProp';
import { createMirroredGrips } from './grips';
import { getGripTarget, getPropPose, holdProp } from './holdProp';

const TRAY = defineProp({
  url: '/tray.glb',
  offsetFromChest: [0, -0.25, 0.35],
  grips: createMirroredGrips({ palmAt: [0.1, 0, 0], palm: [0, 1, 0], fingers: [0, 0, 1], pole: [0.3, -1, -0.3] }),
});

describe('getPropPose', () => {
  it('places the prop at its offset from the chest', () => {
    const { position } = getPropPose(createStubPoser(), createObjectAt(0, 1.3, 0), TRAY);
    expect(position.toArray()).toEqual([0, 1.05, 0.35]);
  });

  it('turns the prop around its up axis', () => {
    const turned = defineProp({ ...TRAY, offsetFromChest: [0, 0, 0], turn: Math.PI / 2 });
    const { quaternion } = getPropPose(createStubPoser(), createObjectAt(0, 0, 0), turned);
    expect(new Vector3(0, 0, 1).applyQuaternion(quaternion).x).toBeCloseTo(1);
  });
});

describe('getGripTarget', () => {
  it('moves the grip with the prop and the nudge', () => {
    const propPose = { position: new Vector3(1, 2, 3), quaternion: new Quaternion() };
    const target = getGripTarget(createStubPoser(), propPose, TRAY.grips.left, new Vector3(0, 0.01, 0));
    expect(target.palmAt.toArray()).toEqual([1.1, 2.01, 3]);
  });
});

describe('holdProp', () => {
  it('puts each palm on its grip', () => {
    const { poser, arm } = createPosedArmRig();
    holdProp(poser, { chest: createObjectAt(0, 1.4, 0), arms: [arm] }, TRAY, 1);
    expect(getPalmCenter(arm).distanceTo(new Vector3(0.1, 1.15, 0.35))).toBeLessThan(0.025);
  });

  it('leaves an arm alone when the prop has no grip for it', () => {
    const poser = createStubPoser();
    const { arm } = createPosedArmRig();
    const rightHandOnly = defineProp({ ...TRAY, offsetFromChest: [0, 0, 0], grips: { right: TRAY.grips.right } });
    holdProp(poser, { chest: createObjectAt(0, 1.4, 0), arms: [arm] }, rightHandOnly, 1);
    expect(poser.aim).not.toHaveBeenCalled();
  });
});
