// each file in gestures/ adds one gesture, see defineGesture for its options
const modules = import.meta.glob('./gestures/*.js', { eager: true });

export const GESTURES = Object.fromEntries(Object.values(modules).map(({ gesture }) => [gesture.name, gesture]));

const getPool = (pool) => Object.keys(GESTURES).filter((name) => GESTURES[name].pools.includes(pool));

export const REACTIONS = getPool('reaction');
export const FIDGETS = getPool('fidget');
export const PASTIMES = getPool('pastime');
const MENU_GROUPS = ['greetings', 'reactions', 'props', 'idle'];

const getMenuGroup = ({ props, pools }) => {
  if (props.length) return 'props';
  if (pools.includes('fidget')) return 'idle';
  if (pools.includes('reaction')) return 'reactions';
  return 'greetings';
};

const listedNames = Object.keys(GESTURES).filter((name) => !GESTURES[name].needsTarget);
export const MENU = MENU_GROUPS
  .map((group) => ({ group, names: listedNames.filter((name) => getMenuGroup(GESTURES[name]) === group) }))
  .filter(({ names }) => names.length);

export const applyGestures = (poser, bones, frames) => {
  frames.forEach((frame) => GESTURES[frame.name].pose(poser, bones, frame));
};

export const getGazeStrength = (frames) =>
  frames.reduce((strength, frame) => (GESTURES[frame.name].holdsGaze ? strength * (1 - frame.weight) : strength), 1);

export const getGestureWeight = (frames, name) =>
  frames.reduce((weight, frame) => (frame.name === name ? Math.max(weight, frame.weight) : weight), 0);

export const getEyesClosed = (frames) =>
  frames.reduce((closed, { name, weight }) => Math.max(closed, GESTURES[name].closesEyes * weight), 0);
