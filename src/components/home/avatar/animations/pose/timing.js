export const getBeat = (progress, count, offset = 0) => Math.sin(progress * count * Math.PI * 2 + offset);

export const getSoftBeat = (progress, count, weight, offset = 0) => getBeat(progress, count, offset) * weight * weight;
