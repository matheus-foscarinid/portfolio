import {
  CircleGeometry,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
} from 'three';

// near-neutral light so the skin keeps its tone instead of turning orange
const createLights = () => {
  const key = new DirectionalLight(0xfff4e6, 1.9);
  key.position.set(1.5, 3, 3);
  const fill = new DirectionalLight(0xffffff, 0.8);
  fill.position.set(-2, 1.5, 2.5);
  const rim = new DirectionalLight(0xd3869b, 0.6);
  rim.position.set(-2, 2, -2);
  return [new HemisphereLight(0xffffff, 0xcfcac4, 2.3), key, fill, rim];
};

const createGroundShadow = () => {
  const material = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
  const shadow = new Mesh(new CircleGeometry(0.34, 32), material);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  return shadow;
};

const createCamera = () => {
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0.95, 3.9);
  camera.lookAt(0, 0.86, 0);
  return camera;
};

export const createStage = () => {
  const scene = new Scene().add(createGroundShadow(), ...createLights());
  const camera = createCamera();

  const setAspect = (aspect) => {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  };

  const dispose = () => {
    scene.traverse((object) => {
      object.geometry?.dispose();
      object.material?.map?.dispose();
      object.material?.dispose();
    });
  };

  return { scene, camera, setAspect, dispose };
};
