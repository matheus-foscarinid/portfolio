import { describe, expect, it } from 'vitest';
import { GESTURES as AVATAR_GESTURES } from '@/components/home/avatar/animations/gestureLibrary';
import { GESTURES } from './profile.js';

describe('chat gestures', () => {
  it('only offers gestures the avatar can play', () => {
    expect(GESTURES.filter((name) => !AVATAR_GESTURES[name])).toEqual([]);
  });
});
