import { AXIS, WRIST_DRAG, bendWrist, curlFingers, getSoftBeat, mirror, poseArm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseDance = (poser, { spine, chest, head, arms }, { progress, weight }) => {
  const beat = getSoftBeat(progress, 5, weight);
  const bounce = Math.abs(getSoftBeat(progress, 5, weight));
  poser.rotate(spine, AXIS.z, beat * 0.1);
  poser.rotate(chest, AXIS.z, -beat * 0.05);
  poser.rotate(chest, AXIS.x, bounce * 0.06);
  poser.rotate(head, AXIS.z, getSoftBeat(progress, 5, weight, Math.PI / 2) * 0.1);
  poser.rotate(head, AXIS.x, bounce * 0.06);
  arms.forEach((arm) => {
    const pump = getSoftBeat(progress, 5, weight, (arm.side * Math.PI) / 2) * 0.3;
    poseArm(poser, arm, { elbow: mirror(arm.side, 0.4, -0.7, 0.5), forearm: mirror(arm.side, 0.1, 0.35 + pump, 0.9), weight });
    bendWrist(poser, arm, getSoftBeat(progress, 5, weight, (arm.side * Math.PI) / 2 - WRIST_DRAG) * 0.2);
    curlFingers(poser, arm, weight);
  });
};

export const gesture = defineGesture({
  name: 'dance',
  duration: 3.2,
  blendIn: 0.12,
  blendOut: 0.14,
  holdsGaze: true,
  pools: ['reaction'],
  pose: poseDance,
});
