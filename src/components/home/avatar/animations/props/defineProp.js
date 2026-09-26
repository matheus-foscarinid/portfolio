import { Color, Vector3 } from 'three';

const createEyes = ({ centers, halfSize, lidColors }) => ({
  centers: centers.map((center) => new Vector3(...center)),
  halfSize: new Vector3(...halfSize),
  lidColors: lidColors.map((color) => new Color(color)),
});

// eyes are in the model's own units and let the prop blink
export const defineProp = ({ url, offsetFromChest, grips, turn = 0, tilt = 0, scale = 1, eyes = null }) => {
  if (!url) throw new Error('a prop needs a model url');
  if (!grips.left && !grips.right) throw new Error(`prop ${url} needs a grip for at least one hand`);
  return { url, offsetFromChest: new Vector3(...offsetFromChest), grips, turn, tilt, scale, eyes: eyes && createEyes(eyes) };
};
