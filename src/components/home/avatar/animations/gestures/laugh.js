import { AXIS, curlFingers, getRightArm, getSoftBeat, mirror, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseLaugh = (poser, { spine, chest, neck, head, arms }, { progress, weight }) => {
  const bounce = Math.abs(getSoftBeat(progress, 5, weight)) * (1 - progress * 0.5);
  poser.rotate(spine, AXIS.x, (0.05 + bounce * 0.03) * weight);
  poser.rotate(chest, AXIS.x, (0.08 + bounce * 0.06) * weight);
  poser.rotate(neck, AXIS.x, bounce * 0.06);
  poser.rotate(head, AXIS.x, (0.1 + bounce * 0.08) * weight);
  poser.rotate(head, AXIS.z, 0.12 * weight);
  arms.forEach((arm) => poser.rotate(arm.shoulder, AXIS.z, arm.side * bounce * 0.14));
  const arm = getRightArm(arms);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.15, -1, 0.35), forearm: mirror(arm.side, -0.95, 0.05, 0.45), weight: weight * 0.8 });
  curlFingers(poser, arm, weight * 0.3);
};

export const gesture = defineGesture({
  name: 'laugh',
  duration: 2.2,
  blendIn: 0.12,
  blendOut: 0.2,
  holdsGaze: true,
  closesEyes: 1,
  pools: ['reaction'],
  pose: poseLaugh,
});
