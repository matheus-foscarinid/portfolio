import { getBeat } from './timing';

const FINGER_CURL = 1.1;
const JOINTS_PER_FINGER = 3;
const TAP_PHASE = 2.3;

const groupByFinger = (joints) =>
  Array.from({ length: joints.length / JOINTS_PER_FINGER }, (_, finger) =>
    joints.slice(finger * JOINTS_PER_FINGER, (finger + 1) * JOINTS_PER_FINGER));

const getKnuckleAxis = (poser, arm) => poser.getModelAxis(arm.pinkyBase, arm.indexBase);

export const curlFingers = (poser, arm, amount) => {
  const knuckles = getKnuckleAxis(poser, arm);
  arm.curledFingers.forEach((joint) => poser.rotate(joint, knuckles, -arm.side * FINGER_CURL * amount));
};

export const tapFingers = (poser, arm, { progress, weight, beats }) => {
  const knuckles = getKnuckleAxis(poser, arm);
  const fingers = [[arm.indexBase], ...groupByFinger(arm.curledFingers)];
  fingers.forEach((joints, finger) => {
    const tap = Math.max(0, getBeat(progress, beats, finger * TAP_PHASE)) ** 3;
    joints.forEach((joint) => poser.rotate(joint, knuckles, -arm.side * (0.25 + tap * 0.5) * weight));
  });
};

export const pressThumb = (poser, arm, amount) => {
  const palmAxis = poser.getModelAxis(arm.hand, arm.middleBase);
  arm.thumb.forEach((joint) => poser.rotate(joint, palmAxis, arm.side * amount));
};
