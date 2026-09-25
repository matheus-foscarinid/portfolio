import { defineProp } from './defineProp';
import { createGrip } from './grips';

const CAT_SCALE = 0.7;
const LEFT_ARM = 1;
const RIGHT_ARM = -1;

const createCatInArm = (side, url) => defineProp({
  url,
  offsetFromChest: [side * 0.19, -0.24, 0.16],
  turn: -side * 0.35,
  scale: CAT_SCALE,
  grips: {
    [side === LEFT_ARM ? 'left' : 'right']: createGrip({
      palmAt: [0, -0.01, -0.01],
      palm: [0, 1, 0],
      fingers: [-side * 0.8, 0, 0.7],
      pole: [side * 0.4, -1, -0.2],
    }),
  },
});

export const sushi = createCatInArm(RIGHT_ARM, '/models/sushi.glb');
export const croquete = createCatInArm(LEFT_ARM, '/models/croquete.glb');
