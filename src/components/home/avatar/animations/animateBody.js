import { AXIS } from './pose';

const IDLE = {
  breathSpeed: 1.7,
  chestBreath: 0.015,
  shoulderBreath: 0.012,
  swaySpeed: 0.5,
  swayAngle: 0.012,
  armSwing: 0.035,
  armSpread: 0.03,
  armBreath: 0.012,
};
// how the look is shared down the neck, so looking down bends the body instead of folding the neck
const LOOK_SHARE = [
  { bone: 'chest', yaw: 0.25, pitch: 0.4 },
  { bone: 'neck', yaw: 0.35, pitch: 0.3 },
  { bone: 'head', yaw: 0.4, pitch: 0.3 },
];

export const applyIdle = (poser, { spine, chest, arms }, seconds) => {
  const breath = Math.sin(seconds * IDLE.breathSpeed);
  poser.rotate(spine, AXIS.z, Math.sin(seconds * IDLE.swaySpeed) * IDLE.swayAngle);
  poser.rotate(chest, AXIS.x, -breath * IDLE.chestBreath);

  const armSwing = Math.sin(seconds * IDLE.breathSpeed + 0.6) * IDLE.armSwing;
  const armSpread = IDLE.armSpread + breath * IDLE.armBreath;
  arms.forEach(({ shoulder, arm, side }) => {
    poser.rotate(shoulder, AXIS.z, side * breath * IDLE.shoulderBreath);
    poser.rotate(arm, AXIS.x, side * armSwing);
    poser.rotate(arm, AXIS.z, side * armSpread);
  });
};

// strength drops while a gesture is steering the head itself
export const applyLook = (poser, bones, look, strength = 1) => {
  LOOK_SHARE.forEach(({ bone, yaw, pitch }) => {
    poser.rotate(bones[bone], AXIS.y, look.yaw * yaw * strength);
    poser.rotate(bones[bone], AXIS.x, look.pitch * pitch * strength);
  });
};
