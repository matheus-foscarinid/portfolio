export const EASE = {
  out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// only transform and opacity animate here - both are GPU-composited, so no
// per-frame layout or paint. never add filter/blur: it repaints every frame
const toKeyframe = ({ opacity = 1, x = 0, y = 0, scale = 1 }) => ({
  opacity,
  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
});

const toList = (elements) => {
  if (!elements) return [];
  if (elements instanceof Element) return [elements];
  return [...elements];
};

export const reveal = (elements, from, to, options = {}) => {
  const reduced = prefersReducedMotion();
  const { duration = 500, delay = 0, stagger = 0, easing = EASE.out } = options;

  toList(elements).forEach((el, index) => {
    const play = () => el.animate([toKeyframe(from), toKeyframe(to)], {
      duration: reduced ? 0 : duration,
      easing,
      fill: 'both'
    });

    const wait = reduced ? 0 : delay + index * stagger;
    if (!wait) {
      play();
      return;
    }

    // the wait assumes the element is still below the fold. if the reader gets
    // there first - a nav jump, or a scroll that outran the observer - it plays
    // on arrival instead, so there is never a hole they are looking straight at
    const timer = setTimeout(() => {
      watcher.disconnect();
      play();
    }, wait);

    const watcher = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      clearTimeout(timer);
      watcher.disconnect();
      play();
    });

    watcher.observe(el);
  });
};

export const onReveal = (targetSelector, callback) => {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  if (prefersReducedMotion()) {
    callback();
    return;
  }

  // a small lead so the sequence is under way as the section arrives. it stays
  // short on purpose: a long one reveals sections near the top of the page before
  // the reader has scrolled at all, and reveal() already covers a fast arrival
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        self.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 25% 0px' });

  observer.observe(target);
};
