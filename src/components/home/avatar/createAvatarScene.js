import { Timer } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import mobileModelUrl from '@/assets/models/me-mobile.glb?url';
import modelUrl from '@/assets/models/me.glb?url';
import { MENU } from './animations/gestureLibrary';
import { createFramePacer } from './createFramePacer';
import { createGestureControls } from './createGestureControls';
import { createHeadLook } from './createHeadLook';
import { createProps } from './createProps';
import { createRenderPipeline } from './createRenderPipeline';
import { createStage } from './createStage';
import { loadAvatar } from './loadAvatar';
import { trackCanvasRect } from './screenSpace';

// phones get a lighter model, fewer pixels and half the frame rate to save gpu memory and battery
const QUALITY = {
  full: { modelUrl, maxPixelRatio: 2, frameInterval: 0 },
  light: { modelUrl: mobileModelUrl, maxPixelRatio: 1.5, frameInterval: 1000 / 30 },
};
// waits for the canvas to fade in before saying hi
const GREETING_DELAY = 0.8;

const getQuality = () => {
  const isPhone = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  return isPhone ? QUALITY.light : QUALITY.full;
};

const observeSize = (canvas, onResize) => {
  const observer = new ResizeObserver(() => onResize(canvas.clientWidth, canvas.clientHeight));
  observer.observe(canvas);
  onResize(canvas.clientWidth, canvas.clientHeight);
  return () => observer.disconnect();
};

export const createAvatarScene = async (canvas, { isReducedMotion }) => {
  const quality = getQuality();
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const avatar = await loadAvatar(loader, quality.modelUrl);

  const pipeline = createRenderPipeline(canvas, quality);
  const stage = createStage();
  stage.scene.add(avatar.model);
  await pipeline.warmUp(stage.scene, stage.camera);

  let props = null;
  let isDisposed = false;
  // props load after the avatar so it shows sooner. a gesture played before they land goes empty-handed
  createProps(loader).then(async (loaded) => {
    if (isDisposed) return;
    stage.scene.add(loaded.object);
    await loaded.compileWith(() => pipeline.warmUp(stage.scene, stage.camera));
    props = loaded;
  });

  const canvasRect = trackCanvasRect(canvas);
  const { getRect } = canvasRect;
  const gestures = createGestureControls({ canvas, getCanvasRect: getRect, avatar, camera: stage.camera, isReducedMotion });
  const headLook = createHeadLook({ head: avatar.bones.head, camera: stage.camera, getCanvasRect: getRect, isReducedMotion });
  const pacer = createFramePacer(quality.frameInterval);
  const timer = new Timer();

  const stopObservingSize = observeSize(canvas, (width, height) => {
    stage.setAspect(width / height);
    pipeline.setSize(width, height);
    canvasRect.refresh();
  });

  const animate = (time) => {
    if (!pacer.isDue(time)) return;
    const seconds = timer.update(time).getElapsed();
    const look = headLook.update();
    const frames = gestures.player.update(seconds);

    avatar.model.rotation.y = gestures.drag.update();
    avatar.pose({ seconds, frames, look, isBreathing: !isReducedMotion });
    props?.update(frames, avatar.poser, avatar.bones.chest, seconds);
    pacer.setStill(frames.length === 0 && look.isSettled && !gestures.drag.isSpinning());
    pipeline.render(stage.scene, stage.camera, seconds);
  };

  // says hi on every return, not just the first load
  const start = () => {
    gestures.setRunning(true);
    gestures.actions.greet(GREETING_DELAY);
    pipeline.setAnimationLoop(animate);
  };
  const stop = () => {
    gestures.setRunning(false);
    pipeline.setAnimationLoop(null);
  };

  const dispose = () => {
    isDisposed = true;
    stop();
    headLook.dispose();
    gestures.dispose();
    canvasRect.dispose();
    stopObservingSize();
    stage.dispose();
    pipeline.dispose();
  };

  return { start, stop, dispose, actions: gestures.actions, gestureMenu: isReducedMotion ? [] : MENU };
};
