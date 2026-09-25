import { MathUtils, Vector3 } from 'three';

export const AXIS = { x: new Vector3(1, 0, 0), y: new Vector3(0, 1, 0), z: new Vector3(0, 0, 1) };
// the collarbone lifts with the arm, or the sleeve pinches at the armpit
const SHOULDER_LIFT = 0.35;
const FINGER_CURL = 1.1;

// directions are written for the arm on the model's +x side and mirrored for the other
export const mirror = (side, x, y, z) => new Vector3(side * x, y, z);

export const getBeat = (progress, count, offset = 0) => Math.sin(progress * count * Math.PI * 2 + offset);

// the model faces the camera, so its right arm is the one on the screen's left
export const getRightArm = (arms) => arms.find((arm) => arm.side < 0);
export const getLeftArm = (arms) => arms.find((arm) => arm.side > 0);

export const poseArm = (poser, arm, { elbow, forearm, weight }) => {
  const lift = MathUtils.clamp(elbow.clone().normalize().y + 0.6, 0, 1);
  poser.rotate(arm.shoulder, AXIS.z, arm.side * SHOULDER_LIFT * lift * weight);
  poser.aim(arm.arm, arm.foreArm, elbow, weight);
  poser.aim(arm.foreArm, arm.hand, forearm, weight);
  poser.aim(arm.hand, arm.middleBase, forearm, weight);
};

export const curlFingers = (poser, arm, amount) => {
  const knuckles = poser.getModelAxis(arm.pinkyBase, arm.indexBase);
  arm.curledFingers.forEach((finger) => poser.rotate(finger, knuckles, -arm.side * FINGER_CURL * amount));
};

export const twistForearm = (poser, arm, angle) => {
  poser.rotate(arm.foreArm, poser.getModelAxis(arm.foreArm, arm.hand), arm.side * angle);
};
