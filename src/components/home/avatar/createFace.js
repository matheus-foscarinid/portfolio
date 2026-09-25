import { Color, Vector3 } from 'three';

// the model has no eyelids, so a shader paints skin over each eye for a moment.
// eyes are placed on the mesh, in its quantized units, because the texture splits them apart
const EYE_CENTERS = [new Vector3(-0.0235, 0.834, 0.111), new Vector3(0.0425, 0.8365, 0.113)];
// half width, half height and half depth. the depth keeps the lid off the glasses frame
const EYE_HALF_SIZE = new Vector3(0.0195, 0.0085, 0.013);
// sampled from the texture just under the eye
const LID_COLOR = new Color('#b3856c');
const LASH_COLOR = new Color('#291a12');
const BLINK_DURATION = 0.16;
const MIN_GAP = 2.5;
const MAX_GAP = 6;
const DOUBLE_BLINK_CHANCE = 0.2;
const DOUBLE_BLINK_GAP = 0.12;
const EYES_CLOSED_EASING = 0.12;

const EYELID_SHADER = /* glsl */ `
  varying vec3 vRestPosition;
  uniform float uBlink;
  uniform float uHappyEyes;
  uniform vec3 uEyeCenters[${EYE_CENTERS.length}];
  uniform vec3 uEyeHalfSize;
  uniform vec3 uLidColor;
  uniform vec3 uLashColor;

  vec3 applyEyelid(vec3 color, vec3 center) {
    vec3 local = (vRestPosition - center) / uEyeHalfSize;
    float inside = 1.0 - smoothstep(0.85, 1.05, length(local));
    // the lid edge travels from the top of the eye to the bottom as the blink closes
    float lidEdge = 1.0 - 2.0 * uBlink + uHappyEyes * 0.6 * (1.0 - local.x * local.x);
    float cover = inside * max(smoothstep(lidEdge - 0.08, lidEdge + 0.08, local.y), uHappyEyes * uBlink);
    float lashes = inside * (1.0 - smoothstep(0.0, 0.18, abs(local.y - lidEdge))) * step(0.01, uBlink);
    vec3 lid = mix(color, uLidColor, cover);
    return mix(lid, uLashColor, lashes * 0.85);
  }

  vec3 applyEyelids(vec3 color) {
    for (int index = 0; index < ${EYE_CENTERS.length}; index++) color = applyEyelid(color, uEyeCenters[index]);
    return color;
  }
`;

const patchMaterial = (material, uniforms) => {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRestPosition;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRestPosition = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${EYELID_SHADER}`)
      .replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb = applyEyelids(diffuseColor.rgb);');
  };
  material.needsUpdate = true;
};

const createUniforms = () => ({
  uBlink: { value: 0 },
  uHappyEyes: { value: 0 },
  uEyeCenters: { value: EYE_CENTERS },
  uEyeHalfSize: { value: EYE_HALF_SIZE },
  uLidColor: { value: LID_COLOR },
  uLashColor: { value: LASH_COLOR },
});

const randomGap = () => MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);

const createBlinkTimer = () => {
  let nextBlinkAt = randomGap();
  return (seconds) => {
    const progress = (seconds - nextBlinkAt) / BLINK_DURATION;
    if (progress >= 1) {
      const isDouble = Math.random() < DOUBLE_BLINK_CHANCE;
      nextBlinkAt = seconds + (isDouble ? DOUBLE_BLINK_GAP : randomGap());
    }
    return progress > 0 && progress < 1 ? Math.sin(progress * Math.PI) : 0;
  };
};

export const createFace = (material) => {
  const uniforms = createUniforms();
  patchMaterial(material, uniforms);
  const getBlink = createBlinkTimer();
  let eased = 0;

  return (seconds, eyesClosed = 0) => {
    eased += (eyesClosed - eased) * EYES_CLOSED_EASING;
    uniforms.uHappyEyes.value = eased;
    uniforms.uBlink.value = Math.max(getBlink(seconds), eased);
  };
};
