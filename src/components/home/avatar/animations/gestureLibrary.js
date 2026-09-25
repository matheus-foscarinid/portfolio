import { MathUtils, Vector3 } from 'three';
import {
  AXIS,
  curlFingers,
  getBeat,
  getLeftArm,
  getRightArm,
  mirror,
  poseArm,
  twistForearm,
} from './poseHelpers';

// the forearm starts bent up and straightens into the poke
const TAP_WINDUP = new Vector3(0, 0.7, 0);
const PALMS_UP = 1.5;

const poseWave = (poser, { head, chest, arms }, { progress, weight }) => {
  const arm = getRightArm(arms);
  const swing = getBeat(progress, 3) * 0.35;
  poser.rotate(chest, AXIS.z, arm.side * 0.04 * weight);
  poser.rotate(head, AXIS.z, arm.side * 0.1 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.5, -0.3, 0.8), forearm: mirror(arm.side, 0.1 + swing, 1, 0.1), weight });
};

const poseBye = (poser, { head, arms }, { progress, weight }) => {
  const arm = getRightArm(arms);
  const swing = getBeat(progress, 2.5) * 0.35;
  poser.rotate(head, AXIS.z, arm.side * 0.06 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.35, -0.75, 0.55), forearm: mirror(arm.side, swing, 0.85, 0.55), weight });
};

// the elbow stays low and in front, where the fused armpit doesn't stretch
const getTapElbow = (direction) => new Vector3(direction.x * 0.5, Math.min(direction.y - 0.6, -0.2), direction.z + 0.4);

const poseTap = (poser, { chest }, { progress, weight, arm, direction }) => {
  const poke = MathUtils.smoothstep(progress, 0.3, 0.45) * (1 - MathUtils.smoothstep(progress, 0.5, 0.65));
  poser.rotate(chest, AXIS.y, Math.atan2(direction.x, direction.z) * 0.3 * weight);
  poser.rotate(chest, AXIS.x, poke * 0.05 * weight);
  poseArm(poser, arm, {
    elbow: getTapElbow(direction),
    forearm: direction.clone().add(TAP_WINDUP).lerp(direction, poke),
    weight,
  });
  curlFingers(poser, arm, weight);
};

const poseNod = (poser, { neck, head }, { progress, weight }) => {
  const dip = Math.max(0, getBeat(progress, 2)) * weight;
  poser.rotate(neck, AXIS.x, dip * 0.15);
  poser.rotate(head, AXIS.x, dip * 0.3);
};

const poseDance = (poser, { spine, chest, head, arms }, { progress, weight }) => {
  const beat = getBeat(progress, 6);
  poser.rotate(spine, AXIS.z, beat * 0.1 * weight);
  poser.rotate(chest, AXIS.z, -beat * 0.05 * weight);
  poser.rotate(chest, AXIS.x, Math.abs(beat) * 0.06 * weight);
  poser.rotate(head, AXIS.z, getBeat(progress, 6, Math.PI / 2) * 0.1 * weight);
  poser.rotate(head, AXIS.x, Math.abs(getBeat(progress, 6)) * 0.08 * weight);
  arms.forEach((arm) => {
    const pump = getBeat(progress, 6, (arm.side * Math.PI) / 2) * 0.3;
    poseArm(poser, arm, { elbow: mirror(arm.side, 0.4, -0.7, 0.5), forearm: mirror(arm.side, 0.1, 0.35 + pump, 0.9), weight });
    curlFingers(poser, arm, weight);
  });
};

const poseLaugh = (poser, { chest, head, arms }, { progress, weight }) => {
  const shake = Math.abs(getBeat(progress, 7));
  poser.rotate(chest, AXIS.x, (-0.03 + shake * 0.02) * weight);
  poser.rotate(head, AXIS.x, (-0.1 + shake * 0.03) * weight);
  poser.rotate(head, AXIS.z, 0.06 * weight);
  arms.forEach((arm) => poser.rotate(arm.shoulder, AXIS.z, arm.side * shake * 0.025 * weight));
  const arm = getRightArm(arms);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.25, -1, 0.25), forearm: mirror(arm.side, -0.9, 0.05, 0.5), weight: weight * 0.6 });
};

