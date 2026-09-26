import {
  Box3,
  CircleGeometry,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Timer,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { applyIdle, applyLook } from './animations/animateBody';
import { createAvatarActions } from './animations/createAvatarActions';
import { createGesturePlayer } from './animations/createGesturePlayer';
import { createGestureTriggers } from './animations/createGestureTriggers';
import { GESTURES, MENU, applyGestures, getEyesClosed, getGazeStrength } from './animations/gestureLibrary';
import { createBonePoser } from './createBonePoser';
import { createCrtPass } from './createCrtPass';
import { createFace } from './createFace';
import { createCursorTracking, createDragRotation } from './createPointerControls';
import { createProps } from './createProps';
import { findAvatarBones } from './findAvatarBones';

// set to false to drop the crt look. createCrtPass.js can then be deleted
const IS_CRT_ENABLED = true;

const MODEL_HEIGHT = 1.75;
// rAF timestamps jitter, so a frame due at exactly the interval shouldn't get skipped
const FRAME_TOLERANCE = 2;
// phones get a lighter model, fewer pixels and half the frame rate to save gpu memory and battery
const QUALITY = {
  full: { modelUrl: '/models/me.glb', maxPixelRatio: 2, frameInterval: 0 },
  light: { modelUrl: '/models/me-mobile.glb', maxPixelRatio: 1.5, frameInterval: 1000 / 30 },
};
// how far in front of the head the cursor is imagined, in css px. lower turns the head harder
const LOOK_DEPTH = 500;
const MAX_YAW = 0.7;
const MAX_PITCH = 0.3;
const LOOK_EASING = 0.08;
// how far in front of the shoulder a clicked element is imagined, in css px
const TAP_DEPTH = 400;
// waits for the canvas to fade in before saying hi
const GREETING_DELAY = 0.8;

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

const createCamera = () => {
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0.95, 3.9);
  camera.lookAt(0, 0.86, 0);
  return camera;
};

const getQuality = () => {
  const isPhone = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  return isPhone ? QUALITY.light : QUALITY.full;
};

const loadModel = async (loader, modelUrl) => {
  const { scene: model } = await loader.loadAsync(modelUrl);

  const size = new Box3().setFromObject(model).getSize(new Vector3());
  model.scale.setScalar(MODEL_HEIGHT / size.y);

  let mesh;
  model.traverse((object) => {
    if (object.isSkinnedMesh) mesh = object;
  });
  // the rest pose bounds don't cover raised arms
  mesh.frustumCulled = false;
  return {
    model,
    bones: findAvatarBones(model),
    poser: createBonePoser(model, mesh.skeleton.bones),
    updateFace: createFace(mesh.material),
  };
};

// reading layout every frame is costly, so the rect only refreshes on scroll and resize
const trackCanvasRect = (canvas) => {
  const tracked = { rect: canvas.getBoundingClientRect() };
  const refresh = () => { tracked.rect = canvas.getBoundingClientRect(); };
  window.addEventListener('scroll', refresh, { passive: true });
  return { tracked, refresh, dispose: () => window.removeEventListener('scroll', refresh) };
};

const getScreenPosition = (object, camera, rect) => {
  const point = object.getWorldPosition(new Vector3()).project(camera);
  return {
    x: rect.left + ((point.x + 1) / 2) * rect.width,
    y: rect.top + ((1 - point.y) / 2) * rect.height,
  };
};

const getLookTarget = (cursor, head, camera, rect) => {
  if (cursor.x === null) return { yaw: 0, pitch: 0 };
  const origin = getScreenPosition(head, camera, rect);
  return {
    yaw: MathUtils.clamp(Math.atan2(cursor.x - origin.x, LOOK_DEPTH), -MAX_YAW, MAX_YAW),
    pitch: MathUtils.clamp(Math.atan2(cursor.y - origin.y, LOOK_DEPTH), -MAX_PITCH, MAX_PITCH),
  };
};

