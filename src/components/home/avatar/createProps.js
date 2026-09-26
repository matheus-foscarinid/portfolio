import { Group, MathUtils, Vector3 } from 'three';
import { GESTURES, getGestureWeight } from './animations/gestureLibrary';
import { getPropPose } from './animations/props/holdProp';
import { createFace } from './createFace';

const OVERSHOOT = 1.7;
const HANDS_IN_PLACE = 0.75;

export const getPopScale = (weight) => {
  const t = MathUtils.smootherstep(weight, HANDS_IN_PLACE, 1) - 1;
  return 1 + (OVERSHOOT + 1) * t ** 3 + OVERSHOOT * t ** 2;
};

const findMesh = (scene) => {
  let mesh;
  scene.traverse((object) => {
    if (object.isMesh) mesh = object;
  });
  return mesh;
};

// the shader sees the mesh's quantized positions, not the model's units
const toMeshSpace = (mesh, { centers, halfSize, lidColors }) => {
  const toMesh = mesh.matrixWorld.clone().invert();
  return {
    centers: centers.map((center) => center.clone().applyMatrix4(toMesh)),
    halfSize: halfSize.clone().divide(mesh.getWorldScale(new Vector3())),
    lidColors,
  };
};

const createBlink = (scene, eyes) => {
  if (!eyes) return () => {};
  scene.updateMatrixWorld(true);
  const mesh = findMesh(scene);
  return createFace(mesh.material, toMeshSpace(mesh, eyes));
};

// a missing prop shouldn't take the whole avatar down
const loadProp = async (loader, gesture, prop) => {
  try {
    const { scene } = await loader.loadAsync(prop.url);
    scene.visible = false;
    return { gesture, prop, object: scene, blink: createBlink(scene, prop.eyes) };
  } catch {
    return null;
  }
};

const loadAllProps = (loader, gestures) =>
  Promise.all(gestures.flatMap(({ name, props }) => props.map((prop) => loadProp(loader, name, prop))));

const placeProp = ({ prop, object }, weight, poser, chest) => {
  object.visible = getPopScale(weight) > 0.01;
  if (!object.visible) return;
  const { position, quaternion } = getPropPose(poser, chest, prop);
  object.position.copy(position);
  object.quaternion.copy(quaternion);
  object.scale.setScalar(getPopScale(weight) * prop.scale);
};

export const createProps = async (loader, gestures = Object.values(GESTURES)) => {
  const props = (await loadAllProps(loader, gestures)).filter(Boolean);
  const object = new Group();
  props.forEach((prop) => object.add(prop.object));

  const update = (frames, poser, chest, seconds) => {
    props.forEach((prop) => {
      placeProp(prop, getGestureWeight(frames, prop.gesture), poser, chest);
      if (prop.object.visible) prop.blink(seconds);
    });
  };

  return { object, update };
};
