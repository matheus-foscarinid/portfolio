import { MathUtils } from 'three';
import { AXIS, PALMS_UP, mirror, poseArm, twistForearm } from '../pose';
import { defineGesture } from '../defineGesture';

const poseShrug = (poser, { head, chest, arms }, { progress, weight }) => {
  const lift = MathUtils.smootherstep(progress, 0.15, 0.4) * (1 - MathUtils.smootherstep(progress, 0.6, 0.9));
  poser.rotate(head, AXIS.z, 0.15 * weight);
  poser.rotate(chest, AXIS.x, -0.03 * weight);
  arms.forEach((arm) => {
    poser.rotate(arm.shoulder, AXIS.z, arm.side * (0.12 + lift * 0.2) * weight);
    poseArm(poser, arm, { elbow: mirror(arm.side, 0.3, -1, 0.1), forearm: mirror(arm.side, 0.75, 0.05, 0.65), weight });
    twistForearm(poser, arm, PALMS_UP * weight);
  });
};

export const gesture = defineGesture({
  name: 'shrug',
  duration: 1.8,
  blendIn: 0.25,
  blendOut: 0.25,
  holdsGaze: true,
  pools: ['reaction'],
  pose: poseShrug,
});
