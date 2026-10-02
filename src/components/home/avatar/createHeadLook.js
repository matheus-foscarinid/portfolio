import { MathUtils } from 'three';
import { createCursorTracking } from './createPointerControls';
import { getScreenPosition } from './screenSpace';

// how far in front of the head the cursor is imagined, in css px. lower turns the head harder
const LOOK_DEPTH = 500;
const MAX_YAW = 0.7;
const MAX_PITCH = 0.3;
const LOOK_EASING = 0.08;
// in radians. the breathing alone keeps the look this far behind its target
const SETTLED_LAG = 0.01;
const FACING_FRONT = { yaw: 0, pitch: 0 };

export const getLookTarget = (cursor, origin) => ({
  yaw: MathUtils.clamp(Math.atan2(cursor.x - origin.x, LOOK_DEPTH), -MAX_YAW, MAX_YAW),
  pitch: MathUtils.clamp(Math.atan2(cursor.y - origin.y, LOOK_DEPTH), -MAX_PITCH, MAX_PITCH),
});

export const createHeadLook = ({ head, camera, getCanvasRect, isReducedMotion }) => {
  const { cursor, dispose } = createCursorTracking();
  const easing = isReducedMotion ? 1 : LOOK_EASING;
  const look = { yaw: 0, pitch: 0, isSettled: false };

  const getTarget = () =>
    cursor.x === null ? FACING_FRONT : getLookTarget(cursor, getScreenPosition(head, camera, getCanvasRect()));

  const update = () => {
    const target = getTarget();
    look.yaw += (target.yaw - look.yaw) * easing;
    look.pitch += (target.pitch - look.pitch) * easing;
    look.isSettled = Math.abs(target.yaw - look.yaw) < SETTLED_LAG && Math.abs(target.pitch - look.pitch) < SETTLED_LAG;
    return look;
  };

  return { update, dispose };
};
