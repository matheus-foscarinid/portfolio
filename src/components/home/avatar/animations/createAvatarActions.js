import { PRIORITY, pickRandom } from './createGesturePlayer';
import { FIDGETS, GESTURES, PASTIMES, REACTIONS } from './gestureLibrary';

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

  const playIdle = (name) => (play(name, { priority: PRIORITY.idle }) ? GESTURES[name].duration : 0);

  const fidget = () => {
    const name = pickRandom(FIDGETS, lastFidget);
    const busySeconds = playIdle(name);
    if (busySeconds) lastFidget = name;
    return busySeconds;
  };

  const passTime = () => {
    const name = pickRandom(PASTIMES, lastPastime);
    const busySeconds = playIdle(name);
    if (busySeconds) lastPastime = name;
    return busySeconds;
  };

  return {
    greet: (delay = 0) => play('wave', { delay }),
    sayBye: () => play('bye'),
    tapAt: (point) => isEnabled() && player.play('tap', { priority: PRIORITY.direct, ...getTapTarget(point) }),
    react,
    fidget,
    passTime,
    // a quiet stretch opens with a prop, then fidgets
    idle: (beat) => (beat === 0 ? passTime() : fidget()),
    perform: (name) => isActive() && player.play(name, { priority: PRIORITY.direct, isForced: true }),
  };
};
