import { defineProp } from './defineProp';
import { createGrip } from './grips';

export const laptop = defineProp({
  url: '/models/laptop.glb',
  offsetFromChest: [0, -0.2, 0.3],
  tilt: -0.1,
  grips: {
    left: createGrip({ palmAt: [0.05, 0.07, 0.02], palm: [0, -1, 0.2], fingers: [-0.4, -0.15, 1], pole: [0.3, -1, -0.4] }),
    right: createGrip({ palmAt: [-0.07, 0, -0.03], palm: [0, 1, 0], fingers: [0.35, 0, 1], pole: [-0.3, -1, -0.4] }),
  },
});
