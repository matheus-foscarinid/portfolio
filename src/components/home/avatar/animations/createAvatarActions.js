import { PRIORITY, pickRandom } from './createGesturePlayer';
import { FIDGETS, PASTIMES, REACTIONS } from './gestureLibrary';

// what the avatar can do, named by intent. triggers call these, never the player directly
// isActive is enough for picks from the menu. isEnabled also needs the avatar in view
export const createAvatarActions = ({ player, isActive, isEnabled, getTapTarget }) => {
  let lastReaction = null;
  let lastFidget = null;
  let lastPastime = null;
  const play = (name, options) => isEnabled() && player.play(name, options);

  const react = () => {
    const name = pickRandom(REACTIONS, lastReaction);
    if (play(name)) lastReaction = name;
  };

  const fidget = () => {
    const name = pickRandom(FIDGETS, lastFidget);
    if (play(name, { priority: PRIORITY.idle })) lastFidget = name;
  };

  const passTime = () => {
    const name = pickRandom(PASTIMES, lastPastime);
    if (play(name, { priority: PRIORITY.idle })) lastPastime = name;
  };

  return {
    greet: (delay = 0) => play('wave', { delay }),
    sayBye: () => play('bye'),
    nod: () => play('nod', { priority: PRIORITY.idle }),
    tapAt: (point) => isEnabled() && player.play('tap', { priority: PRIORITY.direct, ...getTapTarget(point) }),
    react,
    fidget,
    passTime,
    perform: (name) => isActive() && player.play(name, { priority: PRIORITY.direct, isForced: true }),
  };
};