const getTapTarget = (point, { arms }, camera, rect, poser) => {
  const reaches = arms.map((arm) => ({ arm, origin: getScreenPosition(arm.arm, camera, rect) }));
  const { arm, origin } = reaches.reduce((closest, reach) =>
    Math.abs(reach.origin.x - point.x) < Math.abs(closest.origin.x - point.x) ? reach : closest);
  const direction = new Vector3(point.x - origin.x, origin.y - point.y, TAP_DEPTH).normalize();
  return { arm, direction: poser.toModelDirection(direction) };
};

// a menu drawn over the avatar hides any gesture, so it shouldn't play one
const isCanvasUncovered = (canvas, rect) =>
  document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) === canvas;

const createGestureControls = ({ canvas, canvasRect, bones, camera, poser, isReducedMotion }) => {
  const player = createGesturePlayer(GESTURES);
  let isRunning = false;
  const isActive = () => isRunning && !isReducedMotion;
  const actions = createAvatarActions({
    player,
    isActive,
    isEnabled: () => isActive() && isCanvasUncovered(canvas, canvasRect.tracked.rect),
    getTapTarget: (point) => getTapTarget(point, bones, camera, canvasRect.tracked.rect, poser),
  });
  const triggers = createGestureTriggers({ actions });
  const drag = createDragRotation(canvas, { onTap: actions.react });

  return {
    player,
    actions,
    drag,
    setRunning: (value) => { isRunning = value; },
    dispose: () => {
      triggers.dispose();
      drag.dispose();
    },
  };
};

const disposeScene = (scene) => {
  scene.traverse((object) => {
    object.geometry?.dispose();
    object.material?.map?.dispose();
    object.material?.dispose();
  });
};

export const createAvatarScene = async (canvas, { isReducedMotion }) => {
  const quality = getQuality();
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [{ model, bones, poser, updateFace }, props] = await Promise.all([
    loadModel(loader, quality.modelUrl),
    createProps(loader),
  ]);

  // the crt pass antialiases its own render target, so the canvas doesn't need to
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !IS_CRT_ENABLED });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.maxPixelRatio));
  const crt = IS_CRT_ENABLED ? createCrtPass(renderer) : null;

  const scene = new Scene();
  const camera = createCamera();
  scene.add(model, props.object, createGroundShadow());
  createLights(scene);

  const canvasRect = trackCanvasRect(canvas);
  const gestures = createGestureControls({ canvas, canvasRect, bones, camera, poser, isReducedMotion });
  const tracking = createCursorTracking();
  const timer = new Timer();
  const look = { yaw: 0, pitch: 0 };
  const lookEasing = isReducedMotion ? 1 : LOOK_EASING;

  const resize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    crt?.setSize();
    canvasRect.refresh();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let lastFrameAt = -Infinity;

  const animate = (time) => {
    if (time - lastFrameAt < quality.frameInterval - FRAME_TOLERANCE) return;
    lastFrameAt = time;

    timer.update(time);
    const seconds = timer.getElapsed();
    const target = getLookTarget(tracking.cursor, bones.head, camera, canvasRect.tracked.rect);
    look.yaw += (target.yaw - look.yaw) * lookEasing;
    look.pitch += (target.pitch - look.pitch) * lookEasing;

    model.rotation.y = gestures.drag.update();
    poser.resetPose();
    if (!isReducedMotion) applyIdle(poser, bones, seconds);
    const frames = gestures.player.update(seconds);
    applyGestures(poser, bones, frames);
    applyLook(poser, bones, look, getGazeStrength(frames));
    updateFace(seconds, getEyesClosed(frames));
    props.update(frames, poser, bones.chest);

    if (crt) crt.render(scene, camera, seconds);
    else renderer.render(scene, camera);
  };

  // says hi on every return, not just the first load
  const start = () => {
    gestures.setRunning(true);
    gestures.actions.greet(GREETING_DELAY);
    renderer.setAnimationLoop(animate);
  };
  const stop = () => {
    gestures.setRunning(false);
    renderer.setAnimationLoop(null);
  };

  const dispose = () => {
    stop();
    tracking.dispose();
    gestures.dispose();
    canvasRect.dispose();
    resizeObserver.disconnect();
    crt?.dispose();
    disposeScene(scene);
    renderer.dispose();
    renderer.forceContextLoss();
  };

  return { start, stop, dispose, actions: gestures.actions, gestureMenu: isReducedMotion ? [] : MENU };
};
