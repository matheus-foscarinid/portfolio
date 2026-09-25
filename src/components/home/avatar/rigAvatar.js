import {
  Bone,
  Float32BufferAttribute,
  MathUtils,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from 'three';

// landmarks as shares of the model's height, measured on the tripo model
const HIP = { start: 0.48, end: 0.56, pivot: 0.52 };
const NECK = { start: 0.835, end: 0.875 };
const SHOULDER = { pivot: 0.78, pivotX: 0.12, fadeStart: 0.74, fadeEnd: 0.8 };
const ARM = { innerX: 0.095, outerX: 0.115, lowest: 0.37, lowestFade: 0.4 };

// order matches the skeleton, since skin indices point into it
const BONE_ORDER = ['root', 'spine', 'head', 'leftArm', 'rightArm'];
const BONE = Object.fromEntries(BONE_ORDER.map((name, index) => [name, index]));

const measure = (geometry) => {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  return { min, height: max.y - min.y, centerX: (min.x + max.x) / 2, centerZ: (min.z + max.z) / 2 };
};

// hands hang below the hips, so anything far enough out from the torso belongs to an arm
const getArmWeight = (share, sideShare) => {
  const isOutsideTorso = MathUtils.smoothstep(Math.abs(sideShare), ARM.innerX, ARM.outerX);
  const isAboveHands = MathUtils.smoothstep(share, ARM.lowest, ARM.lowestFade);
  const isBelowShoulder = 1 - MathUtils.smoothstep(share, SHOULDER.fadeStart, SHOULDER.fadeEnd);
  return isOutsideTorso * isAboveHands * isBelowShoulder;
};

const computeSkinWeights = (geometry, frame) => {
  const positions = geometry.attributes.position;
  const skinIndices = new Uint16Array(positions.count * 4);
  const skinWeights = new Float32Array(positions.count * 4);

  for (let index = 0; index < positions.count; index += 1) {
    const share = (positions.getY(index) - frame.min.y) / frame.height;
    const sideShare = (positions.getX(index) - frame.centerX) / frame.height;

    const arm = getArmWeight(share, sideShare);
    const head = MathUtils.smoothstep(share, NECK.start, NECK.end);
    const upperBody = Math.max(MathUtils.smoothstep(share, HIP.start, HIP.end), arm);
    const armBone = sideShare > 0 ? BONE.leftArm : BONE.rightArm;

    skinIndices.set([BONE.root, BONE.spine, BONE.head, armBone], index * 4);
    skinWeights.set([
      1 - upperBody,
      upperBody * (1 - head) * (1 - arm),
      upperBody * head,
      upperBody * (1 - head) * arm,
    ], index * 4);
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));
};

const createBoneAt = (parent, parentPosition, position) => {
  const bone = new Bone();
  bone.position.subVectors(position, parentPosition);
  parent.add(bone);
  return bone;
};

const createBones = (frame) => {
  const at = (share, sideShare = 0) => new Vector3(
    frame.centerX + sideShare * frame.height,
    frame.min.y + share * frame.height,
    frame.centerZ,
  );
  const origin = new Vector3();
  const spinePosition = at(HIP.pivot);

  const root = new Bone();
  const spine = createBoneAt(root, origin, spinePosition);
  const head = createBoneAt(spine, spinePosition, at(NECK.start));
  const leftArm = createBoneAt(spine, spinePosition, at(SHOULDER.pivot, SHOULDER.pivotX));
  const rightArm = createBoneAt(spine, spinePosition, at(SHOULDER.pivot, -SHOULDER.pivotX));
  return { root, spine, head, leftArm, rightArm };
};

// the model ships without a skeleton, so build one from its proportions
export const rigAvatar = (mesh) => {
  const { geometry } = mesh;
  const frame = measure(geometry);
  computeSkinWeights(geometry, frame);

  const bones = createBones(frame);
  const skinned = new SkinnedMesh(geometry, mesh.material);
  skinned.position.copy(mesh.position);
  skinned.quaternion.copy(mesh.quaternion);
  skinned.scale.copy(mesh.scale);
  skinned.add(bones.root);
  skinned.bind(new Skeleton(BONE_ORDER.map((name) => bones[name])));

  mesh.parent.add(skinned);
  mesh.removeFromParent();
  return bones;
};
