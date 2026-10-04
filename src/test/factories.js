import { BoxGeometry, Bone, Group, Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { createApp, nextTick } from 'vue';
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

export const createPropStub = (url, { scale = 1, eyes = null } = {}) => ({
  url,
  eyes,
  offsetFromChest: new Vector3(0, 0, 0.3),
  turn: 0,
  tilt: 0,
  scale,
  grips: {},
});

// a head at the center of a 400px canvas, so a cursor there looks straight ahead
export const createLookRig = () => {
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0, 4);
  camera.updateMatrixWorld();
  return { head: new Object3D(), camera, getCanvasRect: () => ({ left: 0, top: 0, width: 400, height: 400 }) };
};

export const moveCursorTo = (clientX, clientY) =>
  window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX, clientY }));

export const createFakeLoader = ({ failingUrls = [] } = {}) => ({
  loadAsync: vi.fn(async (url) => {
    if (failingUrls.includes(url)) throw new Error(`${url} not found`);
    const scene = new Group();
    scene.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial()));
    return { scene };
  }),
});

export const createChatRequest = ({ messages = [{ role: 'user', content: 'Hi!' }], locale = 'en', ip = '1.1.1.1', body } = {}) =>
  new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': ip },
    body: body ?? JSON.stringify({ messages, locale }),
  });

export const createGroqResponse = ({ reply = 'Hey there!', gesture = 'wave', content, status = 200 } = {}) => {
  if (status !== 200) return new Response('groq error', { status });
  const message = { content: content ?? JSON.stringify({ reply, gesture }) };
  return Response.json({ choices: [{ message }] });
};

export const createChatResponse = ({ status = 200, ...body } = {}) => Response.json(body, { status });

export const getFetchBody = (fetchMock, call = -1) => JSON.parse(fetchMock.mock.calls.at(call)[1].body);

export const runTimes = (count, run) => Promise.all(Array.from({ length: count }, run));

export const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

// font awesome is stubbed since tests never assert on icons
export const mountComponent = (component, { props = {}, plugins = [] } = {}) => {
  const root = document.createElement('div');
  document.body.append(root);
  const app = createApp(component, props).component('font-awesome-icon', { render: () => null });
  plugins.forEach((plugin) => app.use(plugin));
  app.mount(root);

  return {
    root,
    unmount: () => {
      app.unmount();
      root.remove();
    },
  };
};

export const sendChatMessage = async (root, text) => {
  const input = root.querySelector('#avatar-chat-panel input');
  input.value = text;
  input.dispatchEvent(new Event('input'));
  root.querySelector('#avatar-chat-panel form').dispatchEvent(new Event('submit', { cancelable: true }));
  await flushPromises();
  await nextTick();
};

export const getChatBubbles = (root) => [...root.querySelectorAll('.message')].map((bubble) => bubble.textContent.trim());

export const mockReducedMotion = (isReduced) =>
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({ matches: isReduced, media: query }));

export const mockElementTop = (top) => vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top });

export const stubIntersectionObserver = () => {
  const reveals = [];
  vi.stubGlobal('IntersectionObserver', function (callback) {
    this.observe = (target) => reveals.push(() => callback([{ isIntersecting: true, target }], this));
    this.unobserve = () => { };
  });
  return () => reveals.forEach((reveal) => reveal());
};

export const getScoreNumbers = (root) => [...root.querySelectorAll('.score .number')].map((number) => number.textContent.trim());
