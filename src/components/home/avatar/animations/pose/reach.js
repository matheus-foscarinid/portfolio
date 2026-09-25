import { MathUtils, Vector3 } from 'three';

const WRIST_BEHIND_PALM = 0.02;
// the forearm takes most of the turn so the wrist doesn't wring
const FOREARM_TWIST = 0.6;

const getWorldPosition = (bone) => bone.getWorldPosition(new Vector3());

const getWristTarget = (poser, arm, { palmAt, palm, fingers }) => {
  const handLength = getWorldPosition(arm.hand).distanceTo(getWorldPosition(arm.middleBase));
  return palmAt.clone()
    .addScaledVector(poser.toWorldDirection(fingers), -handLength / 2)
    .addScaledVector(poser.toWorldDirection(palm), -WRIST_BEHIND_PALM);
};

const getElbowTarget = ([shoulder, elbow, wrist], target, pole) => {
  const [upper, lower] = [shoulder.distanceTo(elbow), elbow.distanceTo(wrist)];
  const toTarget = target.clone().sub(shoulder);
  const reach = MathUtils.clamp(toTarget.length(), Math.abs(upper - lower) + 1e-4, upper + lower - 1e-4);
  const direction = toTarget.normalize();
  const along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  const bend = pole.clone().addScaledVector(direction, -pole.dot(direction)).normalize();
  return shoulder.clone().addScaledVector(direction, along).addScaledVector(bend, Math.sqrt(upper * upper - along * along));
};

const getPalmTwist = (poser, arm, palm) => {
  const along = poser.getModelAxis(arm.hand, arm.middleBase);
  const across = poser.getModelAxis(arm.pinkyBase, arm.indexBase);
  const current = along.clone().cross(across).multiplyScalar(arm.side).normalize();
  const wanted = palm.clone().addScaledVector(along, -palm.dot(along));
  return { axis: along, angle: Math.atan2(current.clone().cross(wanted).dot(along), current.dot(wanted)) };
};

const orientHand = (poser, arm, { palm, fingers }, weight) => {
  poser.aim(arm.hand, arm.middleBase, fingers, weight);
  const forearmAxis = poser.getModelAxis(arm.foreArm, arm.hand);
  poser.rotate(arm.foreArm, forearmAxis, getPalmTwist(poser, arm, palm).angle * FOREARM_TWIST * weight);
  poser.aim(arm.hand, arm.middleBase, fingers, weight);
  const { axis, angle } = getPalmTwist(poser, arm, palm);
  poser.rotate(arm.hand, axis, angle * weight);
};

// palmAt is in world space. the directions are in model space
export const reachHand = (poser, arm, grip, weight) => {
  if (weight <= 0) return;
  const wrist = getWristTarget(poser, arm, grip);
  const joints = [arm.arm, arm.foreArm, arm.hand].map(getWorldPosition);
  const elbow = getElbowTarget(joints, wrist, poser.toWorldDirection(grip.pole));
  poser.aim(arm.arm, arm.foreArm, poser.toModelDirection(elbow.sub(joints[0])), weight);
  poser.aim(arm.foreArm, arm.hand, poser.toModelDirection(wrist.sub(getWorldPosition(arm.foreArm))), weight);
  orientHand(poser, arm, grip, weight);
};
