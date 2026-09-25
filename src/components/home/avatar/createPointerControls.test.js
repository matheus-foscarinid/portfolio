import { describe, expect, it } from 'vitest';
import { createFakeCanvas, createPointerEvent } from '@/test/factories';
import { createDragRotation } from './createPointerControls';

const FRAMES_TO_SETTLE = 400;

const setup = () => {
  const canvas = createFakeCanvas();
  const drag = createDragRotation(canvas);
  const dragBy = (distance) => {
    canvas.dispatchEvent(createPointerEvent('pointerdown', 0));
    canvas.dispatchEvent(createPointerEvent('pointermove', distance));
  };
  const release = () => canvas.dispatchEvent(createPointerEvent('pointerup'));
  const runFrames = (count) => {
    let angle = 0;
    for (let frame = 0; frame < count; frame += 1) angle = drag.update();
    return angle;
  };
  return { drag, dragBy, release, runFrames };
};

describe('createDragRotation', () => {
  it('rotates with the drag distance', () => {
    const { drag, dragBy } = setup();
    dragBy(100);
    expect(drag.update()).toBeCloseTo(1);
  });

  it('keeps spinning after a quick release', () => {
    const { drag, dragBy, release } = setup();
    dragBy(100);
    release();
    expect(drag.update()).toBeGreaterThan(1);
  });

  it('does not spin when released after holding still', () => {
    const { dragBy, release, runFrames } = setup();
    dragBy(100);
    runFrames(30);
    release();
    expect(runFrames(1)).toBeLessThanOrEqual(1);
  });

  it('settles back on the nearest front-facing turn', () => {
    const { dragBy, release, runFrames } = setup();
    dragBy(600);
    release();
    const angle = runFrames(FRAMES_TO_SETTLE);
    expect(angle / (Math.PI * 2)).toBeCloseTo(Math.round(angle / (Math.PI * 2)), 2);
  });

  it('stops listening once disposed', () => {
    const { drag, dragBy } = setup();
    drag.dispose();
    dragBy(100);
    expect(drag.update()).toBe(0);
  });
});
