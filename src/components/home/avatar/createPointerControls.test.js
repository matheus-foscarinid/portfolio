import { describe, expect, it, vi } from 'vitest';
import { createFakeCanvas, createPointerEvent } from '@/test/factories';
import { createDragRotation } from './createPointerControls';

const FRAMES_TO_SETTLE = 400;

const setup = () => {
  const canvas = createFakeCanvas();
  const onTap = vi.fn();
  const drag = createDragRotation(canvas, { onTap });
  const dragBy = (distance) => {
    canvas.dispatchEvent(createPointerEvent('pointerdown', 0));
    canvas.dispatchEvent(createPointerEvent('pointermove', distance));
  };
  const release = (clientX = 0) => canvas.dispatchEvent(createPointerEvent('pointerup', clientX));
  const runFrames = (count) => {
    let angle = 0;
    for (let frame = 0; frame < count; frame += 1) angle = drag.update();
    return angle;
  };
  return { drag, dragBy, release, runFrames, onTap };
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
    release(100);
    expect(drag.update()).toBeGreaterThan(1);
  });

  it('does not spin when released after holding still', () => {
    const { dragBy, release, runFrames } = setup();
    dragBy(100);
    runFrames(30);
    release(100);
    expect(runFrames(1)).toBeLessThanOrEqual(1);
  });

  it('settles back on the nearest front-facing turn', () => {
    const { dragBy, release, runFrames } = setup();
    dragBy(600);
    release(600);
    const angle = runFrames(FRAMES_TO_SETTLE);
    expect(angle / (Math.PI * 2)).toBeCloseTo(Math.round(angle / (Math.PI * 2)), 2);
  });

  it('stops listening once disposed', () => {
    const { drag, dragBy } = setup();
    drag.dispose();
    dragBy(100);
    expect(drag.update()).toBe(0);
  });

  it('treats a press without dragging as a tap', () => {
    const { dragBy, release, onTap } = setup();
    dragBy(2);
    release(2);
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it('does not tap at the end of a drag', () => {
    const { dragBy, release, onTap } = setup();
    dragBy(100);
    release(100);
    expect(onTap).not.toHaveBeenCalled();
  });
});
