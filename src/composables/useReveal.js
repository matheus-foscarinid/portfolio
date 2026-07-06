export const EASE = {
  out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// only transform and opacity animate here - both are GPU-composited, so no
// per-frame layout or paint. avoid filter/blur, which force a repaint every frame
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
    el.animate([toKeyframe(from), toKeyframe(to)], {
      duration: reduced ? 0 : duration,
      delay: reduced ? 0 : delay + index * stagger,
      easing,
      fill: 'both'
    });
  });
};

export const onReveal = (targetSelector, callback) => {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  if (prefersReducedMotion()) {
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        self.unobserve(entry.target);
      }
    });
  });

  observer.observe(target);
};
