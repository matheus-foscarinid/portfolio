import { defineProp } from './defineProp';
import { createGrip } from './grips';

const CAT_SCALE = 0.7;
const LEFT_ARM = 1;
const RIGHT_ARM = -1;
const CAT_EYE_HALF_SIZE = [0.013, 0.01, 0.012];

const createCatInArm = (side, url, eyes) => defineProp({
  url,
  eyes: { ...eyes, halfSize: CAT_EYE_HALF_SIZE },
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

export const sushi = createCatInArm(RIGHT_ARM, '/models/sushi.glb', {
  centers: [[0.077, 0.405, 0.172], [0.133, 0.405, 0.174]],
  lidColors: ['#998367', '#ae947a'],
});

export const croquete = createCatInArm(LEFT_ARM, '/models/croquete.glb', {
  centers: [[-0.206, 0.445, 0.15], [-0.146, 0.445, 0.171]],
  lidColors: ['#8a5f2f', '#77674f'],
});
