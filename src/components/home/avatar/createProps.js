import { Group, MathUtils } from 'three';
import { GESTURES, getGestureWeight } from './animations/gestureLibrary';
import { getPropPose } from './animations/props/holdProp';

const OVERSHOOT = 1.7;
const HANDS_IN_PLACE = 0.75;

export const getPopScale = (weight) => {
  const t = MathUtils.smootherstep(weight, HANDS_IN_PLACE, 1) - 1;
  return 1 + (OVERSHOOT + 1) * t ** 3 + OVERSHOOT * t ** 2;
};

// a missing prop shouldn't take the whole avatar down
const loadProp = async (loader, gesture, prop) => {
  try {
    const { scene } = await loader.loadAsync(prop.url);
    scene.visible = false;
    return { gesture, prop, object: scene };
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

  const update = (frames, poser, chest) => {
    props.forEach((prop) => placeProp(prop, getGestureWeight(frames, prop.gesture), poser, chest));
  };

  return { object, update };
};
