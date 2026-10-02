import { Box3, Vector3 } from 'three';
import { applyIdle, applyLook } from './animations/animateBody';
import { applyGestures, getEyesClosed, getGazeStrength } from './animations/gestureLibrary';
import { createBonePoser } from './createBonePoser';
import { createFace } from './createFace';
import { findAvatarBones } from './findAvatarBones';

const MODEL_HEIGHT = 1.75;

const findSkinnedMesh = (model) => {
  let mesh;
  model.traverse((object) => {
    if (object.isSkinnedMesh) mesh = object;
  });
  return mesh;
};

export const loadAvatar = async (loader, url) => {
  const { scene: model } = await loader.loadAsync(url);
  const size = new Box3().setFromObject(model).getSize(new Vector3());
  model.scale.setScalar(MODEL_HEIGHT / size.y);

  const mesh = findSkinnedMesh(model);
  // the rest pose bounds don't cover raised arms
  mesh.frustumCulled = false;
  const bones = findAvatarBones(model);
  const poser = createBonePoser(model, mesh.skeleton.bones);
  const updateFace = createFace(mesh.material);

  const pose = ({ seconds, frames, look, isBreathing }) => {
    poser.resetPose();
    if (isBreathing) applyIdle(poser, bones, seconds);
    applyGestures(poser, bones, frames);
    applyLook(poser, bones, look, getGazeStrength(frames));
    updateFace(seconds, getEyesClosed(frames));
  };

  return { model, bones, poser, pose };
};
