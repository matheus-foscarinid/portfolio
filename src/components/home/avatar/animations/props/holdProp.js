import { Quaternion, Vector3 } from 'three';
import { AXIS, reachHand } from '../pose';

export const getPropPose = (poser, chest, { offsetFromChest, turn, tilt }) => {
  const rotation = poser.getModelRotation();
  return {
    position: chest.getWorldPosition(new Vector3()).add(offsetFromChest.clone().applyQuaternion(rotation)),
    quaternion: rotation
      .multiply(new Quaternion().setFromAxisAngle(AXIS.y, turn))
      .multiply(new Quaternion().setFromAxisAngle(AXIS.x, tilt)),
  };
};

export const getGripTarget = (poser, propPose, grip, nudge = new Vector3()) => {
  const toModel = (direction) => poser.toModelDirection(direction.clone().applyQuaternion(propPose.quaternion));
  return {
    palmAt: grip.palmAt.clone().add(nudge).applyQuaternion(propPose.quaternion).add(propPose.position),
    palm: toModel(grip.palm),
    fingers: toModel(grip.fingers),
    pole: grip.pole,
  };
};

export const holdProp = (poser, { chest, arms }, prop, weight, nudges = {}) => {
  const propPose = getPropPose(poser, chest, prop);
  arms.forEach((arm) => {
    const hand = arm.side > 0 ? 'left' : 'right';
    const grip = prop.grips[hand];
    if (grip) reachHand(poser, arm, getGripTarget(poser, propPose, grip, nudges[hand]), weight);
  });
};
