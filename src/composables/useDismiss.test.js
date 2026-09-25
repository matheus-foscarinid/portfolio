// @vitest-environment happy-dom
import { effectScope, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { useDismiss } from './useDismiss';

let scope;

const openMenu = async () => {
  document.body.innerHTML = '<div id="menu"><button id="inside"></button></div><p id="outside"></p>';
  const isOpen = ref(false);
  scope = effectScope();
  scope.run(() => useDismiss(ref(document.getElementById('menu')), isOpen));
  isOpen.value = true;
  await nextTick();
  return isOpen;
};

const pressOn = (id) => document.getElementById(id).dispatchEvent(new Event('pointerdown', { bubbles: true }));

describe('useDismiss', () => {
  afterEach(() => scope.stop());

  it('closes on a press outside', async () => {
    const isOpen = await openMenu();
    pressOn('outside');
    expect(isOpen.value).toBe(false);
  });

  it('stays open on a press inside', async () => {
    const isOpen = await openMenu();
    pressOn('inside');
    expect(isOpen.value).toBe(true);
  });

  it('closes on escape', async () => {
    const isOpen = await openMenu();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(isOpen.value).toBe(false);
  });

  it('stops listening once its scope ends', async () => {
    const isOpen = await openMenu();
    scope.stop();
    pressOn('outside');
    expect(isOpen.value).toBe(true);
  });
});
