import { PRIORITY, pickRandom } from './createGesturePlayer';
import { FIDGETS, REACTIONS } from './gestureLibrary';

// what the avatar can do, named by intent. triggers call these, never the player directly
export const createAvatarActions = ({ player, isEnabled, getTapTarget }) => {
  let lastReaction = null;
  let lastFidget = null;
  const play = (name, options) => isEnabled() && player.play(name, options);

  const react = () => {
    const name = pickRandom(REACTIONS, lastReaction);
    if (play(name)) lastReaction = name;
  };

  const fidget = () => {
    const name = pickRandom(FIDGETS, lastFidget);
    if (play(name, { priority: PRIORITY.idle })) lastFidget = name;
  };

  return {
    greet: (delay = 0) => play('wave', { delay }),
    sayBye: () => play('bye'),
    nod: () => play('nod', { priority: PRIORITY.idle }),
    tapAt: (point) => isEnabled() && player.play('tap', { priority: PRIORITY.direct, ...getTapTarget(point) }),
    react,
    fidget,
  };
};
