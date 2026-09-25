import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { createStubBones, createStubPoser } from '@/test/factories';
import { FIDGETS, GESTURES, REACTIONS, applyGestures, getGazeStrength } from './gestureLibrary';

const setup = () => ({ poser: createStubPoser(), bones: createStubBones() });

const createFrame = (name, bones, weight = 1) => ({
  name,
  progress: 0.5,
  weight,
  arm: bones.arms[0],
  direction: new Vector3(0, 0, 1),
});

describe('gestureLibrary', () => {
  it('knows every gesture the triggers can ask for', () => {
    [...REACTIONS, ...FIDGETS, 'wave', 'bye', 'tap', 'nod'].forEach((name) => expect(GESTURES[name]).toBeDefined());
  });

  it('poses every gesture without touching the rest pose', () => {
    Object.keys(GESTURES).forEach((name) => {
      const { poser, bones } = setup();
      applyGestures(poser, bones, [createFrame(name, bones)]);
      expect(poser.rotate.mock.calls.length + poser.aim.mock.calls.length).toBeGreaterThan(0);
      expect(poser.resetPose).not.toHaveBeenCalled();
    });
  });

  it('keeps cursor tracking while no gesture holds the gaze', () => {
    const { bones } = setup();
    expect(getGazeStrength([])).toBe(1);
    expect(getGazeStrength([createFrame('wave', bones)])).toBe(1);
  });

  it('lets go of the cursor as a gaze-holding gesture takes over', () => {
    const { bones } = setup();
    expect(getGazeStrength([createFrame('lookAround', bones, 0.25)])).toBeCloseTo(0.75);
  });
});
