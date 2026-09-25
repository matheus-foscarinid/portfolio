import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGestureLibrary, mockNextRandom } from '@/test/factories';
import { PRIORITY, createGesturePlayer, getEnvelope, pickRandom } from './createGesturePlayer';

const setup = () => createGesturePlayer(createGestureLibrary());

describe('getEnvelope', () => {
  it('eases in, holds and eases out', () => {
    const timing = { rise: 0.2, fall: 0.8 };
    expect(getEnvelope(0, timing)).toBe(0);
    expect(getEnvelope(0.5, timing)).toBe(1);
    expect(getEnvelope(1, timing)).toBe(0);
  });
});

describe('pickRandom', () => {
  afterEach(() => vi.restoreAllMocks());

  it('never repeats the previous pick', () => {
    mockNextRandom(0);
    expect(pickRandom(['a', 'b', 'c'], 'a')).toBe('b');
  });

  it('repeats when there is only one option', () => {
    expect(pickRandom(['a'], 'a')).toBe('a');
  });
});

describe('createGesturePlayer', () => {
  it('plays a gesture from the next update until its duration ends', () => {
    const player = setup();
    player.play('short');
    expect(player.update(10)).toMatchObject([{ name: 'short', progress: 0 }]);
    expect(player.update(10.5)).toMatchObject([{ name: 'short', progress: 0.5, weight: 1 }]);
    expect(player.update(11)).toEqual([]);
  });

  it('passes options through to the frame', () => {
    const player = setup();
    player.play('short', { target: 'menu' });
    expect(player.update(0)[0].target).toBe('menu');
  });

  it('drops a gesture of equal priority while one is playing', () => {
    const player = setup();
    player.play('short');
    player.update(0);
    expect(player.play('long')).toBe(false);
    expect(player.update(0.5)).toMatchObject([{ name: 'short' }]);
  });

  it('lets a higher priority interrupt and fades the old one out', () => {
    const player = setup();
    player.play('long', { priority: PRIORITY.idle });
    player.update(0);
    expect(player.play('short', { priority: PRIORITY.direct })).toBe(true);

    const [fading, active] = player.update(1);
    expect(fading).toMatchObject({ name: 'long', weight: 1 });
    expect(active).toMatchObject({ name: 'short', progress: 0 });
    expect(player.update(1.15)[0].weight).toBeCloseTo(0.5);
    expect(player.update(1.5)).toMatchObject([{ name: 'short' }]);
  });

  it('holds a delayed gesture at rest until its start', () => {
    const player = setup();
    player.play('short', { delay: 1 });
    expect(player.update(0)).toMatchObject([{ progress: 0, weight: 0 }]);
    expect(player.update(1.5)).toMatchObject([{ progress: 0.5, weight: 1 }]);
  });
});
