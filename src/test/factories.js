import { BufferGeometry, Float32BufferAttribute } from 'three';
import { vi } from 'vitest';

export const createPointerEvent = (type, clientX = 0) => Object.assign(new Event(type), { clientX, pointerId: 1 });

export const createFakeCanvas = () => Object.assign(new EventTarget(), { setPointerCapture: vi.fn() });

export const createGeometry = (points) => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points.flat(), 3));
  return geometry;
};

// the shader chunks the blink patch hooks into
export const createShaderStub = () => ({
  uniforms: {},
  vertexShader: '#include <common>\n#include <begin_vertex>',
  fragmentShader: '#include <common>\n#include <map_fragment>',
});
