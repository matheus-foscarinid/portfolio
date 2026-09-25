import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockNextRandom } from '@/test/factories';
import { createAvatarActions } from './createAvatarActions';
import { PRIORITY } from './createGesturePlayer';
import { FIDGETS, REACTIONS } from './gestureLibrary';

const setup = ({ isEnabled = true } = {}) => {
  const player = { play: vi.fn(() => true) };
  const getTapTarget = vi.fn(() => ({ arm: 'left', direction: 'up' }));
  const actions = createAvatarActions({ player, isEnabled: () => isEnabled, getTapTarget });
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

  it('taps toward the target at direct priority', () => {
    const { actions, player, getTapTarget } = setup();
    expect(actions.tapAt({ x: 5, y: 6 })).toBe(true);
    expect(getTapTarget).toHaveBeenCalledWith({ x: 5, y: 6 });
    expect(player.play).toHaveBeenCalledWith('tap', { priority: PRIORITY.direct, arm: 'left', direction: 'up' });
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
