import { describe, expect, it } from 'vitest';
import { defineProp } from './defineProp';
import { createGrip } from './grips';

const GRIP = createGrip({ palmAt: [0, 0, 0], palm: [0, 1, 0], fingers: [0, 0, 1], pole: [0, -1, 0] });

describe('defineProp', () => {
  it('fills in the defaults', () => {
    const prop = defineProp({ url: '/cat.glb', offsetFromChest: [0, -0.3, 0.2], grips: { left: GRIP } });
    expect(prop).toMatchObject({ url: '/cat.glb', turn: 0, tilt: 0, scale: 1 });
    expect(prop.offsetFromChest.toArray()).toEqual([0, -0.3, 0.2]);
  });

  it('refuses a prop without a model or a grip', () => {
    expect(() => defineProp({ offsetFromChest: [0, 0, 0], grips: { left: GRIP } })).toThrow('model url');
    expect(() => defineProp({ url: '/cat.glb', offsetFromChest: [0, 0, 0], grips: {} })).toThrow('at least one hand');
  });
});
