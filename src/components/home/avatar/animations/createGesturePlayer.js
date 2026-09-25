import { MathUtils } from 'three';

// a gesture only interrupts one with a lower priority. equal or higher ones are dropped
export const PRIORITY = { idle: 0, normal: 1, direct: 2 };
// seconds an interrupted gesture takes to blend out, so the switch doesn't snap
const FADE_OUT = 0.3;

export const getEnvelope = (progress, { rise, fall }) =>
  MathUtils.smoothstep(progress, 0, rise) * (1 - MathUtils.smoothstep(progress, fall, 1));

export const pickRandom = (names, previous) => {
  const options = names.length > 1 ? names.filter((name) => name !== previous) : names;
  return options[Math.floor(Math.random() * options.length)];
};

export const createGesturePlayer = (library) => {
  let queued = null;
  let active = null;
  let fading = null;

  const play = (name, { priority = PRIORITY.normal, delay = 0, ...options } = {}) => {
    const current = queued ?? active;
    if (current && current.priority >= priority) return false;
    queued = { ...options, name, priority, delay };
    return true;
  };

  const getFrame = (gesture, seconds) => {
    const progress = MathUtils.clamp((seconds - gesture.startedAt) / library[gesture.name].duration, 0, 1);
    return { ...gesture, progress, weight: getEnvelope(progress, library[gesture.name]) };
  };

  const startQueued = (seconds) => {
    if (active) fading = { frame: getFrame(active, seconds), startedAt: seconds };
    active = { ...queued, startedAt: seconds + queued.delay };
    queued = null;
  };

  const getFadingFrame = (seconds) => {
    const remaining = 1 - (seconds - fading.startedAt) / FADE_OUT;
    if (remaining <= 0) fading = null;
    return fading && { ...fading.frame, weight: fading.frame.weight * remaining };
  };

  const update = (seconds) => {
    if (queued) startQueued(seconds);
    if (active && seconds - active.startedAt >= library[active.name].duration) active = null;
    const frames = [];
    if (fading) frames.push(getFadingFrame(seconds));
    if (active) frames.push(getFrame(active, seconds));
    return frames.filter(Boolean);
  };

  return { play, update };
};
