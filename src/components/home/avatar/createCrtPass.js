import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  OrthographicCamera,
  Scene,
  SRGBColorSpace,
  ShaderMaterial,
  UnsignedByteType,
  Vector2,
  WebGLRenderTarget,
} from 'three';

// 1 is the full effect, 0 turns it off
const CRT_STRENGTH = 0.67;
// the light page makes the scanlines and grain stand out, so it gets half
const LIGHT_THEME_SHARE = 0.5;
// the rolling band loops seamlessly at this period, so time can wrap before floats lose precision
const TIME_LOOP = 100;
const SCANLINE_GAP_PX = 3;

const CRT_SHADER = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = position.xy * 0.5 + 0.5;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    #include <common>
    uniform sampler2D uScene;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uStrength;
    uniform vec2 uGrainOffset;
    varying vec2 vUv;

    // the classic sin() hash breaks into stripes on gpus with weak sin precision
    float random(vec2 point) {
      vec3 p = fract(vec3(point.xyx) * 0.1031);
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    void main() {
      vec2 split = vec2(1.2 * uStrength * uPixelRatio / uResolution.x, 0.0);
      vec4 center = texture2D(uScene, vUv);
      vec4 red = texture2D(uScene, vUv + split);
      vec4 blue = texture2D(uScene, vUv - split);
      vec3 color = vec3(red.r, center.g, blue.b);
      float alpha = max(center.a, max(red.a, blue.a));

      // a whole number of device pixels per line, or fractional pixel ratios shimmer into moire
      float gap = max(2.0, floor(${SCANLINE_GAP_PX}.0 * uPixelRatio + 0.5));
      float scanline = 1.0 - 0.18 * uStrength * (1.0 - sin(gl_FragCoord.y * PI2 / gap));
      float rollingBand = 1.0 + 0.06 * uStrength * smoothstep(0.0, 0.08, 0.08 - abs(fract(vUv.y * 0.6 - uTime * 0.12) - 0.5));
      float flicker = 1.0 - 0.03 * uStrength * (1.0 - sin(uTime * 55.0));
      float grain = (random(gl_FragCoord.xy + uGrainOffset) - 0.5) * 0.05 * uStrength;

      color = color * scanline * rollingBand * flicker + grain * alpha;
      gl_FragColor = vec4(color, alpha);
      #include <colorspace_fragment>
    }
  `,
};

// the theme switch sets data-theme on the root, and no attribute means light
const getStrength = () =>
  document.documentElement.dataset.theme === 'dark' ? CRT_STRENGTH : CRT_STRENGTH * LIGHT_THEME_SHARE;

const createFullscreenTriangle = () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  return geometry;
};

// half float targets need an extension some phones lack or get wrong, 8-bit srgb works everywhere
const createSceneTarget = () =>
  new WebGLRenderTarget(1, 1, { type: UnsignedByteType, colorSpace: SRGBColorSpace, samples: 4 });

export const createCrtPass = (renderer) => {
  const target = createSceneTarget();
  const material = new ShaderMaterial({
    ...CRT_SHADER,
    uniforms: {
      uScene: { value: target.texture },
      uResolution: { value: new Vector2() },
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uStrength: { value: getStrength() },
      uGrainOffset: { value: new Vector2() },
    },
    transparent: true,
    // the scene texture is already premultiplied from its transparent clear
    premultipliedAlpha: true,
    depthTest: false,
  });
  const quad = new Mesh(createFullscreenTriangle(), material);
  // the triangle is placed in clip space by the shader, so camera culling would wrongly hide it
  quad.frustumCulled = false;
  const quadScene = new Scene().add(quad);
  const quadCamera = new OrthographicCamera();

  const setSize = () => {
    const size = renderer.getDrawingBufferSize(new Vector2());
    target.setSize(size.x, size.y);
    material.uniforms.uResolution.value.copy(size);
    material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  };

  const render = (scene, camera, seconds) => {
    material.uniforms.uTime.value = seconds % TIME_LOOP;
    material.uniforms.uStrength.value = getStrength();
    material.uniforms.uGrainOffset.value.set(Math.random(), Math.random()).multiplyScalar(256);
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(quadScene, quadCamera);
  };

  // programs differ by output target, so the scene compiles against the one it renders into
  const compileAsync = (scene, camera) => {
    renderer.setRenderTarget(target);
    const compiled = renderer.compileAsync(scene, camera);
    renderer.setRenderTarget(null);
    return compiled;
  };

  const dispose = () => {
    target.dispose();
    material.dispose();
    quad.geometry.dispose();
  };

  return { setSize, render, compileAsync, dispose };
};
