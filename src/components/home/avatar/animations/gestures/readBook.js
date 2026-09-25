import { AXIS, curlFingers, getSoftBeat } from '../pose';
import { defineGesture } from '../defineGesture';
import { holdProp } from '../props/holdProp';
import { book } from '../props/book';

const poseReadBook = (poser, bones, { progress, weight }) => {
  poser.rotate(bones.chest, AXIS.x, 0.04 * weight);
  poser.rotate(bones.neck, AXIS.x, 0.18 * weight);
  poser.rotate(bones.head, AXIS.x, 0.22 * weight);
  poser.rotate(bones.head, AXIS.y, getSoftBeat(progress, 4, weight) * 0.04);
  holdProp(poser, bones, book, weight);
  bones.arms.forEach((arm) => curlFingers(poser, arm, 0.45 * weight));
};

export const gesture = defineGesture({
  name: 'readBook',
  duration: 8,
  blendIn: 0.1,
  blendOut: 0.1,
  holdsGaze: true,
  props: [book],
  pools: ['reaction', 'pastime'],
  pose: poseReadBook,
});
