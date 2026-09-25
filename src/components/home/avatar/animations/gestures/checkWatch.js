import { MathUtils } from 'three';
import { AXIS, getLeftArm, mirror, poseArm, twistForearm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseCheckWatch = (poser, { neck, head, arms }, { progress, weight }) => {
  const arm = getLeftArm(arms);
  const turn = MathUtils.smootherstep(progress, 0.25, 0.45) * weight;
  poser.rotate(neck, AXIS.x, 0.25 * weight);
  poser.rotate(head, AXIS.x, 0.25 * weight);
  poser.rotate(head, AXIS.y, arm.side * 0.3 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.25, -0.8, 0.5), forearm: mirror(arm.side, -0.75, 0.35, 0.55), weight });
  twistForearm(poser, arm, -0.5 * turn);
};

export const gesture = defineGesture({
  name: 'checkWatch',
  duration: 2.4,
  blendIn: 0.25,
  blendOut: 0.2,
  holdsGaze: true,
  pools: ['fidget'],
  pose: poseCheckWatch,
});
