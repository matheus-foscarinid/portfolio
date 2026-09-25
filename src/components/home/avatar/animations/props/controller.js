import { defineProp } from './defineProp';
import { createMirroredGrips } from './grips';

export const controller = defineProp({
  url: '/models/controller.glb',
  offsetFromChest: [0, -0.2, 0.28],
  tilt: -0.5,
  grips: createMirroredGrips({ palmAt: [0.07, -0.01, -0.04], palm: [-1, 0.6, 0], fingers: [-0.3, -0.4, 1], pole: [0.3, -1, -0.3] }),
});
