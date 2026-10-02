import { Vector3 } from 'three';
import { createAvatarActions } from './animations/createAvatarActions';
import { createGesturePlayer } from './animations/createGesturePlayer';
import { createGestureTriggers } from './animations/createGestureTriggers';
import { GESTURES } from './animations/gestureLibrary';
import { createDragRotation } from './createPointerControls';
import { getScreenPosition } from './screenSpace';

// how far in front of the shoulder a clicked element is imagined, in css px
const TAP_DEPTH = 400;

const getTapTarget = (point, { arms }, camera, rect, poser) => {
  const reaches = arms.map((arm) => ({ arm, origin: getScreenPosition(arm.arm, camera, rect) }));
  const { arm, origin } = reaches.reduce((closest, reach) =>
    Math.abs(reach.origin.x - point.x) < Math.abs(closest.origin.x - point.x) ? reach : closest);
  const direction = new Vector3(point.x - origin.x, origin.y - point.y, TAP_DEPTH).normalize();
  return { arm, direction: poser.toModelDirection(direction) };
};

// a menu drawn over the avatar hides any gesture, so it shouldn't play one
const isCanvasUncovered = (canvas, rect) =>
  document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) === canvas;

export const createGestureControls = ({ canvas, getCanvasRect, avatar, camera, isReducedMotion }) => {
  const player = createGesturePlayer(GESTURES);
  let isRunning = false;
  const isActive = () => isRunning && !isReducedMotion;
  const actions = createAvatarActions({
    player,
    isActive,
    isEnabled: () => isActive() && isCanvasUncovered(canvas, getCanvasRect()),
    getTapTarget: (point) => getTapTarget(point, avatar.bones, camera, getCanvasRect(), avatar.poser),
  });
  const triggers = createGestureTriggers({ actions });
  const drag = createDragRotation(canvas, { onTap: actions.react });

  return {
    player,
    actions,
    drag,
    setRunning: (value) => { isRunning = value; },
    dispose: () => {
      triggers.dispose();
      drag.dispose();
    },
  };
};
