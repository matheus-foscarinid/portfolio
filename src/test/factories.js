import { Object3D, Vector3 } from 'three';
import { vi } from 'vitest';

export const createPointerEvent = (type, clientX = 0, pointerType = 'mouse') =>
  Object.assign(new Event(type), { clientX, pointerId: 1, pointerType });

export const createFakeCanvas = () => Object.assign(new EventTarget(), { setPointerCapture: vi.fn() });

// the shader chunks the blink patch hooks into
export const createShaderStub = () => ({
  uniforms: {},
  vertexShader: '#include <common>\n#include <begin_vertex>',
  fragmentShader: '#include <common>\n#include <map_fragment>',
});

export const createStubPoser = () => ({
  resetPose: vi.fn(),
  rotate: vi.fn(),
  aim: vi.fn(),
  toModelDirection: vi.fn((direction) => direction),
  getModelAxis: vi.fn(() => new Vector3(0, 0, 1)),
});

const createStubArm = (side) => ({
  side,
  shoulder: new Object3D(),
  arm: new Object3D(),
  foreArm: new Object3D(),
  hand: new Object3D(),
  indexBase: new Object3D(),
  middleBase: new Object3D(),
  pinkyBase: new Object3D(),
  curledFingers: [new Object3D(), new Object3D()],
});

export const createStubBones = () => ({
  spine: new Object3D(),
  chest: new Object3D(),
  neck: new Object3D(),
  head: new Object3D(),
  arms: [createStubArm(1), createStubArm(-1)],
});

export const createGestureLibrary = () => ({
  short: { duration: 1, rise: 0.2, fall: 0.8 },
  long: { duration: 2, rise: 0.2, fall: 0.8 },
});

// mocks Math.random for the next call only, to pick a known option
export const mockNextRandom = (value) => vi.spyOn(Math, 'random').mockReturnValueOnce(value);
