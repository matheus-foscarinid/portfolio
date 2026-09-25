import { AXIS, curlFingers, getBeat, getSoftBeat, pressThumb } from '../pose';
import { defineGesture } from '../defineGesture';
import { holdProp } from '../props/holdProp';
import { controller } from '../props/controller';

const THUMB_BEATS = 24;

const posePlayGame = (poser, bones, { progress, weight }) => {
  const dodge = getSoftBeat(progress, 3, weight) * getSoftBeat(progress, 7, weight);
  poser.rotate(bones.spine, AXIS.z, dodge * 0.08);
  poser.rotate(bones.chest, AXIS.x, 0.08 * weight);
  poser.rotate(bones.neck, AXIS.x, 0.2 * weight);
  poser.rotate(bones.head, AXIS.x, 0.25 * weight);
  poser.rotate(bones.head, AXIS.z, -dodge * 0.06);
  holdProp(poser, bones, controller, weight);
  bones.arms.forEach((arm) => {
    curlFingers(poser, arm, 0.8 * weight);
    pressThumb(poser, arm, Math.max(0, getBeat(progress, THUMB_BEATS, arm.side * 1.3)) * 0.4 * weight);
  });
};

export const gesture = defineGesture({
  name: 'playGame',
  duration: 8,
  blendIn: 0.1,
  blendOut: 0.1,
  holdsGaze: true,
  props: [controller],
  pools: ['reaction', 'pastime'],
  pose: posePlayGame,
});
