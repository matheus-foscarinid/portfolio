import { MathUtils, Vector3 } from 'three';
import { AXIS, curlFingers, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const TAP_WINDUP = new Vector3(0, 0.7, 0);

// the elbow stays low and in front, where the fused armpit doesn't stretch
const getTapElbow = (direction) => new Vector3(direction.x * 0.5, Math.min(direction.y - 0.6, -0.2), direction.z + 0.4);

const poseTap = (poser, { chest }, { progress, weight, arm, direction }) => {
  const poke = MathUtils.smootherstep(progress, 0.3, 0.45) * (1 - MathUtils.smootherstep(progress, 0.5, 0.7));
  poser.rotate(chest, AXIS.y, Math.atan2(direction.x, direction.z) * 0.3 * weight);
  poser.rotate(chest, AXIS.x, poke * 0.05 * weight);
  poseArm(poser, arm, {
    elbow: getTapElbow(direction),
    forearm: direction.clone().add(TAP_WINDUP).lerp(direction, poke),
    weight,
  });
  curlFingers(poser, arm, weight);
};

export const gesture = defineGesture({
  name: 'tap',
  duration: 1,
  blendIn: 0.35,
  blendOut: 0.35,
  needsTarget: true,
  pose: poseTap,
});
