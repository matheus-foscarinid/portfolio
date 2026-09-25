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
import { createCursorTracking, createDragRotation } from './createPointerControls';
import { rigAvatar } from './rigAvatar';

// set to false to drop the crt look. createCrtPass.js can then be deleted
const IS_CRT_ENABLED = true;

const MODEL_URL = '/models/me.glb';
const MODEL_HEIGHT = 1.75;
const MAX_PIXEL_RATIO = 2;
// how far in front of the head the cursor is imagined, in css px. lower turns the head harder
const LOOK_DEPTH = 500;
const MAX_YAW = 0.7;
const MAX_PITCH = 0.3;
const LOOK_EASING = 0.08;
// share of the look the spine takes, so looking down bends the body instead of folding the neck
const SPINE_LOOK = { yaw: 0.25, pitch: 0.45 };
const IDLE = {
  breathSpeed: 1.7,
  breathScale: new Vector3(0.008, 0.004, 0.012),
  swaySpeed: 0.5,
  swayAngle: 0.012,
  armSwing: 0.035,
  armSpread: 0.03,
  armBreath: 0.012,
};

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
  const breath = Math.sin(seconds * IDLE.breathSpeed);
  spine.scale.set(1, 1, 1).addScaledVector(IDLE.breathScale, breath);
  spine.rotation.z = Math.sin(seconds * IDLE.swaySpeed) * IDLE.swayAngle;

  const armSwing = Math.sin(seconds * IDLE.breathSpeed + 0.6) * IDLE.armSwing;
  const armSpread = IDLE.armSpread + breath * IDLE.armBreath;
  leftArm.rotation.set(armSwing, 0, armSpread);
  rightArm.rotation.set(-armSwing, 0, -armSpread);
};

const applyLook = ({ spine, head }, look) => {
  spine.rotation.y = look.yaw * SPINE_LOOK.yaw;
  spine.rotation.x = look.pitch * SPINE_LOOK.pitch;
  head.rotation.y = look.yaw * (1 - SPINE_LOOK.yaw);
  head.rotation.x = look.pitch * (1 - SPINE_LOOK.pitch);
};

const disposeScene = (scene) => {
  scene.traverse((object) => {
    object.geometry?.dispose();
    object.material?.map?.dispose();
    object.material?.dispose();
  });
};

export const createAvatarScene = async (canvas, { isReducedMotion }) => {
  const { model, bones, updateBlink } = await loadModel();

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const crt = IS_CRT_ENABLED ? createCrtPass(renderer) : null;

  const scene = new Scene();
  const camera = createCamera();
  scene.add(model, createGroundShadow());
  createLights(scene);

  const tracking = createCursorTracking();
  const drag = createDragRotation(canvas);
  const clock = new Clock();
  const look = { yaw: 0, pitch: 0 };
  const lookEasing = isReducedMotion ? 1 : LOOK_EASING;

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
    const seconds = clock.getElapsedTime();
    const target = getLookTarget(tracking.cursor, bones.head, camera, canvas);
    look.yaw += (target.yaw - look.yaw) * lookEasing;
    look.pitch += (target.pitch - look.pitch) * lookEasing;

    if (!isReducedMotion) applyIdle(bones, seconds);
    applyLook(bones, look);
    updateBlink(seconds);
    model.rotation.y = drag.update();

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
    disposeScene(scene);
    renderer.dispose();
  };

  return { start, stop, dispose };
};
