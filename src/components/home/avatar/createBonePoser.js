import { Quaternion, Vector3 } from 'three';

// mixamo bones each have their own axes, so poses are written in the model's space instead
export const createBonePoser = (model, bones) => {
  const restPose = bones.map((bone) => bone.quaternion.clone());
  const modelRotation = new Quaternion();
  const parentRotation = new Quaternion();
  const delta = new Quaternion();
  const from = new Vector3();
  const to = new Vector3();

  const applyWorldDelta = (bone) => {
    bone.parent.getWorldQuaternion(parentRotation);
    const localDelta = parentRotation.clone().invert().multiply(delta).multiply(parentRotation);
    bone.quaternion.premultiply(localDelta);
  };

  const resetPose = () => {
    bones.forEach((bone, index) => bone.quaternion.copy(restPose[index]));
    model.getWorldQuaternion(modelRotation);
  };

  const rotate = (bone, axis, angle) => {
    delta.setFromAxisAngle(to.copy(axis).applyQuaternion(modelRotation), angle);
    applyWorldDelta(bone);
  };

  const aim = (bone, child, direction, weight) => {
    if (weight <= 0) return;
    from.subVectors(child.getWorldPosition(from), bone.getWorldPosition(to)).normalize();
    to.copy(direction).applyQuaternion(modelRotation).normalize();
    delta.setFromUnitVectors(from, to);
    delta.slerp(new Quaternion(), 1 - weight);
    applyWorldDelta(bone);
  };

  const toModelDirection = (worldDirection) => worldDirection.clone().applyQuaternion(modelRotation.clone().invert());

  const getModelAxis = (start, end) => {
    const axis = end.getWorldPosition(new Vector3()).sub(start.getWorldPosition(new Vector3()));
    return toModelDirection(axis).normalize();
  };

  return { resetPose, rotate, aim, toModelDirection, getModelAxis };
};
