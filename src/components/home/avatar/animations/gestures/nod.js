import { AXIS, getBeat } from '../pose';
import { defineGesture } from '../defineGesture';

const poseNod = (poser, { neck, head }, { progress, weight }) => {
  const dip = Math.max(0, getBeat(progress, 2)) * weight;
  poser.rotate(neck, AXIS.x, dip * 0.15);
  poser.rotate(head, AXIS.x, dip * 0.3);
};

export const gesture = defineGesture({
  name: 'nod',
  duration: 1,
  blendIn: 0.15,
  blendOut: 0.15,
  holdsGaze: true,
  pose: poseNod,
});
