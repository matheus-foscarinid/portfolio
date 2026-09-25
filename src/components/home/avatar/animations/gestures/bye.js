import { AXIS, WRIST_DRAG, bendWrist, getRightArm, getSoftBeat, mirror, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseBye = (poser, { head, arms }, { progress, weight }) => {
  const arm = getRightArm(arms);
  const swing = getSoftBeat(progress, 2, weight) * 0.35;
  poser.rotate(head, AXIS.z, arm.side * 0.06 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.35, -0.75, 0.55), forearm: mirror(arm.side, swing, 0.85, 0.55), weight });
  bendWrist(poser, arm, getSoftBeat(progress, 2, weight, -WRIST_DRAG) * 0.25);
};

export const gesture = defineGesture({
  name: 'bye',
  duration: 1.8,
  blendIn: 0.22,
  blendOut: 0.25,
  pose: poseBye,
});
