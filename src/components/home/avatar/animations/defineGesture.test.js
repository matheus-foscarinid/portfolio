import { describe, expect, it } from 'vitest';
import { defineGesture } from './defineGesture';

const pose = () => {};

describe('defineGesture', () => {
  it('fills in the defaults', () => {
    expect(defineGesture({ name: 'nod', duration: 1, pose })).toEqual({
      name: 'nod',
      duration: 1,
      pose,
      blendIn: 0.2,
      blendOut: 0.2,
      holdsGaze: false,
      closesEyes: 0,
      props: [],
      needsTarget: false,
      pools: [],
    });
  });

  it('refuses a gesture missing its name, duration or pose', () => {
    expect(() => defineGesture({ duration: 1, pose })).toThrow('a gesture needs a name');
    expect(() => defineGesture({ name: 'nod', duration: 0, pose })).toThrow('positive duration');
    expect(() => defineGesture({ name: 'nod', duration: 1 })).toThrow('pose function');
  });

  it('refuses a pool nothing picks from', () => {
    expect(() => defineGesture({ name: 'nod', duration: 1, pose, pools: ['clicks'] })).toThrow('unknown pool: clicks');
  });
});
