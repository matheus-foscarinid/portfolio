// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listenToClicks, listenToIdle, listenToScrollAway } from './createGestureTriggers';

const NAVIGATION_DELAY = 450;

const renderPage = () => {
  document.body.innerHTML = `
    <a id="about-link" href="#about">about</a>
    <button id="plain">plain</button>
    <div data-avatar-ignore><button id="menu">menu</button></div>
    <p id="text">text</p>
    <section id="about"></section>
  `;
  const section = document.getElementById('about');
  section.scrollIntoView = vi.fn();
  return { section };
};

const click = (id) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  document.getElementById(id).dispatchEvent(event);
  return event;
};

const scrollTo = (y) => {
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(y);
  window.dispatchEvent(new Event('scroll'));
};

describe('listenToClicks', () => {
  let stop;
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    stop?.();
    vi.useRealTimers();
  });

  it('reports the center of clicked buttons and links', () => {
    renderPage();
    const onClick = vi.fn(() => false);
    stop = listenToClicks(onClick);
    click('plain');
    expect(onClick).toHaveBeenCalledWith({ x: expect.any(Number), y: expect.any(Number) });
  });

  it('ignores clicks on plain content', () => {
    renderPage();
    const onClick = vi.fn();
    stop = listenToClicks(onClick);
    click('text');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores clicks inside opted-out controls', () => {
    renderPage();
    const onClick = vi.fn(() => true);
    stop = listenToClicks(onClick);
    click('menu');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('holds in-page navigation until the tap has shown', () => {
    const { section } = renderPage();
    stop = listenToClicks(() => true);
    const event = click('about-link');
    expect(event.defaultPrevented).toBe(true);
    expect(section.scrollIntoView).not.toHaveBeenCalled();
    vi.advanceTimersByTime(NAVIGATION_DELAY);
    expect(section.scrollIntoView).toHaveBeenCalled();
    expect(window.location.hash).toBe('#about');
  });

  it('navigates right away when the avatar does not react', () => {
    const { section } = renderPage();
    stop = listenToClicks(() => false);
    expect(click('about-link').defaultPrevented).toBe(false);
    vi.advanceTimersByTime(NAVIGATION_DELAY);
    expect(section.scrollIntoView).not.toHaveBeenCalled();
  });
});

describe('listenToScrollAway', () => {
  it('says bye once when scrolling away and hi once when back', () => {
    const onLeave = vi.fn();
    const onReturn = vi.fn();
    const stop = listenToScrollAway({ onLeave, onReturn });
    scrollTo(window.innerHeight);
    scrollTo(window.innerHeight * 2);
    scrollTo(0);
    stop();
    vi.restoreAllMocks();
    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(onReturn).toHaveBeenCalledTimes(1);
  });
});

describe('listenToIdle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fidgets after a quiet stretch and waits again after any activity', () => {
    const onIdle = vi.fn();
    const stop = listenToIdle(onIdle);
    vi.advanceTimersByTime(8000);
    window.dispatchEvent(new Event('pointermove'));
    vi.advanceTimersByTime(8000);
    expect(onIdle).not.toHaveBeenCalled();
    vi.advanceTimersByTime(8000);
    expect(onIdle).toHaveBeenCalledTimes(1);
    stop();
  });

  it('fires once per quiet stretch when it does not repeat', () => {
    const onIdle = vi.fn();
    const stop = listenToIdle(onIdle, { delay: { min: 1000, max: 1000 }, isRepeating: false });
    vi.advanceTimersByTime(5000);
    expect(onIdle).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(1000);
    expect(onIdle).toHaveBeenCalledTimes(2);
    stop();
  });
});
