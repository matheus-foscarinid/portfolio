import { MeshStandardMaterial } from 'three';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createShaderStub } from '@/test/factories';
import { createBlink } from './createBlink';

// mirrors the timing in createBlink.js
const MIN_GAP = 2.5;
const GAP_RANGE = 3.5;
const DOUBLE_BLINK_GAP = 0.12;
const BLINK_DURATION = 0.16;
// with Math.random at 0 the first blink starts at MIN_GAP and never doubles up
const FIRST_BLINK_AT = MIN_GAP;

const setup = ({ random = 0 } = {}) => {
  vi.spyOn(Math, 'random').mockReturnValue(random);
  const material = new MeshStandardMaterial();
  const updateBlink = createBlink(material);
  const shader = createShaderStub();
  material.onBeforeCompile(shader);
  const blinkAt = (seconds) => {
    updateBlink(seconds);
    return shader.uniforms.uBlink.value;
  };
  return { shader, blinkAt };
};

describe('createBlink', () => {
  afterEach(() => vi.restoreAllMocks());

  it('patches the eyelid shader into the material', () => {
    const { shader } = setup();
    expect(shader.vertexShader).toContain('vRestPosition = position');
    expect(shader.fragmentShader).toContain('applyEyelids(diffuseColor.rgb)');
  });

  it('keeps the eyes open until the first blink', () => {
    const { blinkAt } = setup();
    expect(blinkAt(0)).toBe(0);
    expect(blinkAt(FIRST_BLINK_AT - 0.01)).toBe(0);
  });

  it('closes fully halfway through a blink and reopens after', () => {
    const { blinkAt } = setup();
    expect(blinkAt(FIRST_BLINK_AT + BLINK_DURATION / 2)).toBeCloseTo(1);
    expect(blinkAt(FIRST_BLINK_AT + BLINK_DURATION)).toBe(0);
  });

  it('schedules a quick second blink when doubling up', () => {
    const { blinkAt } = setup({ random: 0.1 });
    const blinkEndsAt = MIN_GAP + 0.1 * GAP_RANGE + BLINK_DURATION;
    blinkAt(blinkEndsAt);
    expect(blinkAt(blinkEndsAt + DOUBLE_BLINK_GAP + BLINK_DURATION / 2)).toBeCloseTo(1);
  });
});
