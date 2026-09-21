<template>
  <canvas
    ref="canvas"
    class="plasma-backdrop"
    aria-hidden="true"
  />
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const canvas = ref(null);

  const VERTEX_SHADER = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  // plasma: three interfering sine fields, warped by fbm so the bands wander
  // instead of sliding, then grain on top
  const FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_bg;
    uniform vec3 u_c1;
    uniform vec3 u_c2;
    uniform vec3 u_c3;
    uniform float u_intensity;
    uniform float u_grain;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 p = uv;
      p.x *= u_resolution.x / u_resolution.y;

      float t = u_time * 0.05;
      float warp = fbm(p * 1.6 + t);

      float f = sin(p.x * 6.5 + t * 1.3 + warp * 3.2)
              + sin(p.y * 5.0 - t * 0.9 + warp * 2.6)
              + sin((p.x + p.y) * 4.2 + t * 1.1);
      f = f / 3.0 * 0.5 + 0.5;

      vec3 col = u_bg;
      col = mix(col, u_c1, smoothstep(0.35, 0.95, f) * u_intensity);
      col = mix(col, u_c2, smoothstep(0.55, 1.0, f) * u_intensity * 0.7);
      col = mix(col, u_c3, smoothstep(0.45, 0.0, f) * u_intensity * 0.6);

      float g = hash(gl_FragCoord.xy + fract(u_time) * 100.0);
      col += (g - 0.5) * u_grain;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const compile = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const readColor = (name, fallback) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const hex = /^#([0-9a-f]{6})$/i.exec(raw || fallback);
    const value = parseInt(hex ? hex[1] : fallback.slice(1), 16);

    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
  };

  const readNumber = (name, fallback) => {
    const raw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(raw) ? raw : fallback;
  };

  let gl = null;
  let program = null;
  let frame = null;
  let observer = null;
  let themeObserver = null;
  let resizeObserver = null;
  let isOnScreen = true;
  let uniforms = {};
  let startTime = 0;

  const readPalette = () => {
    if (!gl || !program) return;

    gl.useProgram(program);
    gl.uniform3fv(uniforms.bg, readColor('--default-background', '#f7f4f3'));
    gl.uniform3fv(uniforms.c1, readColor('--glow-1', '#c9748b'));
    gl.uniform3fv(uniforms.c2, readColor('--glow-2', '#9b3550'));
    gl.uniform3fv(uniforms.c3, readColor('--glow-3', '#7d4a63'));
    gl.uniform1f(uniforms.intensity, readNumber('--plasma-intensity', 0.26));
  };

  const resize = () => {
    const el = canvas.value;
    if (!el || !gl) return;

    // capped so a 3x phone-class display doesn't shade nine times the pixels
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const { width, height } = el.getBoundingClientRect();

    el.width = Math.max(1, Math.round(width * dpr));
    el.height = Math.max(1, Math.round(height * dpr));
    gl.viewport(0, 0, el.width, el.height);
  };

  const render = (now) => {
    frame = requestAnimationFrame(render);

    if (!gl || !isOnScreen || document.hidden) return;

    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, canvas.value.width, canvas.value.height);
    gl.uniform1f(uniforms.time, (now - startTime) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  };

  const start = () => {
    if (frame === null) frame = requestAnimationFrame(render);
  };

  const onVisibilityChange = () => (document.hidden ? stop() : start());

  onMounted(() => {
    const el = canvas.value;
    gl = el.getContext('webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      bg: gl.getUniformLocation(program, 'u_bg'),
      c1: gl.getUniformLocation(program, 'u_c1'),
      c2: gl.getUniformLocation(program, 'u_c2'),
      c3: gl.getUniformLocation(program, 'u_c3'),
      intensity: gl.getUniformLocation(program, 'u_intensity'),
      grain: gl.getUniformLocation(program, 'u_grain'),
    };

    gl.uniform1f(uniforms.grain, 0.05);
    readPalette();
    resize();

    startTime = performance.now();

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(el);

    // nothing to draw while the hero is scrolled away
    observer = new IntersectionObserver(([entry]) => { isOnScreen = entry.isIntersecting; });
    observer.observe(el);

    themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    document.addEventListener('visibilitychange', onVisibilityChange);
    start();
  });

  onUnmounted(() => {
    stop();
    observer?.disconnect();
    themeObserver?.disconnect();
    resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  });
</script>

<style lang="scss" scoped>
  .plasma-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    z-index: 0;
    // same fade as the css backdrop, so the hero still dissolves into About
    mask-image: linear-gradient(to bottom, #000 45%, transparent 88%);
  }
</style>
