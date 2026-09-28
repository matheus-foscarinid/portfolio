// per instance only, so it slows down one visitor spamming. groq's own quota is the real cap
export const createRateLimiter = ({ limit, windowMs, now = Date.now }) => {
  const hitsByKey = new Map();

  return (key) => {
    const since = now() - windowMs;
    const hits = (hitsByKey.get(key) ?? []).filter((time) => time > since);
    if (hits.length >= limit) return false;

    hitsByKey.set(key, [...hits, now()]);
    return true;
  };
};
