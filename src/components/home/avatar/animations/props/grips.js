import { Vector3 } from 'three';

// in the prop's own space, with the avatar standing on its -z side
export const createGrip = ({ palmAt, palm, fingers, pole }) => ({
  palmAt: new Vector3(...palmAt),
  palm: new Vector3(...palm).normalize(),
  fingers: new Vector3(...fingers).normalize(),
  pole: new Vector3(...pole).normalize(),
});

const flipX = ([x, y, z]) => [-x, y, z];

export const createMirroredGrips = (left) => ({
  left: createGrip(left),
  right: createGrip({
    palmAt: flipX(left.palmAt),
    palm: flipX(left.palm),
    fingers: flipX(left.fingers),
    pole: flipX(left.pole),
  }),
});
