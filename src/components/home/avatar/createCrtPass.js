import {
  BufferGeometry,
  Float32BufferAttribute,
  HalfFloatType,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from 'three';

// 1 is the full effect, 0 turns it off
const CRT_STRENGTH = 0.67;

// renders the scene into a texture, then draws it back with scanlines, rgb split and flicker.
// the canvas only holds the avatar, so the effect never touches the rest of the page
const CRT_SHADER = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = position.xy * 0.5 + 0.5;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D uScene;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uStrength;
    varying vec2 vUv;

    float random(vec2 point) {
      return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 split = vec2(1.2 * uStrength * uPixelRatio / uResolution.x, 0.0);
      vec4 center = texture2D(uScene, vUv);
      vec4 red = texture2D(uScene, vUv + split);
      vec4 blue = texture2D(uScene, vUv - split);
      vec3 color = vec3(red.r, center.g, blue.b);
      float alpha = max(center.a, max(red.a, blue.a));

      float line = gl_FragCoord.y / uPixelRatio;
      float scanline = 1.0 - 0.18 * uStrength * (1.0 - sin(line * 3.14159 * 0.66));
      float rollingBand = 1.0 + 0.06 * uStrength * smoothstep(0.0, 0.08, 0.08 - abs(fract(vUv.y * 0.6 - uTime * 0.12) - 0.5));
      float flicker = 1.0 - 0.03 * uStrength * (1.0 - sin(uTime * 55.0));
      float grain = (random(vUv * uResolution + uTime) - 0.5) * 0.05 * uStrength;

      color = color * scanline * rollingBand * flicker + grain * alpha;
      gl_FragColor = vec4(color, alpha);
      #include <colorspace_fragment>
    }
  `,
};

const createFullscreenTriangle = () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  return geometry;
};

export const createCrtPass = (renderer) => {
  const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 4 });
  const material = new ShaderMaterial({
    ...CRT_SHADER,
    uniforms: {
      uScene: { value: target.texture },
      uResolution: { value: new Vector2() },
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uStrength: { value: CRT_STRENGTH },
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
    material.uniforms.uTime.value = seconds;
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(quadScene, quadCamera);
  };

  const dispose = () => {
    target.dispose();
    material.dispose();
    quad.geometry.dispose();
  };

  return { setSize, render, dispose };
};
