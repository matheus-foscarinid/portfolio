import { Vector3 } from 'three';

// mixamo names with the ':' the loader strips out
const BONE_PREFIX = 'mixamorig';
const CURLED_FINGERS = ['Middle', 'Ring', 'Pinky'];
const FINGER_JOINTS = [1, 2, 3];

const createBoneFinder = (model) => (name) => {
  const bone = model.getObjectByName(`${BONE_PREFIX}${name}`);
  if (!bone) throw new Error(`avatar bone ${name} is missing`);
  return bone;
};

const getSideOf = (bone, model) => Math.sign(model.worldToLocal(bone.getWorldPosition(new Vector3())).x);

const findArmBones = (find, side) => ({
  shoulder: find(`${side}Shoulder`),
  arm: find(`${side}Arm`),
  foreArm: find(`${side}ForeArm`),
  hand: find(`${side}Hand`),
  indexBase: find(`${side}HandIndex1`),
  middleBase: find(`${side}HandMiddle1`),
  pinkyBase: find(`${side}HandPinky1`),
  thumb: [find(`${side}HandThumb2`), find(`${side}HandThumb3`)],
  curledFingers: CURLED_FINGERS.flatMap((finger) => FINGER_JOINTS.map((joint) => find(`${side}Hand${finger}${joint}`))),
});

export const findAvatarBones = (model) => {
  const find = createBoneFinder(model);
  model.updateMatrixWorld(true);
  const arms = [findArmBones(find, 'Left'), findArmBones(find, 'Right')];
  // +1 is the arm on the model's +x side, which shows on the right of the screen
  arms.forEach((arm) => { arm.side = getSideOf(arm.arm, model); });

  return {
    spine: find('Spine'),
    chest: find('Spine2'),
    neck: find('Neck'),
    head: find('Head'),
    arms,
  };
};
