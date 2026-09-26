// data-avatar-reach opts in custom controls built from plain elements. data-avatar-ignore opts out
const CLICKABLE = 'a, button, label, [role="button"], [data-avatar-reach]';
// long enough for the tap to land before the page scrolls away
const NAVIGATION_DELAY = 450;
// share of the viewport scrolled before the avatar waves goodbye
const SCROLL_AWAY = 0.2;
const IDLE_DELAY = { min: 9000, max: 15000 };
const PASTIME_DELAY = { min: 4000, max: 6000 };
const IDLE_RESET_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'scroll'];

const listen = (target, type, listener, options) => {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
};

const navigateAfterDelay = (event, link) => {
  const section = document.getElementById(link.hash.slice(1));
  if (!section) return;
  event.preventDefault();
  setTimeout(() => {
    history.pushState(null, '', link.hash);
    section.scrollIntoView({ behavior: 'smooth' });
  }, NAVIGATION_DELAY);
};

// reaches for clicked links and buttons. in-page links wait for the tap to show before scrolling
export const listenToClicks = (onClick) => listen(document, 'click', (event) => {
  const clickable = event.target.closest?.(CLICKABLE);
  if (!clickable || clickable.closest('[data-avatar-ignore]')) return;
  const rect = clickable.getBoundingClientRect();
  const hasReacted = onClick({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  const link = clickable.closest('a[href^="#"]');
  if (hasReacted && link) navigateAfterDelay(event, link);
}, true);

export const listenToScrollAway = ({ onLeave, onReturn }) => {
  let hasLeft = false;
  return listen(window, 'scroll', () => {
    const isAway = window.scrollY > window.innerHeight * SCROLL_AWAY;
    if (isAway === hasLeft) return;
    hasLeft = isAway;
    if (isAway) onLeave();
    else onReturn();
  }, { passive: true });
};

export const listenToIdle = (onIdle, { delay = IDLE_DELAY, isRepeating = true } = {}) => {
  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      onIdle();
      if (isRepeating) schedule();
    }, delay.min + Math.random() * (delay.max - delay.min));
  };
  const stopListening = IDLE_RESET_EVENTS.map((type) => listen(window, type, schedule, { passive: true }));
  schedule();
  return () => {
    clearTimeout(timer);
    stopListening.forEach((stop) => stop());
  };
};

export const createGestureTriggers = ({ actions }) => {
  const stops = [
    listenToClicks(actions.tapAt),
    listenToScrollAway({ onLeave: actions.sayBye, onReturn: () => actions.greet() }),
    listenToIdle(actions.fidget),
    listenToIdle(actions.passTime, { delay: PASTIME_DELAY, isRepeating: false }),
  ];
  return { dispose: () => stops.forEach((stop) => stop()) };
};
