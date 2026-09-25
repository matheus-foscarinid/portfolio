import { AXIS, curlFingers, getRightArm, getSoftBeat, mirror, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseThink = (poser, { head, neck, arms }, { progress, weight }) => {
  const arm = getRightArm(arms);
  const ponder = getSoftBeat(progress, 1, weight) * 0.05;
  poser.rotate(neck, AXIS.x, 0.08 * weight);
  poser.rotate(head, AXIS.z, -arm.side * (0.12 + ponder) * weight);
  poser.rotate(head, AXIS.y, arm.side * 0.2 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.15, -0.9, 0.55), forearm: mirror(arm.side, -0.3, 1, 0.3), weight });
  curlFingers(poser, arm, weight * 0.8);
};

export const gesture = defineGesture({
  name: 'think',
  duration: 2.6,
  blendIn: 0.25,
  blendOut: 0.2,
  holdsGaze: true,
  pools: ['reaction'],
  pose: poseThink,
});
