import { WebGLRenderer } from 'three';
import { createCrtPass } from './createCrtPass';

// set to false to drop the crt look. createCrtPass.js can then be deleted
const IS_CRT_ENABLED = true;

const createPlainPass = (renderer) => ({
  setSize: () => {},
  render: (scene, camera) => renderer.render(scene, camera),
  compileAsync: (scene, camera) => renderer.compileAsync(scene, camera),
  dispose: () => {},
});

const uploadTextures = (renderer, scene) => {
  scene.traverse(({ material }) => {
    Object.values(material ?? {}).forEach((value) => {
      if (value?.isTexture) renderer.initTexture(value);
    });
  });
};

export const createRenderPipeline = (canvas, { maxPixelRatio }) => {
  // the crt pass antialiases its own render target, so the canvas doesn't need to
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !IS_CRT_ENABLED });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  const pass = IS_CRT_ENABLED ? createCrtPass(renderer) : createPlainPass(renderer);

  const setSize = (width, height) => {
    renderer.setSize(width, height, false);
    pass.setSize();
  };

  const warmUp = (scene, camera) => {
    uploadTextures(renderer, scene);
    return pass.compileAsync(scene, camera);
  };

  const dispose = () => {
    pass.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };

  return {
    setSize,
    warmUp,
    render: pass.render,
    setAnimationLoop: (loop) => renderer.setAnimationLoop(loop),
    dispose,
  };
};
