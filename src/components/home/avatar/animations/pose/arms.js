import { MathUtils, Vector3 } from 'three';
import { AXIS } from './axis';

export const PALMS_UP = -1.5;
export const WRIST_DRAG = 0.9;
// the collarbone lifts with the arm, or the sleeve pinches at the armpit
const SHOULDER_LIFT = 0.35;

// the model faces the camera, so its right arm is the one on the screen's left
export const getRightArm = (arms) => arms.find((arm) => arm.side < 0);
export const getLeftArm = (arms) => arms.find((arm) => arm.side > 0);

// directions are written for the left arm and mirrored for the right
export const mirror = (side, x, y, z) => new Vector3(side * x, y, z);

const getLead = (weight) => Math.sin((weight * Math.PI) / 2);
const getTrail = (weight) => weight * weight;

export const poseArm = (poser, arm, { elbow, forearm, weight }) => {
  const lift = MathUtils.clamp(elbow.clone().normalize().y + 0.6, 0, 1);
  poser.rotate(arm.shoulder, AXIS.z, arm.side * SHOULDER_LIFT * lift * getLead(weight));
  poser.aim(arm.arm, arm.foreArm, elbow, getLead(weight));
  poser.aim(arm.foreArm, arm.hand, forearm, weight);
  poser.aim(arm.hand, arm.middleBase, forearm, getTrail(weight));
};

export const bendWrist = (poser, arm, angle) => {
  poser.rotate(arm.hand, poser.getModelAxis(arm.pinkyBase, arm.indexBase), arm.side * angle);
};

export const twistForearm = (poser, arm, angle) => {
  poser.rotate(arm.foreArm, poser.getModelAxis(arm.foreArm, arm.hand), arm.side * angle);
};
