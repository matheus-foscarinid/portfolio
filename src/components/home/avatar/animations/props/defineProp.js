import { Vector3 } from 'three';

export const defineProp = ({ url, offsetFromChest, grips, turn = 0, tilt = 0, scale = 1 }) => {
  if (!url) throw new Error('a prop needs a model url');
  if (!grips.left && !grips.right) throw new Error(`prop ${url} needs a grip for at least one hand`);
  return { url, offsetFromChest: new Vector3(...offsetFromChest), grips, turn, tilt, scale };
};
