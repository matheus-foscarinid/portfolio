// data-avatar-reach opts in custom controls built from plain elements. data-avatar-ignore opts out
const CLICKABLE = 'a, button, label, [role="button"], [data-avatar-reach]';
// long enough for the tap to land before the page scrolls away
const NAVIGATION_DELAY = 450;
// share of the viewport scrolled before the avatar waves goodbye
const SCROLL_AWAY = 0.2;
// counted from the end of the last idle gesture
const IDLE_GAP = 3000;
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

// onIdle gets how many times it already ran this quiet stretch and returns the seconds it keeps busy
export const listenToIdle = (onIdle) => {
  let timer = null;
  let beat = 0;
  const schedule = (delay) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const busySeconds = onIdle(beat++) || 0;
      schedule(IDLE_GAP + busySeconds * 1000);
    }, delay);
  };
  const restart = () => {
    beat = 0;
    schedule(IDLE_GAP);
  };
  const stopListening = IDLE_RESET_EVENTS.map((type) => listen(window, type, restart, { passive: true }));
  restart();
  return () => {
    clearTimeout(timer);
    stopListening.forEach((stop) => stop());
  };
};

export const createGestureTriggers = ({ actions }) => {
  const stops = [
    listenToClicks(actions.tapAt),
    listenToScrollAway({ onLeave: actions.sayBye, onReturn: () => actions.greet() }),
    listenToIdle(actions.idle),
  ];
  return { dispose: () => stops.forEach((stop) => stop()) };
};
