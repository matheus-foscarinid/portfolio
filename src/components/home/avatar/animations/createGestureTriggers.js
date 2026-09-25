// data-avatar-reach opts in custom controls built from plain elements
const CLICKABLE = 'a, button, label, [role="button"], [data-avatar-reach]';
// long enough for the tap to land before the page scrolls away
const NAVIGATION_DELAY = 450;
const HOVER_COOLDOWN = 6000;
// share of the viewport scrolled before the avatar waves goodbye
const SCROLL_AWAY = 0.2;
const IDLE_DELAY = { min: 9000, max: 15000 };
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
  if (!clickable) return;
  const rect = clickable.getBoundingClientRect();
  const hasReacted = onClick({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  const link = clickable.closest('a[href^="#"]');
  if (hasReacted && link) navigateAfterDelay(event, link);
}, true);

export const listenToHover = (canvas, onHover) => {
  let lastHoverAt = -Infinity;
  return listen(canvas, 'pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || event.timeStamp - lastHoverAt < HOVER_COOLDOWN) return;
    lastHoverAt = event.timeStamp;
    onHover();
  });
};

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

export const listenToIdle = (onIdle) => {
  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    const delay = IDLE_DELAY.min + Math.random() * (IDLE_DELAY.max - IDLE_DELAY.min);
    timer = setTimeout(() => { onIdle(); schedule(); }, delay);
  };
  const stopListening = IDLE_RESET_EVENTS.map((type) => listen(window, type, schedule, { passive: true }));
  schedule();
  return () => {
    clearTimeout(timer);
    stopListening.forEach((stop) => stop());
  };
};

export const createGestureTriggers = ({ canvas, actions }) => {
  const stops = [
    listenToClicks(actions.tapAt),
    listenToHover(canvas, actions.nod),
    listenToScrollAway({ onLeave: actions.sayBye, onReturn: () => actions.greet() }),
    listenToIdle(actions.fidget),
  ];
  return { dispose: () => stops.forEach((stop) => stop()) };
};
