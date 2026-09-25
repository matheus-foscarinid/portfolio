import { Group, Mesh, MeshStandardMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { createGeometry } from '@/test/factories';
import { rigAvatar } from './rigAvatar';

const BONE = { root: 0, spine: 1, head: 2, arm: 3 };

// a unit-tall figure: y is the share of the height, x the distance from the center
const POINTS = {
  foot: [0, 0, 0],
  top: [0, 1, 0],
  chest: [0, 0.7, 0],
  head: [0, 0.95, 0],
  leftHand: [0.15, 0.42, 0],
  rightHand: [-0.15, 0.42, 0],
  hip: [0, 0.52, 0],
};

const setup = () => {
  const names = Object.keys(POINTS);
  const mesh = new Mesh(createGeometry(Object.values(POINTS)), new MeshStandardMaterial());
  const parent = new Group().add(mesh);
  const bones = rigAvatar(mesh);
  const skinned = parent.children[0];
  const weightsOf = (name) => {
    const index = names.indexOf(name);
    const { skinIndex, skinWeight } = skinned.geometry.attributes;
    return {
      indices: [0, 1, 2, 3].map((slot) => skinIndex.getComponent(index, slot)),
      weights: [0, 1, 2, 3].map((slot) => skinWeight.getComponent(index, slot)),
    };
  };
  return { bones, skinned, parent, weightsOf, names };
};

describe('rigAvatar', () => {
  it('swaps the mesh for a skinned mesh with five bones', () => {
    const { skinned, parent } = setup();
    expect(parent.children).toHaveLength(1);
    expect(skinned.isSkinnedMesh).toBe(true);
    expect(skinned.skeleton.bones).toHaveLength(5);
  });

  it('keeps the feet on the root bone', () => {
    const { weightsOf } = setup();
    expect(weightsOf('foot').weights[BONE.root]).toBeCloseTo(1);
  });

  it('puts the head fully on the head bone', () => {
    const { weightsOf } = setup();
    expect(weightsOf('head').weights[BONE.head]).toBeCloseTo(1);
  });

  it('puts the chest on the spine', () => {
    const { weightsOf } = setup();
    expect(weightsOf('chest').weights[BONE.spine]).toBeCloseTo(1);
  });

  it('moves hands below the hips with their arm, each on its own side', () => {
    const { weightsOf, bones, skinned } = setup();
    const left = weightsOf('leftHand');
    const right = weightsOf('rightHand');
    expect(left.weights[BONE.arm]).toBeCloseTo(1);
    expect(skinned.skeleton.bones[left.indices[BONE.arm]]).toBe(bones.leftArm);
    expect(skinned.skeleton.bones[right.indices[BONE.arm]]).toBe(bones.rightArm);
  });

  it('gives every vertex weights that add up to one', () => {
    const { weightsOf, names } = setup();
    names.forEach((name) => {
      const total = weightsOf(name).weights.reduce((sum, weight) => sum + weight, 0);
      expect(total).toBeCloseTo(1);
    });
  });
});
