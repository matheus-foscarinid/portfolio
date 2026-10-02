// rAF timestamps jitter, so a frame due at exactly the interval shouldn't get skipped
const FRAME_TOLERANCE = 2;
// with only the breathing moving, half the frames look the same and save the gpu
const STILL_INTERVAL = 1000 / 30;

export const createFramePacer = (interval) => {
  let lastFrameAt = -Infinity;
  let isStill = false;

  const isDue = (time) => {
    const currentInterval = isStill ? Math.max(interval, STILL_INTERVAL) : interval;
    if (time - lastFrameAt < currentInterval - FRAME_TOLERANCE) return false;
    lastFrameAt = time;
    return true;
  };

  return { isDue, setStill: (value) => { isStill = value; } };
};
