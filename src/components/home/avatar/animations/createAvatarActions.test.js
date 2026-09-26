import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockNextRandom } from '@/test/factories';
import { createAvatarActions } from './createAvatarActions';
import { PRIORITY } from './createGesturePlayer';
import { FIDGETS, GESTURES, PASTIMES, REACTIONS } from './gestureLibrary';

const setup = ({ isEnabled = true, isActive = true } = {}) => {
  const player = { play: vi.fn(() => true) };
  const getTapTarget = vi.fn(() => ({ arm: 'left', direction: 'up' }));
  const actions = createAvatarActions({ player, isActive: () => isActive, isEnabled: () => isEnabled, getTapTarget });
  const playedNames = () => player.play.mock.calls.map(([name]) => name);
  return { actions, player, getTapTarget, playedNames };
};

describe('createAvatarActions', () => {
  afterEach(() => vi.restoreAllMocks());

  it('greets with a delayed wave', () => {
    const { actions, player } = setup();
    actions.greet(0.8);
    expect(player.play).toHaveBeenCalledWith('wave', { delay: 0.8 });
  });

  it('reacts with a different gesture each time', () => {
    const { actions, playedNames } = setup();
    mockNextRandom(0);
    actions.react();
    mockNextRandom(0);
    actions.react();
    expect(playedNames()).toEqual([REACTIONS[0], REACTIONS[1]]);
  });

  it('fidgets at idle priority so anything else can cut in', () => {
    const { actions, player } = setup();
    actions.fidget();
    expect(FIDGETS).toContain(player.play.mock.calls[0][0]);
    expect(player.play.mock.calls[0][1]).toEqual({ priority: PRIORITY.idle });
  });

  it('passes time with a different prop each time, at idle priority', () => {
    const { actions, player, playedNames } = setup();
    mockNextRandom(0);
    actions.passTime();
    mockNextRandom(0);
    actions.passTime();
    expect(playedNames()).toEqual([PASTIMES[0], PASTIMES[1]]);
    expect(player.play.mock.calls[0][1]).toEqual({ priority: PRIORITY.idle });
  });

  it('opens a quiet stretch with a prop, then fidgets', () => {
    const { actions, playedNames } = setup();
    actions.idle(0);
    actions.idle(1);
    const [first, second] = playedNames();
    expect(PASTIMES).toContain(first);
    expect(FIDGETS).toContain(second);
  });

  it('reports how long an idle gesture keeps the avatar busy', () => {
    const { actions, playedNames } = setup();
    expect(actions.idle(1)).toBe(GESTURES[playedNames()[0]].duration);
  });

  it('reports no busy time when the gesture could not play', () => {
    const { actions } = setup({ isEnabled: false });
    expect(actions.idle(0)).toBe(0);
  });

  it('taps toward the target at direct priority', () => {
    const { actions, player, getTapTarget } = setup();
    expect(actions.tapAt({ x: 5, y: 6 })).toBe(true);
    expect(getTapTarget).toHaveBeenCalledWith({ x: 5, y: 6 });
    expect(player.play).toHaveBeenCalledWith('tap', { priority: PRIORITY.direct, arm: 'left', direction: 'up' });
  });

  it('performs a picked gesture at direct priority even with the avatar covered', () => {
    const { actions, player } = setup({ isEnabled: false });
    actions.perform('readBook');
    expect(player.play).toHaveBeenCalledWith('readBook', { priority: PRIORITY.direct, isForced: true });
  });

  it('ignores picks while the scene is paused', () => {
    const { actions, player } = setup({ isEnabled: false, isActive: false });
    actions.perform('readBook');
    expect(player.play).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', () => {
    const { actions, player, getTapTarget } = setup({ isEnabled: false });
    actions.greet();
    actions.react();
    expect(actions.tapAt({ x: 0, y: 0 })).toBe(false);
    expect(player.play).not.toHaveBeenCalled();
    expect(getTapTarget).not.toHaveBeenCalled();
  });
});
