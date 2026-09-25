import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { createStubBones, createStubPoser } from '@/test/factories';
import {
  FIDGETS,
  GESTURES,
  PASTIMES,
  REACTIONS,
  applyGestures,
  getEyesClosed,
  getGazeStrength,
  getGestureWeight,
  MENU,
} from './gestureLibrary';

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
    [...REACTIONS, ...FIDGETS, ...PASTIMES, 'wave', 'bye', 'tap', 'nod'].forEach((name) => expect(GESTURES[name]).toBeDefined());
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

  it('keeps the eyes open without a gesture that closes them', () => {
    const { bones } = setup();
    expect(getEyesClosed([])).toBe(0);
    expect(getEyesClosed([createFrame('wave', bones)])).toBe(0);
  });

  it('closes the eyes as the laugh takes over', () => {
    const { bones } = setup();
    expect(getEyesClosed([createFrame('laugh', bones, 0.5)])).toBe(0.5);
  });

  it('follows the laugh while it blends with another gesture', () => {
    const { bones } = setup();
    expect(getEyesClosed([createFrame('laugh', bones, 0.2), createFrame('wave', bones, 1)])).toBe(0.2);
  });

  it('registers every gesture file under its own name', () => {
    Object.entries(GESTURES).forEach(([name, gesture]) => {
      expect(gesture.name).toBe(name);
      expect(gesture.duration).toBeGreaterThan(0);
      expect(gesture.pose).toBeTypeOf('function');
    });
  });

  it('lets clicks pick the prop gestures too', () => {
    PASTIMES.forEach((name) => expect(REACTIONS).toContain(name));
  });

  it('keeps gestures that need a target out of the menu', () => {
    const listed = MENU.flatMap(({ names }) => names);
    expect(listed).not.toContain('tap');
    expect(listed).toHaveLength(Object.keys(GESTURES).length - 1);
  });

  it('groups the menu by what the gesture does', () => {
    const groupOf = (name) => MENU.find(({ names }) => names.includes(name)).group;
    expect(groupOf('wave')).toBe('greetings');
    expect(groupOf('laugh')).toBe('reactions');
    expect(groupOf('readBook')).toBe('props');
    expect(groupOf('checkWatch')).toBe('idle');
  });

  it('gives every pastime a prop to hold', () => {
    PASTIMES.forEach((name) => expect(GESTURES[name].props.length).toBeGreaterThan(0));
  });

  it('reports how far a gesture has blended in', () => {
    const { bones } = setup();
    const frames = [createFrame('readBook', bones, 0.3), createFrame('wave', bones, 1)];
    expect(getGestureWeight(frames, 'readBook')).toBe(0.3);
    expect(getGestureWeight(frames, 'playGame')).toBe(0);
  });
});
