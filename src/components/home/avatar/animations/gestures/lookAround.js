import { AXIS, getBeat } from '../pose';
import { defineGesture } from '../defineGesture';

const poseLookAround = (poser, { neck, head }, { progress, weight }) => {
  const turn = getBeat(progress, 1) * weight;
  poser.rotate(neck, AXIS.y, turn * 0.25);
  poser.rotate(head, AXIS.y, turn * 0.4);
  poser.rotate(head, AXIS.x, -Math.abs(turn) * 0.08);
};

export const gesture = defineGesture({
  name: 'lookAround',
  duration: 3,
  blendIn: 0.15,
  blendOut: 0.15,
  holdsGaze: true,
  pools: ['fidget'],
  pose: poseLookAround,
});
