const POOLS = ['reaction', 'fidget', 'pastime'];

const assertValid = ({ name, duration, pose, pools }) => {
  if (!name) throw new Error('a gesture needs a name');
  if (!(duration > 0)) throw new Error(`gesture ${name} needs a positive duration`);
  if (typeof pose !== 'function') throw new Error(`gesture ${name} needs a pose function`);
  const unknownPool = pools.find((pool) => !POOLS.includes(pool));
  if (unknownPool) throw new Error(`gesture ${name} joins an unknown pool: ${unknownPool}`);
};

// holdsGaze lets go of cursor tracking while the gesture moves the head itself
export const defineGesture = ({
  name,
  duration,
  pose,
  blendIn = 0.2,
  blendOut = 0.2,
  holdsGaze = false,
  closesEyes = 0,
  props = [],
  needsTarget = false,
  pools = [],
}) => {
  const gesture = { name, duration, pose, blendIn, blendOut, holdsGaze, closesEyes, props, needsTarget, pools };
  assertValid(gesture);
  return gesture;
};
