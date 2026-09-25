import { Vector3 } from 'three';
import { AXIS, curlFingers, getLeftArm, getRightArm, getSoftBeat, tapFingers } from '../pose';
import { defineGesture } from '../defineGesture';
import { holdProp } from '../props/holdProp';
import { laptop } from '../props/laptop';

const TYPING_BEATS = 18;

const poseTypeOnLaptop = (poser, bones, { progress, weight }) => {
  const peck = Math.abs(getSoftBeat(progress, TYPING_BEATS, weight));
  poser.rotate(bones.chest, AXIS.x, 0.06 * weight);
  poser.rotate(bones.neck, AXIS.x, 0.2 * weight);
  poser.rotate(bones.head, AXIS.x, (0.3 + peck * 0.02) * weight);
  holdProp(poser, bones, laptop, weight, { left: new Vector3(0, peck * 0.012, 0) });
  tapFingers(poser, getLeftArm(bones.arms), { progress, weight, beats: TYPING_BEATS });
  curlFingers(poser, getRightArm(bones.arms), 0.15 * weight);
};

export const gesture = defineGesture({
  name: 'typeOnLaptop',
  duration: 8,
  blendIn: 0.1,
  blendOut: 0.1,
  holdsGaze: true,
  props: [laptop],
  pools: ['reaction', 'pastime'],
  pose: poseTypeOnLaptop,
});
