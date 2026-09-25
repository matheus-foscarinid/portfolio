import { AXIS, curlFingers, getSoftBeat } from '../pose';
import { defineGesture } from '../defineGesture';
import { croquete, sushi } from '../props/cats';
import { holdProp } from '../props/holdProp';

const poseHugCats = (poser, bones, { progress, weight }) => {
  const nuzzle = getSoftBeat(progress, 1.5, weight);
  poser.rotate(bones.chest, AXIS.x, 0.05 * weight);
  poser.rotate(bones.neck, AXIS.x, 0.15 * weight);
  poser.rotate(bones.head, AXIS.x, 0.15 * weight);
  poser.rotate(bones.head, AXIS.z, nuzzle * 0.18);
  poser.rotate(bones.head, AXIS.y, -nuzzle * 0.15);
  holdProp(poser, bones, sushi, weight);
  holdProp(poser, bones, croquete, weight);
  bones.arms.forEach((arm) => curlFingers(poser, arm, 0.35 * weight));
};

export const gesture = defineGesture({
  name: 'hugCats',
  duration: 6,
  blendIn: 0.15,
  blendOut: 0.15,
  holdsGaze: true,
  closesEyes: 1,
  props: [sushi, croquete],
  pools: ['reaction', 'pastime'],
  pose: poseHugCats,
});
