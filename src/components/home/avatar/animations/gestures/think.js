import { Vector3 } from 'three';
import { AXIS, curlFingers, getRightArm, getSoftBeat, reachHand } from '../pose';
import { defineGesture } from '../defineGesture';

const getCheekGrip = (poser, head, side) => ({
  palmAt: head.getWorldPosition(new Vector3()).add(new Vector3(side * 0.08, -0.05, 0.05).applyQuaternion(poser.getModelRotation())),
  palm: new Vector3(-side, 0.2, -0.4).normalize(),
  fingers: new Vector3(side * 0.1, 1, 0.25).normalize(),
  pole: new Vector3(side * 0.2, -1, 0.3).normalize(),
});

const poseThink = (poser, { head, neck, arms }, { progress, weight }) => {
  const arm = getRightArm(arms);
  const ponder = getSoftBeat(progress, 1, weight) * 0.05;
  poser.rotate(neck, AXIS.x, 0.08 * weight);
  poser.rotate(head, AXIS.z, -arm.side * (0.12 + ponder) * weight);
  poser.rotate(head, AXIS.y, arm.side * 0.2 * weight);
  reachHand(poser, arm, getCheekGrip(poser, head, arm.side), weight);
  curlFingers(poser, arm, weight * 0.3);
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
