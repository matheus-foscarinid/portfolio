import bookUrl from '@/assets/models/book.glb?url';
import { defineProp } from './defineProp';
import { createMirroredGrips } from './grips';

export const book = defineProp({
  url: bookUrl,
  offsetFromChest: [0, -0.08, 0.3],
  tilt: -0.7,
  grips: createMirroredGrips({ palmAt: [0.1, -0.02, -0.065], palm: [0, 1, 0.3], fingers: [-0.7, 0, 1], pole: [0.6, -1, -0.2] }),
});
