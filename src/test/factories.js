import { Bone, Group, Object3D, Quaternion, Vector3 } from 'three';
import { vi } from 'vitest';
import { createBonePoser } from '@/components/home/avatar/createBonePoser';

export const createPointerEvent = (type, clientX = 0, pointerType = 'mouse') =>
  Object.assign(new Event(type), { clientX, pointerId: 1, pointerType });

export const createFakeCanvas = () => Object.assign(new EventTarget(), { setPointerCapture: vi.fn() });

// the shader chunks the face patch hooks into
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
  toWorldDirection: vi.fn((direction) => direction),
  getModelRotation: vi.fn(() => new Quaternion()),
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
  thumb: [new Object3D(), new Object3D()],
  curledFingers: Array.from({ length: 9 }, () => new Object3D()),
});

export const createStubBones = () => ({
  spine: new Object3D(),
  chest: new Object3D(),
  neck: new Object3D(),
  head: new Object3D(),
  arms: [createStubArm(1), createStubArm(-1)],
});

export const getRotatedBones = (poser) => poser.rotate.mock.calls.map(([bone]) => bone);

export const createGestureLibrary = () => ({
  short: { duration: 1, blendIn: 0.2, blendOut: 0.2 },
  long: { duration: 2, blendIn: 0.2, blendOut: 0.2 },
});

// mocks Math.random for the next call only, to pick a known option
export const mockNextRandom = (value) => vi.spyOn(Math, 'random').mockReturnValueOnce(value);

const attachBone = (parent, position) => {
  const bone = new Bone();
  bone.position.set(...position);
  parent.add(bone);
  return bone;
};

// a real left arm in a t-pose along +x, palm down
const createArmRig = () => {
  const model = new Group();
  const shoulder = attachBone(model, [0.1, 1.4, 0]);
  const arm = attachBone(shoulder, [0.1, 0, 0]);
  const foreArm = attachBone(arm, [0.28, 0, 0]);
  const hand = attachBone(foreArm, [0.25, 0, 0]);
  const rig = {
    side: 1,
    shoulder,
    arm,
    foreArm,
    hand,
    middleBase: attachBone(hand, [0.09, 0, 0]),
    indexBase: attachBone(hand, [0.09, 0, 0.03]),
    pinkyBase: attachBone(hand, [0.08, 0, -0.03]),
  };
  model.updateMatrixWorld(true);
  return { model, arm: rig, bones: [shoulder, arm, foreArm, hand, rig.middleBase, rig.indexBase, rig.pinkyBase] };
};

export const createPosedArmRig = () => {
  const { model, arm, bones } = createArmRig();
  const poser = createBonePoser(model, bones);
  poser.resetPose();
  return { poser, arm };
};

const getWorldPosition = (bone) => bone.getWorldPosition(new Vector3());

export const getPalmCenter = (arm) => getWorldPosition(arm.hand).lerp(getWorldPosition(arm.middleBase), 0.5);

export const getFingerDirection = (arm) => getWorldPosition(arm.middleBase).sub(getWorldPosition(arm.hand)).normalize();

export const getPalmNormal = (arm) => {
  const across = getWorldPosition(arm.indexBase).sub(getWorldPosition(arm.pinkyBase));
  return getFingerDirection(arm).cross(across).multiplyScalar(arm.side).normalize();
};

export const createObjectAt = (x, y, z) => {
  const object = new Object3D();
  object.position.set(x, y, z);
  object.updateMatrixWorld(true);
  return object;
};

export const createPropStub = (url, { scale = 1 } = {}) => ({
  url,
  offsetFromChest: new Vector3(0, 0, 0.3),
  turn: 0,
  tilt: 0,
  scale,
  grips: {},
});

export const createFakeLoader = ({ failingUrls = [] } = {}) => ({
  loadAsync: vi.fn(async (url) => {
    if (failingUrls.includes(url)) throw new Error(`${url} not found`);
    return { scene: new Group() };
  }),
});
