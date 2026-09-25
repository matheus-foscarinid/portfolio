import { AXIS, WRIST_DRAG, bendWrist, getLeftArm, getSoftBeat, mirror, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseWave = (poser, { head, chest, arms }, { progress, weight }) => {
  const arm = getLeftArm(arms);
  const swing = getSoftBeat(progress, 2.5, weight) * 0.35;
  poser.rotate(chest, AXIS.z, arm.side * 0.04 * weight);
  poser.rotate(head, AXIS.z, arm.side * (0.08 + swing * 0.1) * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.5, -0.3, 0.8), forearm: mirror(arm.side, 0.1 + swing, 1, 0.1), weight });
  bendWrist(poser, arm, getSoftBeat(progress, 2.5, weight, -WRIST_DRAG) * 0.25);
};

export const gesture = defineGesture({
  name: 'wave',
  duration: 2.6,
  blendIn: 0.22,
  blendOut: 0.2,
  pose: poseWave,
});