const poseShrug = (poser, { head, arms }, { weight }) => {
  poser.rotate(head, AXIS.z, 0.15 * weight);
  arms.forEach((arm) => {
    poser.rotate(arm.shoulder, AXIS.z, arm.side * 0.3 * weight);
    poseArm(poser, arm, { elbow: mirror(arm.side, 0.3, -1, 0.1), forearm: mirror(arm.side, 0.75, 0.05, 0.65), weight });
    twistForearm(poser, arm, PALMS_UP * weight);
  });
};

const poseFistPump = (poser, { chest, head, arms }, { progress, weight }) => {
  const arm = getLeftArm(arms);
  // two quick pulls down, like a "yes!"
  const pull = Math.max(0, getBeat(progress, 2.5)) * weight;
  poser.rotate(chest, AXIS.x, pull * 0.08);
  poser.rotate(head, AXIS.x, pull * 0.1);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.35, -0.6, 0.7), forearm: mirror(arm.side, 0.1, 0.9 - pull * 0.9, 0.7), weight });
  curlFingers(poser, arm, weight);
};

const poseThink = (poser, { head, neck, arms }, { weight }) => {
  const arm = getRightArm(arms);
  poser.rotate(neck, AXIS.x, 0.08 * weight);
  poser.rotate(head, AXIS.z, -arm.side * 0.12 * weight);
  poser.rotate(head, AXIS.y, arm.side * 0.2 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.15, -0.9, 0.55), forearm: mirror(arm.side, -0.3, 1, 0.3), weight });
  curlFingers(poser, arm, weight * 0.8);
};

const poseLookAround = (poser, { neck, head }, { progress, weight }) => {
  const turn = getBeat(progress, 1) * weight;
  poser.rotate(neck, AXIS.y, turn * 0.25);
  poser.rotate(head, AXIS.y, turn * 0.4);
  poser.rotate(head, AXIS.x, -Math.abs(turn) * 0.08);
};

const poseCheckWatch = (poser, { neck, head, arms }, { weight }) => {
  const arm = getLeftArm(arms);
  poser.rotate(neck, AXIS.x, 0.25 * weight);
  poser.rotate(head, AXIS.x, 0.25 * weight);
  poser.rotate(head, AXIS.y, arm.side * 0.3 * weight);
  poseArm(poser, arm, { elbow: mirror(arm.side, 0.25, -0.8, 0.5), forearm: mirror(arm.side, -0.75, 0.35, 0.55), weight });
};

// rise and fall are the share of each gesture spent easing in and out.
// holdsGaze means the gesture moves the head itself, so cursor tracking lets go
export const GESTURES = {
  wave: { duration: 2.4, rise: 0.2, fall: 0.8, pose: poseWave },
  bye: { duration: 1.6, rise: 0.2, fall: 0.75, pose: poseBye },
  tap: { duration: 1, rise: 0.35, fall: 0.6, pose: poseTap },
  nod: { duration: 1, rise: 0.15, fall: 0.85, holdsGaze: true, pose: poseNod },
  dance: { duration: 3.2, rise: 0.1, fall: 0.88, holdsGaze: true, pose: poseDance },
  laugh: { duration: 2, rise: 0.15, fall: 0.8, holdsGaze: true, pose: poseLaugh },
  shrug: { duration: 1.6, rise: 0.3, fall: 0.7, holdsGaze: true, pose: poseShrug },
  fistPump: { duration: 1.6, rise: 0.2, fall: 0.8, pose: poseFistPump },
  think: { duration: 2.6, rise: 0.25, fall: 0.8, holdsGaze: true, pose: poseThink },
  lookAround: { duration: 3, rise: 0.15, fall: 0.85, holdsGaze: true, pose: poseLookAround },
  checkWatch: { duration: 2.4, rise: 0.25, fall: 0.8, holdsGaze: true, pose: poseCheckWatch },
};

export const REACTIONS = ['dance', 'laugh', 'shrug', 'fistPump', 'think'];
export const FIDGETS = ['lookAround', 'checkWatch'];

export const applyGestures = (poser, bones, frames) => {
  frames.forEach((frame) => GESTURES[frame.name].pose(poser, bones, frame));
};

export const getGazeStrength = (frames) =>
  frames.reduce((strength, frame) => (GESTURES[frame.name].holdsGaze ? strength * (1 - frame.weight) : strength), 1);
