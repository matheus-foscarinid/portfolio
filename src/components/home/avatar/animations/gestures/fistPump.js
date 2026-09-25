import { AXIS, curlFingers, getLeftArm, getSoftBeat, mirror, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseFistPump = (poser, { chest, head, arms }, { progress, weight }) => {
  const arm = getLeftArm(arms);
  const pull = Math.max(0, getSoftBeat(progress, 2, weight));
  poser.rotate(chest, AXIS.x, pull * 0.08);
  poser.rotate(head, AXIS.x, pull * 0.1);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.35, -0.6, 0.7), forearm: mirror(arm.side, 0.1, 0.9 - pull * 0.9, 0.7), weight });
  curlFingers(poser, arm, weight);
};

export const gesture = defineGesture({
  name: 'fistPump',
  duration: 1.6,
  blendIn: 0.2,
  blendOut: 0.2,
  pools: ['reaction'],
  pose: poseFistPump,
});
