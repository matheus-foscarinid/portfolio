import { Color, MeshStandardMaterial, Object3D, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { createFakeLoader, createPropStub, createStubPoser } from '@/test/factories';
import { createProps, getPopScale } from './createProps';

const BOOK = createPropStub('/book.glb');
const LAPTOP = createPropStub('/laptop.glb');
const EYES = { centers: [new Vector3(0, 0.4, 0.2)], halfSize: new Vector3(0.01, 0.01, 0.01), lidColors: [new Color('#998367')] };
const SUSHI = createPropStub('/sushi.glb', { scale: 0.5, eyes: EYES });
const CROQUETE = createPropStub('/croquete.glb', { scale: 0.5 });
const GESTURES = [
  { name: 'readBook', props: [BOOK] },
  { name: 'typeOnLaptop', props: [LAPTOP] },
  { name: 'hugCats', props: [SUSHI, CROQUETE] },
  { name: 'wave', props: [] },
];

const setup = async ({ failingUrls } = {}) => {
  const loader = createFakeLoader({ failingUrls });
  const props = await createProps(loader, GESTURES);
  const [book, laptop, sushi, croquete] = props.object.children;
  const update = (frames) => props.update(frames, createStubPoser(), new Object3D(), 0);
  return { loader, props, update, book, laptop, sushi, croquete };
};

describe('createProps', () => {
  it('loads a model for every prop and skips gestures without one', async () => {
    const { loader } = await setup();
    expect(loader.loadAsync.mock.calls.map(([url]) => url)).toEqual([BOOK.url, LAPTOP.url, SUSHI.url, CROQUETE.url]);
  });

  it('keeps every prop hidden until its gesture plays', async () => {
    const { props, update } = await setup();
    update([{ name: 'wave', weight: 1 }]);
    expect(props.object.children.every((prop) => !prop.visible)).toBe(true);
  });

  it('shows and places the prop while its gesture plays', async () => {
    const { update, book, laptop } = await setup();
    update([{ name: 'readBook', weight: 1 }]);
    expect(book.visible).toBe(true);
    expect(book.position.z).toBeCloseTo(0.3);
    expect(laptop.visible).toBe(false);
  });

  it('shows every prop of a gesture that holds several, at their own scale', async () => {
    const { update, sushi, croquete } = await setup();
    update([{ name: 'hugCats', weight: 1 }]);
    [sushi, croquete].forEach((cat) => {
      expect(cat.visible).toBe(true);
      expect(cat.scale.x).toBe(0.5);
    });
  });

  it('gives eyelids only to the props that have eyes', async () => {
    const { book, sushi } = await setup();
    const getMaterial = (prop) => prop.children[0].material;
    const { onBeforeCompile: untouched } = MeshStandardMaterial.prototype;
    expect(getMaterial(sushi).onBeforeCompile).not.toBe(untouched);
    expect(getMaterial(book).onBeforeCompile).toBe(untouched);
  });

  it('skips a prop that fails to load instead of failing', async () => {
    const { props } = await setup({ failingUrls: [BOOK.url] });
    expect(props.object.children).toHaveLength(3);
  });
});

describe('getPopScale', () => {
  it('stays hidden until the hands are nearly in place', () => {
    expect(getPopScale(0.5)).toBeCloseTo(0);
    expect(getPopScale(0.75)).toBeCloseTo(0);
  });

  it('grows to full size with an overshoot on the way', () => {
    expect(getPopScale(0.92)).toBeGreaterThan(1);
    expect(getPopScale(1)).toBe(1);
  });
});
