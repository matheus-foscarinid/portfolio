import {
  Box3,
  CircleGeometry,
  Clock,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBlink } from './createBlink';
import { createCrtPass } from './createCrtPass';
import { rigAvatar } from './rigAvatar';

// set to false to drop the crt look. createCrtPass.js can then be deleted
const IS_CRT_ENABLED = true;

const MODEL_URL = '/models/me.glb';
const MODEL_HEIGHT = 1.75;
const MAX_PIXEL_RATIO = 2;
// how far in front of the screen the character imagines the cursor, in css pixels.
// smaller means it turns harder toward the cursor
const LOOK_DEPTH = 500;
const MAX_YAW = 0.7;
const MAX_PITCH = 0.3;
const LOOK_EASING = 0.08;
// share of the look the spine takes, so looking down bends the body instead of folding the neck
const SPINE_LOOK = { yaw: 0.25, pitch: 0.45 };
const BREATH_SPEED = 1.7;
const DRAG_SENSITIVITY = 0.01;
const SPIN_FRICTION = 0.92;
const RETURN_EASING = 0.04;
const FULL_TURN = Math.PI * 2;

// near-neutral light so the skin keeps its tone instead of turning orange
const createLights = (scene) => {
  const key = new DirectionalLight(0xfff4e6, 1.9);
  key.position.set(1.5, 3, 3);
  const fill = new DirectionalLight(0xffffff, 0.8);
  fill.position.set(-2, 1.5, 2.5);
  const rim = new DirectionalLight(0xd3869b, 0.6);
  rim.position.set(-2, 2, -2);
  scene.add(new HemisphereLight(0xffffff, 0xcfcac4, 2.3), key, fill, rim);
};

const createGroundShadow = () => {
  const material = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
  const shadow = new Mesh(new CircleGeometry(0.34, 32), material);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  return shadow;
};

const loadModel = async () => {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const { scene: model } = await loader.loadAsync(MODEL_URL);

  const size = new Box3().setFromObject(model).getSize(new Vector3());
  model.scale.setScalar(MODEL_HEIGHT / size.y);

  let mesh;
  model.traverse((object) => {
    if (object.isMesh) mesh = object;
  });
  return { model, updateBlink: createBlink(mesh.material), bones: rigAvatar(mesh) };
};

const createCursorTracking = () => {
  const cursor = { x: null, y: null };
  const onPointerMove = (event) => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
  };
  window.addEventListener('pointermove', onPointerMove);
  return { cursor, dispose: () => window.removeEventListener('pointermove', onPointerMove) };
};

// spins with momentum, then settles back to facing front on the nearest full turn
const createDragRotation = (canvas) => {
  const state = { angle: 0, velocity: 0, isDragging: false, lastX: 0 };

  const onPointerDown = (event) => {
    state.isDragging = true;
    state.lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!state.isDragging) return;
    state.velocity = (event.clientX - state.lastX) * DRAG_SENSITIVITY;
    state.angle += state.velocity;
    state.lastX = event.clientX;
  };
  const onPointerUp = () => { state.isDragging = false; };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  const update = () => {
    if (state.isDragging) return state.angle;
    state.angle += state.velocity;
    state.velocity *= SPIN_FRICTION;
    if (Math.abs(state.velocity) < 0.002) {
      const front = Math.round(state.angle / FULL_TURN) * FULL_TURN;
      state.angle += (front - state.angle) * RETURN_EASING;
    }
    return state.angle;
  };

  const dispose = () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
  };
  return { update, dispose };
};

const getScreenPosition = (object, camera, canvas) => {
  const point = object.getWorldPosition(new Vector3()).project(camera);
  const rect = canvas.getBoundingClientRect();
  return {
    x: rect.left + ((point.x + 1) / 2) * rect.width,
    y: rect.top + ((1 - point.y) / 2) * rect.height,
  };
};

const getLookTarget = (cursor, head, camera, canvas) => {
  if (cursor.x === null) return { yaw: 0, pitch: 0 };
  const origin = getScreenPosition(head, camera, canvas);
  return {
    yaw: MathUtils.clamp(Math.atan2(cursor.x - origin.x, LOOK_DEPTH), -MAX_YAW, MAX_YAW),
    pitch: MathUtils.clamp(Math.atan2(cursor.y - origin.y, LOOK_DEPTH), -MAX_PITCH, MAX_PITCH),
  };
};

const applyIdle = ({ spine, leftArm, rightArm }, seconds) => {
  const breath = Math.sin(seconds * BREATH_SPEED);
  spine.scale.set(1 + breath * 0.008, 1 + breath * 0.004, 1 + breath * 0.012);
  spine.rotation.z = Math.sin(seconds * 0.5) * 0.012;

  const armSwing = Math.sin(seconds * BREATH_SPEED + 0.6);
  leftArm.rotation.set(armSwing * 0.035, 0, 0.03 + breath * 0.012);
  rightArm.rotation.set(-armSwing * 0.035, 0, -0.03 - breath * 0.012);
};

export const createAvatarScene = async (canvas, { isReducedMotion }) => {
  const { model, bones, updateBlink } = await loadModel();

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0.95, 3.9);
  camera.lookAt(0, 0.86, 0);

  scene.add(model, createGroundShadow());
  createLights(scene);

  const tracking = createCursorTracking();
  const drag = createDragRotation(canvas);
  const clock = new Clock();
  const look = { yaw: 0, pitch: 0 };
  const crt = IS_CRT_ENABLED ? createCrtPass(renderer) : null;

  const resize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    crt?.setSize();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  const animate = () => {
    const { spine, head } = bones;
    const seconds = clock.getElapsedTime();
    const target = getLookTarget(tracking.cursor, head, camera, canvas);
    const easing = isReducedMotion ? 1 : LOOK_EASING;
    look.yaw += (target.yaw - look.yaw) * easing;
    look.pitch += (target.pitch - look.pitch) * easing;

    if (!isReducedMotion) applyIdle(bones, seconds);
    updateBlink(seconds);
    model.rotation.y = drag.update();
    spine.rotation.y = look.yaw * SPINE_LOOK.yaw;
    spine.rotation.x = look.pitch * SPINE_LOOK.pitch;
    head.rotation.y = look.yaw * (1 - SPINE_LOOK.yaw);
    head.rotation.x = look.pitch * (1 - SPINE_LOOK.pitch);

    if (crt) crt.render(scene, camera, seconds);
    else renderer.render(scene, camera);
  };

  const start = () => renderer.setAnimationLoop(animate);
  const stop = () => renderer.setAnimationLoop(null);

  const dispose = () => {
    stop();
    tracking.dispose();
    drag.dispose();
    resizeObserver.disconnect();
    crt?.dispose();
    scene.traverse((object) => {
      object.geometry?.dispose();
      object.material?.map?.dispose();
      object.material?.dispose();
    });
    renderer.dispose();
  };

  return { start, stop, dispose };
};
