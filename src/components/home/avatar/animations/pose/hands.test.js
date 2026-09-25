import { describe, expect, it } from 'vitest';
import { createStubBones, createStubPoser, getRotatedBones } from '@/test/factories';
import { curlFingers, pressThumb, tapFingers } from './hands';

const setup = () => ({ poser: createStubPoser(), arm: createStubBones().arms[0] });

describe('hands', () => {
  it('curls every curled finger joint', () => {
    const { poser, arm } = setup();
    curlFingers(poser, arm, 1);
    expect(getRotatedBones(poser)).toEqual(arm.curledFingers);
  });

  it('taps the index finger along with the curled ones', () => {
    const { poser, arm } = setup();
    tapFingers(poser, arm, { progress: 0.3, weight: 1, beats: 10 });
    expect(getRotatedBones(poser)).toEqual([arm.indexBase, ...arm.curledFingers]);
  });

  it('does not bend a finger at zero weight', () => {
    const { poser, arm } = setup();
    tapFingers(poser, arm, { progress: 0.3, weight: 0, beats: 10 });
    poser.rotate.mock.calls.forEach(([, , angle]) => expect(Math.abs(angle)).toBe(0));
  });

  it('presses both thumb joints', () => {
    const { poser, arm } = setup();
    pressThumb(poser, arm, 0.4);
    expect(getRotatedBones(poser)).toEqual(arm.thumb);
  });
});
