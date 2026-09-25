import { describe, expect, it } from 'vitest';
import { createMirroredGrips } from './grips';

describe('createMirroredGrips', () => {
  it('copies the left grip across the body for the right hand', () => {
    const { left, right } = createMirroredGrips({ palmAt: [0.1, 0.2, 0.3], palm: [1, 0, 0], fingers: [0, 0, 1], pole: [1, -1, 0] });
    expect(right.palmAt.toArray()).toEqual([-0.1, 0.2, 0.3]);
    expect(right.palm.x).toBe(-left.palm.x);
    expect(right.pole.x).toBe(-left.pole.x);
    expect(right.fingers.z).toBe(left.fingers.z);
  });
});
