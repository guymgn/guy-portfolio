'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import './Lanyard.css';

const CARD_SIZES = {
  portrait: [1.6, 2.25],
  landscape: [2.25, 1.6]
};
const ANCHORS = { left: 0.27, center: 0.5, right: 0.73 };
const THICKNESS = 0.018;
const BEVEL = 0.007;
const JOINTS = 4;
const NODE_WEIGHT = 1 / 0.05;
const MAX_STEP = 1 / 960;
const ITERATIONS = 2;
const SAMPLES = 72;
const FOV = 24;
const STRAP_WIDTH = 0.36;
// Half the distance between the two cards' rings along the shared clip.
const CLIP_HALF = 0.17;
// The two rings also sit at different depths on the clip so the cards hang
// in parallel planes instead of leaning into each other.
const CLIP_DEPTH = 0.11;
// The clip sits slightly askew so the two cards hang at different heights.
const CLIP_DROP = 0.06;
// Resting pose per card, so the pair reads as casually hung, not mirrored.
// yaw: resting turn toward/away from the viewer (radians). ringX: where the
// ring sits inside the (centered, wide) slot; off-center lets gravity tilt it.
const CARD_POSES = [{ yaw: -0.06, ringX: 0.07 }, { yaw: 0.12, ringX: -0.11 }];
const RING_RADIUS = 0.095;
const RING_TUBE = 0.0135;
const EYELET_RADIUS = 0.036;
const CLAMP_BODY = 0.15;
const FACE_WIDTH = 1024;

const FINISHES = {
  glossy: { roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, foil: 0, anisotropy: 0 },
  matte: { roughness: 1, metalness: 0, clearcoat: 0, clearcoatRoughness: 0.6, foil: 0, anisotropy: 0, specular: 0.35 },
  holographic: { roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, foil: 1, anisotropy: 0 },
  metallic: { roughness: 0.36, metalness: 0.75, clearcoat: 0.5, clearcoatRoughness: 0.18, foil: 0, anisotropy: 0.7 }
};

const BAND_COLUMNS = [0, 0.07, 0.93, 1];
const BAND_BEND = [-0.95, -0.28, 0.28, 0.95];
const FLIP_SPIN = 9;

const FOIL_VERTEX_HEAD = `
varying vec2 vFoilUv;
varying vec3 vFoilX;
varying vec3 vFoilY;
`;

const FOIL_VERTEX_BODY = `
vFoilUv = uv;
vFoilX = normalize((modelViewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
vFoilY = normalize((modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
`;

const FOIL_FRAGMENT_HEAD = `
uniform float foilStrength;
uniform float foilAspect;
uniform vec3 foilKey;
uniform vec3 foilFill;
uniform vec3 foilTop;
varying vec2 vFoilUv;
varying vec3 vFoilX;
varying vec3 vFoilY;

float foilHash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float foilBump(float t, float center, float width) {
  float x = (t - center) / width;
  return max(0.0, 1.0 - x * x);
}

vec3 foilSpectrum(float t) {
  return vec3(
    foilBump(t, 0.82, 0.32) + 0.4 * foilBump(t, 0.02, 0.12),
    foilBump(t, 0.5, 0.26),
    foilBump(t, 0.18, 0.24)
  );
}

vec3 foilGrating(float u, float spacing) {
  vec3 color = vec3(0.0);
  for (int m = 1; m <= 2; m++) {
    float order = float(m);
    float t = (spacing * abs(u) / order - 0.38) / 0.32;
    color += foilSpectrum(t) / order;
  }
  return color;
}

vec3 foilShard(vec2 p) {
  vec2 base = floor(p);
  float best = 9.0;
  float edge = 9.0;
  vec2 id = base;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = base + vec2(float(i), float(j));
      vec2 site = cell + vec2(foilHash(cell), foilHash(cell + 7.31)) * 0.9 + 0.05;
      float d = length(site - p);
      if (d < best) {
        edge = best;
        best = d;
        id = cell;
      } else if (d < edge) {
        edge = d;
      }
    }
  }
  return vec3(foilHash(id + 3.17), foilHash(id + 11.73), edge - best);
}
`;

const FOIL_FRAGMENT_BODY = `
if (foilStrength > 0.0) {
  vec3 foilView = normalize(vViewPosition);
  vec3 foilNormal = normalize(normal);
  vec2 foilP = vec2(vFoilUv.x, vFoilUv.y * foilAspect);
  vec3 shard = foilShard(foilP * 26.0);
  vec2 ray = foilP - vec2(-1.6, 2.6 * foilAspect);
  float angle = atan(ray.y, ray.x) + (shard.x - 0.5) * 0.16;
  vec3 grating = normalize(vFoilX * cos(angle) + vFoilY * sin(angle));
  float spacing = 1.7 * (0.95 + shard.y * 0.1);
  vec3 rainbow = foilGrating(dot(foilKey + foilView, grating), spacing);
  rainbow += 0.6 * foilGrating(dot(foilTop + foilView, grating), spacing);
  rainbow *= 0.8 + 0.2 * smoothstep(0.0, 0.04, shard.z);
  rainbow = max(rainbow - 0.35 * min(rainbow.r, min(rainbow.g, rainbow.b)), 0.0);
  vec2 grid = foilP * 64.0;
  vec2 cell = floor(grid);
  vec2 jitter = vec2(foilHash(cell + 1.7), foilHash(cell + 9.2));
  float flake = smoothstep(0.32, 0.06, length(fract(grid) - jitter * 0.6 - 0.2)) * step(0.45, foilHash(cell + 4.4));
  vec3 facet = normalize(foilNormal + (vFoilX * (jitter.x - 0.5) + vFoilY * (jitter.y - 0.5)) * 0.8);
  float glint = pow(max(dot(reflect(-foilKey, facet), foilView), 0.0), 28.0);
  glint += 0.7 * pow(max(dot(reflect(-foilTop, facet), foilView), 0.0), 28.0);
  float fine = 1.0 - smoothstep(0.35, 0.9, max(fwidth(grid.x), fwidth(grid.y)));
  vec3 sparkle = flake * glint * fine * (vec3(0.7) + foilGrating(dot(foilKey + foilView, grating) + jitter.x * 0.4, spacing));
  float ink = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float foil = foilStrength * (0.08 + 0.92 * smoothstep(0.04, 0.7, ink));
  float facing = clamp(dot(foilNormal, foilView), 0.0, 1.0);
  float tint = clamp(dot(rainbow, vec3(0.4)), 0.0, 1.0);
  outgoingLight = outgoingLight * (1.0 - foil * (0.3 + 0.32 * tint)) + (rainbow * 0.62 * (0.4 + 0.6 * facing) + sparkle * 1.6) * foil;
}
`;

const METALS = {
  silver: { color: '#d9dce2', roughness: 0.16 },
  gold: { color: '#e4b965', roughness: 0.2 },
  graphite: { color: '#4d4f55', roughness: 0.28 }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => a + (b - a) * t;

const parseColor = (value, fallback) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return fallback;
    ctx.fillStyle = '#000000';
    ctx.fillStyle = value;
    const resolved = ctx.fillStyle;
    if (resolved.startsWith('#')) {
      const n = parseInt(resolved.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    const parts = resolved.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return fallback;
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
  } catch {
    return fallback;
  }
};

const luminance = rgb => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
const toCss = (rgb, alpha = 1) =>
  `rgba(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)}, ${alpha})`;

const seeded = start => {
  let state = start >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const traceRoundedRect = (path, x, y, width, height, radius) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const k = r * 0.4477;
  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.bezierCurveTo(x + width - k, y, x + width, y + k, x + width, y + r);
  path.lineTo(x + width, y + height - r);
  path.bezierCurveTo(x + width, y + height - k, x + width - k, y + height, x + width - r, y + height);
  path.lineTo(x + r, y + height);
  path.bezierCurveTo(x + k, y + height, x, y + height - k, x, y + height - r);
  path.lineTo(x, y + r);
  path.bezierCurveTo(x, y + k, x + k, y, x + r, y);
};

const loadImage = (cache, url) => {
  if (!url) return Promise.resolve(null);
  const cached = cache.get(url);
  if (cached) return cached;
  const promise = new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
  cache.set(url, promise);
  return promise;
};

const cardLayout = (orientation, cornerRadius) => {
  const [width, height] = CARD_SIZES[orientation] || CARD_SIZES.portrait;
  const radius = mix(0.03, Math.min(width, height) * 0.2, clamp(cornerRadius, 0, 1));
  const slot = { width: 0.34, height: 0.07, y: height / 2 - 0.13 };
  // Thread the bottom of the ring through the slot's center, not the card face.
  const ringY = slot.y + RING_RADIUS;
  return { width, height, radius, slot, ringY, hangY: ringY + RING_RADIUS };
};

const buildCardGeometry = layout => {
  const { width, height, radius, slot } = layout;
  const outline = new THREE.Shape();
  traceRoundedRect(
    outline,
    -width / 2 + BEVEL,
    -height / 2 + BEVEL,
    width - BEVEL * 2,
    height - BEVEL * 2,
    Math.max(radius - BEVEL, 0.005)
  );
  const hole = new THREE.Path();
  traceRoundedRect(
    hole,
    (slot.x || 0) - slot.width / 2 - BEVEL,
    slot.y - slot.height / 2 - BEVEL,
    slot.width + BEVEL * 2,
    slot.height + BEVEL * 2,
    slot.height / 2 + BEVEL
  );
  outline.holes.push(hole);
  const body = new THREE.ExtrudeGeometry(outline, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 5,
    curveSegments: 24
  });
  body.translate(0, 0, -THICKNESS / 2);
  const face = new THREE.ShapeGeometry(outline, 24);
  const position = face.getAttribute('position');
  const uv = face.getAttribute('uv');
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + width / 2) / width, (position.getY(i) + height / 2) / height);
  }
  uv.needsUpdate = true;
  return { body, face };
};

const buildClampGeometry = width => {
  const shape = new THREE.Shape();
  const w = width * 1.16;
  traceRoundedRect(shape, -w / 2 + 0.014, -CLAMP_BODY / 2 + 0.014, w - 0.028, CLAMP_BODY - 0.028, 0.024);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 6,
    curveSegments: 10
  });
  geometry.translate(0, 0, -0.01);
  return geometry;
};

const buildBandGeometry = count => {
  const columns = BAND_COLUMNS.length;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * columns * 2), 2));
  const index = [];
  for (let i = 0; i < count - 1; i++) {
    for (let c = 0; c < columns - 1; c++) {
      const a = i * columns + c;
      index.push(a, a + columns, a + 1, a + 1, a + columns, a + columns + 1);
    }
  }
  geometry.setIndex(index);
  return geometry;
};

const buildEnvironment = renderer => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0.035, 0.035, 0.04);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials = [];
  const panel = (intensity, position, scale, rotation = 0) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(intensity, intensity, intensity),
      side: THREE.DoubleSide
    });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(scale[0], scale[1], 1);
    mesh.lookAt(0, 0, 0);
    mesh.rotateZ(rotation);
    scene.add(mesh);
  };
  panel(2.6, [0, 4.5, 8], [9, 4]);
  panel(6, [-5.5, 0.5, 7], [0.9, 14]);
  panel(4, [5, -0.5, 8], [0.6, 14]);
  panel(3.5, [0, -1, 9], [24, 0.35], Math.PI / 3);
  panel(2.5, [1, 2.5, 9], [24, 0.2], Math.PI / 3);
  panel(1.4, [0, 6, -6], [12, 4]);
  panel(0.5, [0, -7, 1], [16, 6]);
  panel(0.9, [8, 0, -2], [4, 10]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.035);
  pmrem.dispose();
  geometry.dispose();
  materials.forEach(material => material.dispose());
  return target;
};

const makeCanvasTexture = (canvas, anisotropy) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
};

const buildGrainTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const random = seeded(7);
  const field = Float32Array.from({ length: size * size }, () => random());
  const height = (x, y) => {
    let sum = 0;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) sum += field[((y + j + size) % size) * size + ((x + i + size) % size)];
    }
    return (sum / 9) * 1.6;
  };
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = height((x - 1 + size) % size, y) - height((x + 1) % size, y);
      const ny = height(x, (y - 1 + size) % size) - height(x, (y + 1) % size);
      const length = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      image.data[i] = ((nx / length) * 0.5 + 0.5) * 255;
      image.data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      image.data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 7);
  return texture;
};

const buildWeaveTexture = () => {
  const size = 128;
  const threads = 8;
  const random = seeded(19);
  const fiber = Float32Array.from({ length: size * size }, () => random());
  const profile = f => Math.sqrt(Math.max(0, 1 - 4 * f * f));
  const height = (x, y) => {
    const px = ((x % size) + size) % size;
    const py = ((y % size) + size) % size;
    const u = (px / size) * threads;
    const v = (py / size) * threads;
    const cu = Math.floor(u);
    const cv = Math.floor(v);
    const fu = u - cu - 0.5;
    const fv = v - cv - 0.5;
    const lift = (cu + cv) % 2 === 0;
    const warp = profile(fu) * (0.55 + 0.45 * Math.cos(fv * Math.PI * (lift ? 1 : 0.6)));
    const weft = profile(fv) * (0.55 + 0.45 * Math.cos(fu * Math.PI * (lift ? 0.6 : 1)));
    return (lift ? Math.max(warp, weft * 0.7) : Math.max(weft, warp * 0.7)) + fiber[py * size + px] * 0.08;
  };
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (height(x - 1, y) - height(x + 1, y)) * 1.6;
      const ny = (height(x, y - 1) - height(x, y + 1)) * 1.6;
      const length = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      data[i] = ((nx / length) * 0.5 + 0.5) * 255;
      data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
};

const drawFitted = (ctx, image, width, height, fit) => {
  const scale = (fit === 'contain' ? Math.min : Math.max)(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
};

const faceBackgrounds = new Map();
const pixelCanvas = typeof document === 'undefined' ? null : document.createElement('canvas');

// Gradient plus stable, monochrome grain, cached so repeated repaints (such as
// the pixel reveal) don't recompute it.
const faceBackground = (width, height, color, gradientEnd) => {
  const key = `${width}x${height}|${color.join(',')}|${gradientEnd}`;
  const cached = faceBackgrounds.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.fillStyle = toCss(color);
  if (gradientEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, toCss(color));
    gradient.addColorStop(1, toCss(parseColor(gradientEnd, color)));
    ctx.fillStyle = gradient;
  }
  ctx.fillRect(0, 0, width, height);
  const background = ctx.getImageData(0, 0, width, height);
  const random = seeded(47);
  for (let i = 0; i < background.data.length; i += 4) {
    const grain = (random() - 0.5) * 24;
    background.data[i] += grain;
    background.data[i + 1] += grain;
    background.data[i + 2] += grain;
  }
  ctx.putImageData(background, 0, 0);
  faceBackgrounds.set(key, canvas);
  return canvas;
};

// columns > 0 draws the artwork as a grid of that many blocks across, used
// for the low-res placeholder and the reveal once the full image arrives.
const paintFace = (canvas, image, color, fit, gradientEnd, columns = 0) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(faceBackground(canvas.width, canvas.height, color, gradientEnd), 0, 0);
  if (!image) return;
  if (columns > 0 && pixelCanvas) {
    const rows = Math.max(1, Math.round((columns * canvas.height) / canvas.width));
    pixelCanvas.width = columns;
    pixelCanvas.height = rows;
    const small = pixelCanvas.getContext('2d');
    if (small) {
      small.imageSmoothingEnabled = true;
      small.clearRect(0, 0, columns, rows);
      drawFitted(small, image, columns, rows, fit);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pixelCanvas, 0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      return;
    }
  }
  drawFitted(ctx, image, canvas.width, canvas.height, fit);
};

const paintStrap = (canvas, image, color) => {
  const across = 192;
  const along = image ? Math.max(64, Math.round((image.width / image.height) * across)) : across * 2;
  canvas.width = across;
  canvas.height = along;
  const ctx = canvas.getContext('2d');
  if (!ctx) return along / across;
  ctx.fillStyle = toCss(color);
  ctx.fillRect(0, 0, across, along);
  if (image) {
    ctx.save();
    ctx.translate(across, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(image, 0, 0, along, across);
    ctx.restore();
    return along / across;
  }
  const ink = luminance(color) > 0.5 ? [0, 0, 0] : [1, 1, 1];
  ctx.fillStyle = toCss(ink, 0.05);
  for (let y = 0; y < along; y += 4) ctx.fillRect(0, y, across, 1);
  ctx.fillStyle = toCss(ink, 0.2);
  for (let y = 0; y < along; y += 14) {
    ctx.fillRect(across * 0.075, y, 2, 8);
    ctx.fillRect(across * 0.925 - 2, y, 2, 8);
  }
  return along / across;
};

const createSimulation = () => {
  const vectors = () => Array.from({ length: JOINTS + 1 }, () => new THREE.Vector3());
  return {
    nodes: vectors(),
    previous: vectors(),
    velocities: vectors(),
    lengths: new Float64Array(JOINTS),
    impulses: new Float64Array(JOINTS),
    rest: 1,
    anchor: new THREE.Vector3(),
    body: {
      position: new THREE.Vector3(),
      previous: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      previousQuaternion: new THREE.Quaternion(),
      angular: new THREE.Vector3(),
      mass: 1,
      inverseInertia: new THREE.Vector3(1, 1, 1),
      hang: new THREE.Vector3()
    },
    // Offset from the clip center (strap end) to this card's ring pivot.
    clip: new THREE.Vector3(),
    grab: null,
    turn: 0,
    restTurn: 0,
    twist: 0,
    twistRaw: 0,
    calm: 0
  };
};

const scratch = {
  h: new THREE.Vector3(),
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  c: new THREE.Vector3(),
  d: new THREE.Vector3(),
  e: new THREE.Vector3(),
  f: new THREE.Vector3(),
  g: new THREE.Vector3(),
  pin: new THREE.Vector3(),
  q: new THREE.Quaternion(),
  r: new THREE.Quaternion()
};

const applyInverseInertia = (body, vector, out) => {
  scratch.r.copy(body.quaternion).invert();
  out.copy(vector).applyQuaternion(scratch.r);
  out.set(out.x * body.inverseInertia.x, out.y * body.inverseInertia.y, out.z * body.inverseInertia.z);
  return out.applyQuaternion(body.quaternion);
};

const rotateBody = (q, w) => {
  const { x: qx, y: qy, z: qz, w: qw } = q;
  q.x += 0.5 * (w.x * qw + w.y * qz - w.z * qy);
  q.y += 0.5 * (w.y * qw + w.z * qx - w.x * qz);
  q.z += 0.5 * (w.z * qw + w.x * qy - w.y * qx);
  q.w += 0.5 * (-w.x * qx - w.y * qy - w.z * qz);
  q.normalize();
};

const bodyWeight = (body, r, normal) => {
  const rn = scratch.c.crossVectors(r, normal);
  return 1 / body.mass + rn.dot(applyInverseInertia(body, rn, scratch.d));
};

const pushBody = (body, r, impulse) => {
  body.position.addScaledVector(impulse, 1 / body.mass);
  rotateBody(body.quaternion, applyInverseInertia(body, scratch.e.crossVectors(r, impulse), scratch.f));
};

const solveSegment = (sim, i, h, physics) => {
  const { nodes, body } = sim;
  const a = nodes[i];
  const wa = i === 0 ? 0 : NODE_WEIGHT;
  const last = i === JOINTS - 1;
  const r = scratch.g;
  let b = nodes[i + 1];
  if (last) {
    r.copy(body.hang).applyQuaternion(body.quaternion);
    b = scratch.b.copy(body.position).add(r).sub(sim.clip);
  }
  const delta = scratch.a.subVectors(b, a);
  const length = delta.length();
  const stretch = length - sim.rest;
  if (stretch <= 0 || length < 1e-9) return;
  const normal = delta.divideScalar(length);
  const wb = last ? bodyWeight(body, r, normal) : NODE_WEIGHT;
  const rate = (length - sim.lengths[i]) / h;
  const tension =
    physics.hold * Math.tanh((physics.stiffness * stretch) / physics.hold) +
    physics.spring * stretch +
    physics.bandDamping * Math.max(0, rate);
  const room = tension * h * h - sim.impulses[i];
  if (room <= 0) return;
  const lambda = Math.min(stretch / (wa + wb), room);
  sim.impulses[i] += lambda;
  if (wa) a.addScaledVector(normal, lambda * wa);
  if (last) pushBody(body, r, normal.multiplyScalar(-lambda));
  else b.addScaledVector(normal, -lambda * wb);
};

const solvePin = (body, grab, target) => {
  const r = scratch.g.copy(grab.local).applyQuaternion(body.quaternion);
  const delta = scratch.a.copy(target).sub(body.position).sub(r);
  const distance = delta.length();
  if (distance < 1e-9) return;
  const normal = delta.divideScalar(distance);
  const lambda = distance / bodyWeight(body, r, normal);
  pushBody(body, r, normal.multiplyScalar(lambda));
};

// The clip is a short horizontal bar whose ends carry each card's ring. It
// turns with the cards (so flips carry both sides around) but never tilts.
const clipOffset = (first, second, out) => {
  out.set(1, 0, 0).applyQuaternion(first.quaternion);
  out.add(scratch.h.set(1, 0, 0).applyQuaternion(second.quaternion));
  out.y = 0;
  if (out.lengthSq() < 1e-6) {
    out.set(1, 0, 0).applyQuaternion(first.quaternion);
    out.y = 0;
  }
  if (out.lengthSq() < 1e-6) out.set(1, 0, 0);
  out.normalize();
  const depth = scratch.h.set(-out.z, 0, out.x);
  out.multiplyScalar(CLIP_HALF).addScaledVector(depth, CLIP_DEPTH);
  out.y = CLIP_DROP;
  return out;
};

// Couple two rigid cards at opposite ends of the clip, sharing drag forces
// with the strap. The first card's pivot sits at +clip, the second at -clip.
const solveSharedAttachment = (first, second, clip) => {
  const ra = first.hang.clone().applyQuaternion(first.quaternion);
  const rb = second.hang.clone().applyQuaternion(second.quaternion);
  const delta = second.position.clone().add(rb).sub(first.position).sub(ra).addScaledVector(clip, 2);
  const distance = delta.length();
  if (distance < 1e-9) return;
  const normal = delta.divideScalar(distance);
  const impulse = normal.multiplyScalar(distance / (bodyWeight(first, ra, normal) + bodyWeight(second, rb, normal)));
  pushBody(first, ra, impulse);
  pushBody(second, rb, impulse.negate());
};

const contactAxes = Array.from({ length: 15 }, () => new THREE.Vector3());
const contactDelta = new THREE.Vector3();
const contactNormal = new THREE.Vector3();

// Separating-axis collision test for the complete, rotated card volumes.
const cardPenetration = (first, second) => {
  for (let i = 0; i < 3; i++) {
    contactAxes[i].set(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0).applyQuaternion(first.quaternion);
    contactAxes[i + 3].set(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0).applyQuaternion(second.quaternion);
  }
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    contactAxes[6 + i * 3 + j].crossVectors(contactAxes[i], contactAxes[j + 3]);
  }
  contactDelta.subVectors(first.position, second.position);
  let depth = Infinity;
  for (const axis of contactAxes) {
    if (axis.lengthSq() < 1e-10) continue;
    axis.normalize();
    let radius = 0;
    for (let i = 0; i < 3; i++) {
      radius += first.halfExtents[i] * Math.abs(axis.dot(contactAxes[i]));
      radius += second.halfExtents[i] * Math.abs(axis.dot(contactAxes[i + 3]));
    }
    const distance = contactDelta.dot(axis);
    const overlap = radius - Math.abs(distance);
    if (overlap <= 0) return 0;
    if (overlap < depth) {
      depth = overlap;
      contactNormal.copy(axis).multiplyScalar(distance < 0 ? -1 : 1);
    }
  }
  return depth;
};

const solveCardContact = (first, second) => {
  const depth = cardPenetration(first, second);
  if (!depth) return false;
  const correction = (depth + 1e-5) / 2;
  first.position.addScaledVector(contactNormal, correction);
  second.position.addScaledVector(contactNormal, -correction);
  // Separation is a positional repair, not an impact impulse. Move the
  // velocity reference too, so tiny overlap corrections cannot launch cards.
  first.previous.addScaledVector(contactNormal, correction);
  second.previous.addScaledVector(contactNormal, -correction);
  return true;
};

const placeHanging = (sim, layout, intro) => {
  const { nodes, previous, velocities, body, anchor } = sim;
  nodes[0].copy(anchor);
  for (let i = 1; i <= JOINTS; i++) {
    nodes[i].copy(nodes[i - 1]);
    if (intro) nodes[i].x += sim.rest;
    else nodes[i].y -= sim.rest;
  }
  body.quaternion.identity();
  if (intro) body.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  body.hang.set(0, layout.hangY, 0);
  const offset = scratch.a.copy(body.hang).applyQuaternion(body.quaternion);
  body.position.copy(nodes[JOINTS]).sub(offset);
  body.previous.copy(body.position);
  body.previousQuaternion.copy(body.quaternion);
  body.velocity.set(0, 0, 0);
  body.angular.set(0, 0, 0);
  for (let i = 0; i <= JOINTS; i++) {
    previous[i].copy(nodes[i]);
    velocities[i].set(0, 0, 0);
  }
  sim.lengths.fill(sim.rest);
  sim.turn = 0;
  sim.twist = 0;
  sim.twistRaw = 0;
  sim.calm = 0;
};

const configureSimulation = (sim, layout, length) => {
  sim.rest = length / JOINTS;
  const { width, height } = layout;
  const body = sim.body;
  const t = THICKNESS + BEVEL * 2;
  body.mass = 1;
  body.halfExtents = [width / 2, height / 2, t / 2 + 0.006];
  body.inverseInertia.set(
    12 / (height * height + t * t),
    12 / (width * width + t * t),
    12 / (width * width + height * height)
  );
  body.hang.set(0, layout.hangY, 0);
};

const stepSimulation = (sim, dt, physics, time, companion = null) => {
  const steps = Math.max(1, Math.ceil(dt / MAX_STEP - 1e-6));
  const h = dt / steps;
  const { nodes, previous, velocities, body } = sim;
  const windX = physics.breeze * (Math.sin(time * 0.53) * 0.7 + Math.sin(time * 1.31 + 1.7) * 0.3) * 3;
  const windZ = physics.breeze * Math.sin(time * 0.37 + 0.6) * 2;
  const grab = sim.grab;
  const pin = scratch.pin;
  const nodeDrag = Math.exp(-physics.nodeDrag * h);
  const linearDrag = Math.exp(-physics.linearDrag * h);
  const angularDrag = Math.exp(-physics.angularDrag * h);

  for (let s = 0; s < steps; s++) {
    let touching = false;
    for (let i = 1; i < JOINTS; i++) {
      const v = velocities[i];
      v.y -= physics.gravity * h;
      v.x += windX * h;
      v.z += windZ * h;
      previous[i].copy(nodes[i]);
      nodes[i].addScaledVector(v, h);
    }

    body.previous.copy(body.position);
    body.previousQuaternion.copy(body.quaternion);
    const q = body.quaternion;
    if (grab) {
      const turn = scratch.q.copy(grab.rotation).multiply(scratch.r.copy(q).invert());
      if (turn.w < 0) turn.set(-turn.x, -turn.y, -turn.z, -turn.w);
      const torque = scratch.a.set(turn.x, turn.y, turn.z).multiplyScalar(2 * physics.grip);
      torque.addScaledVector(body.angular, -physics.gripDamping);
      body.angular.addScaledVector(applyInverseInertia(body, torque, scratch.b), h);
    }
    const up = scratch.a.set(0, 1, 0).applyQuaternion(q);
    const front = scratch.b.set(-up.x * up.z, -up.y * up.z, 1 - up.z * up.z);
    if (front.lengthSq() > 1e-3) {
      const facing = scratch.d.set(0, 0, 1).applyQuaternion(q);
      const raw = Math.atan2(scratch.e.crossVectors(front, facing).dot(up), front.dot(facing));
      let turned = raw - sim.twistRaw;
      if (turned > Math.PI) turned -= Math.PI * 2;
      else if (turned < -Math.PI) turned += Math.PI * 2;
      sim.twist += turned;
      sim.twistRaw = raw;
    }
    if (!grab) {
      const spin = body.angular.dot(up);
      body.angular.addScaledVector(up, (physics.twist * (sim.turn + sim.restTurn - sim.twist) - physics.twistDamping * spin) * h);
    }
    body.velocity.y -= physics.gravity * h;
    body.velocity.x += windX * 0.35 * h;
    body.velocity.z += windZ * 0.35 * h;
    body.position.addScaledVector(body.velocity, h);
    rotateBody(body.quaternion, scratch.f.copy(body.angular).multiplyScalar(h));

    if (companion) {
      // The companion has its own rotation and drag state, but no second strap.
      stepSimulation(companion, h, physics, time + 0.7);
    }

    if (companion) clipOffset(body, companion.body, sim.clip);
    else sim.clip.set(0, 0, 0);
    sim.impulses.fill(0);
    if (grab) pin.lerpVectors(grab.from, grab.target, (s + 1) / steps);
    for (let iteration = 0; iteration < ITERATIONS; iteration++) {
      if (!sim.freeCard) for (let i = 0; i < JOINTS; i++) solveSegment(sim, i, h, physics);
      if (grab) solvePin(body, grab, pin);
      if (companion) {
        solveSharedAttachment(body, companion.body, sim.clip);
        if (companion.grab) solvePin(companion.body, companion.grab, companion.grab.target);
        touching = solveCardContact(body, companion.body) || touching;
      }
    }

    if (companion) {
      const other = companion.body;
      other.velocity.subVectors(other.position, other.previous).divideScalar(h).multiplyScalar(linearDrag);
      const dq = scratch.q.copy(other.previousQuaternion).invert().premultiply(other.quaternion);
      other.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1) * angularDrag);
      if (other.velocity.lengthSq() > 3600) other.velocity.setLength(60);
      if (other.angular.lengthSq() > 1600) other.angular.setLength(40);
    }

    for (let i = 1; i < JOINTS; i++) {
      const v = velocities[i].subVectors(nodes[i], previous[i]).divideScalar(h).multiplyScalar(nodeDrag);
      v.multiplyScalar(1 / (1 + physics.nodeAir * v.length() * h));
    }
    body.velocity.subVectors(body.position, body.previous).divideScalar(h);
    const dq = scratch.q.copy(body.previousQuaternion).invert().premultiply(body.quaternion);
    body.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1));

    const normal = scratch.a.set(0, 0, 1).applyQuaternion(body.quaternion);
    const across = body.velocity.dot(normal);
    const along = scratch.b.copy(body.velocity).addScaledVector(normal, -across);
    along.multiplyScalar(1 / (1 + physics.air * along.length() * h));
    body.velocity
      .copy(along)
      .addScaledVector(normal, across / (1 + physics.broadside * Math.abs(across) * h))
      .multiplyScalar(linearDrag);
    body.angular.multiplyScalar(angularDrag / (1 + physics.spinAir * body.angular.length() * h));
    if (body.velocity.lengthSq() > 3600) body.velocity.setLength(60);
    if (body.angular.lengthSq() > 1600) body.angular.setLength(40);

    if (companion && touching) {
      // Inelastic contact: discard closing speed instead of allowing the same
      // collision/attachment disagreement to be amplified on the next substep.
      const closing = scratch.a.subVectors(body.velocity, companion.body.velocity).dot(contactNormal);
      if (closing < 0) {
        body.velocity.addScaledVector(contactNormal, -closing / 2);
        companion.body.velocity.addScaledVector(contactNormal, closing / 2);
      }
    }

    nodes[JOINTS].copy(body.hang).applyQuaternion(body.quaternion).add(body.position).sub(sim.clip);
    for (let i = 0; i < JOINTS; i++) sim.lengths[i] = nodes[i].distanceTo(nodes[i + 1]);
  }

  if (grab) grab.from.copy(grab.target);

  let energy = body.velocity.lengthSq() + body.angular.lengthSq() * 0.3;
  for (let i = 1; i < JOINTS; i++) energy += velocities[i].lengthSq() * 0.05;
  sim.calm = energy < 2e-4 ? sim.calm + dt : 0;
};

const Lanyard = ({
  frontImage,
  backImage,
  // Optional artwork and card color for the second badge. Without them the
  // second badge reuses the first badge's images, swapped.
  secondFrontImage,
  secondBackImage,
  secondCardColor = null,
  // Optional tiny versions of the four faces (for example inline data URIs),
  // shown pixelated until the full images load.
  placeholders = null,
  imageFit = 'cover',
  cardColor = '#ffffff',
  cardGradientEnd = null,
  secondCard = false,
  orientation = 'portrait',
  finish = 'glossy',
  cornerRadius = 0.3,
  size = 0.6,
  anchor = 'center',
  strapLength = 0.5,
  strapImage,
  strapColor = '#111111',
  strapWidth = 0.65,
  metal = 'silver',
  gravity = 1,
  damping = 0.5,
  elasticity = 0.5,
  breeze = 0.5,
  interactive = true,
  intro = true,
  className = '',
  onInteraction,
  style
}) => {
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const applyRef = useRef(null);

  settingsRef.current = {
    frontImage,
    backImage,
    secondFrontImage,
    secondBackImage,
    secondCardColor,
    placeholders,
    imageFit: imageFit === 'contain' ? 'contain' : 'cover',
    cardColor,
    cardGradientEnd,
    secondCard,
    orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
    finish,
    cornerRadius,
    size,
    anchor,
    strapLength,
    strapImage,
    strapColor,
    strapWidth,
    metal,
    gravity,
    damping,
    elasticity,
    breeze,
    interactive,
    onInteraction,
    intro
  };

  useEffect(() => {
    applyRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    const canvas = renderer.domElement;
    canvas.className = 'lanyard-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const scene = new THREE.Scene();
    const environment = buildEnvironment(renderer);
    scene.environment = environment.texture;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(-2.5, 4, 6);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
    fillLight.position.set(3, -1, 4);
    scene.add(keyLight, fillLight);

    const imageCache = new Map();
    const images = { front: null, back: null, strap: null, secondFront: null, secondBack: null };
    const tiny = { front: null, back: null, secondFront: null, secondBack: null };
    // Block count per face while its full image is being revealed (0 = sharp).
    const reveal = { front: 0, back: 0, secondFront: 0, secondBack: 0 };
    const revealTimers = new Set();
    // Which source each face falls back to when its own image is missing.
    const FACE_SOURCES = {
      front: ['front'],
      back: ['back', 'front'],
      secondFront: ['secondFront', 'back', 'front'],
      secondBack: ['secondBack', 'front']
    };
    const faceArt = face => {
      for (const key of FACE_SOURCES[face]) {
        if (images[key]) return { image: images[key], columns: reveal[key] };
        if (tiny[key]) return { image: tiny[key], columns: tiny[key].width };
      }
      return { image: null, columns: 0 };
    };
    const frontCanvas = document.createElement('canvas');
    const backCanvas = document.createElement('canvas');
    const strapCanvas = document.createElement('canvas');
    const frontTexture = makeCanvasTexture(frontCanvas, anisotropy);
    const backTexture = makeCanvasTexture(backCanvas, anisotropy);
    const secondFrontCanvas = document.createElement('canvas');
    const secondBackCanvas = document.createElement('canvas');
    const secondFrontTexture = makeCanvasTexture(secondFrontCanvas, anisotropy);
    const secondBackTexture = makeCanvasTexture(secondBackCanvas, anisotropy);
    const strapTexture = makeCanvasTexture(strapCanvas, anisotropy);
    strapTexture.wrapS = THREE.ClampToEdgeWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    const grain = buildGrainTexture();
    const weave = buildWeaveTexture();
    const foilUniforms = {
      foilStrength: { value: 0 },
      foilAspect: { value: 1.4 },
      foilKey: { value: new THREE.Vector3() },
      foilFill: { value: new THREE.Vector3() },
      foilTop: { value: new THREE.Vector3() }
    };
    const injectFoil = shader => {
      Object.assign(shader.uniforms, foilUniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${FOIL_VERTEX_HEAD}`)
        .replace('#include <project_vertex>', `#include <project_vertex>\n${FOIL_VERTEX_BODY}`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${FOIL_FRAGMENT_HEAD}`)
        .replace('#include <opaque_fragment>', `${FOIL_FRAGMENT_BODY}\n#include <opaque_fragment>`);
    };

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.06, 0.06)
    });
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.06, 0.06)
    });
    const secondFrontMaterial = new THREE.MeshPhysicalMaterial({
      map: secondFrontTexture,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.06, 0.06)
    });
    const secondBackMaterial = new THREE.MeshPhysicalMaterial({
      map: secondBackTexture,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.06, 0.06)
    });
    const faceMaterials = [frontMaterial, backMaterial, secondFrontMaterial, secondBackMaterial];
    faceMaterials.forEach(material => {
      material.onBeforeCompile = injectFoil;
    });
    const edgeMaterial = new THREE.MeshPhysicalMaterial();
    const secondEdgeMaterial = new THREE.MeshPhysicalMaterial();
    const metalMaterial = new THREE.MeshStandardMaterial({ metalness: 1 });
    const bandMaterial = new THREE.MeshPhysicalMaterial({
      map: strapTexture,
      normalMap: weave,
      normalScale: new THREE.Vector2(0.7, 0.7),
      roughness: 0.68,
      sheen: 1,
      sheenRoughness: 0.42,
      sheenColor: new THREE.Color(0.32, 0.32, 0.34),
      side: THREE.DoubleSide
    });

    const cardGroup = new THREE.Group();
    const bodyMesh = new THREE.Mesh(undefined, edgeMaterial);
    const frontMesh = new THREE.Mesh(undefined, frontMaterial);
    const backMesh = new THREE.Mesh(undefined, backMaterial);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 18, 72), metalMaterial);
    ring.rotation.y = Math.PI / 2 - 0.7;
    cardGroup.add(bodyMesh, frontMesh, backMesh, ring);
    scene.add(cardGroup);

    const secondGroup = new THREE.Group();
    const secondBodyMesh = new THREE.Mesh(undefined, secondEdgeMaterial);
    const secondFrontMesh = new THREE.Mesh(undefined, secondFrontMaterial);
    const secondBackMesh = new THREE.Mesh(undefined, secondBackMaterial);
    const secondRing = new THREE.Mesh(ring.geometry, metalMaterial);
    secondRing.rotation.copy(ring.rotation);
    secondGroup.add(secondBodyMesh, secondFrontMesh, secondBackMesh, secondRing);
    scene.add(secondGroup);

    const bandGeometry = buildBandGeometry(SAMPLES);
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.frustumCulled = false;
    scene.add(band);

    const clampGroup = new THREE.Group();
    const clampMesh = new THREE.Mesh(buildClampGeometry(STRAP_WIDTH), metalMaterial);
    clampMesh.position.y = EYELET_RADIUS + CLAMP_BODY / 2 - 0.004;
    const eyelet = new THREE.Mesh(new THREE.TorusGeometry(EYELET_RADIUS, 0.0105, 14, 40), metalMaterial);
    clampGroup.add(clampMesh, eyelet);
    scene.add(clampGroup);
    // Bar through both rings when two cards share the clip.
    const clipBar = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1, 14), metalMaterial);
    clipBar.visible = false;
    scene.add(clipBar);
    const pinA = new THREE.Vector3();
    const pinB = new THREE.Vector3();

    const sim = createSimulation();
    const companion = createSimulation();
    companion.freeCard = true;
    let activeSim = null;
    const controls = [];
    const mouth = new THREE.Vector3();
    const tuck = new THREE.Vector3();
    const curve = new THREE.CatmullRomCurve3(controls, false, 'centripetal');
    const view = { width: 1, height: 1, frameWidth: 1 };
    let layout = cardLayout('portrait', 0.3);
    let applied = {};
    let strapScale = STRAP_WIDTH;
    let tileRatio = 2;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let visible = true;
    let alive = true;
    let placed = false;
    let hovering = false;
    let press = null;
    let imageToken = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const placeCards = (intro) => {
      placeHanging(sim, layout, intro);
      configureSimulation(companion, layout, sim.rest * JOINTS);
      placeHanging(companion, layout, false);
      if (!settingsRef.current.secondCard) return;
      const attachment = sim.nodes[JOINTS].clone();
      sim.body.hang.set(CARD_POSES[0].ringX, layout.hangY, 0);
      companion.body.hang.set(CARD_POSES[1].ringX, layout.hangY, 0);
      sim.body.quaternion.identity();
      companion.body.quaternion.identity();
      sim.clip.set(CLIP_HALF, CLIP_DROP, CLIP_DEPTH);
      [sim, companion].forEach((card, index) => { card.restTurn = CARD_POSES[index].yaw; });
      for (const [card, side] of [[sim, 1], [companion, -1]]) {
        card.body.position.copy(attachment).addScaledVector(sim.clip, side)
          .sub(card.body.hang.clone().applyQuaternion(card.body.quaternion));
        card.body.previous.copy(card.body.position);
        card.body.previousQuaternion.copy(card.body.quaternion);
      }
    };

    const paintFaces = (onlyFaces = null) => {
      const s = settingsRef.current;
      const color = parseColor(s.cardColor, [1, 1, 1]);
      const width = FACE_WIDTH;
      const height = Math.round((FACE_WIDTH * layout.height) / layout.width);
      if (frontCanvas.width !== width || frontCanvas.height !== height) {
        frontCanvas.width = width;
        frontCanvas.height = height;
        backCanvas.width = width;
        backCanvas.height = height;
        secondFrontCanvas.width = width;
        secondFrontCanvas.height = height;
        secondBackCanvas.width = width;
        secondBackCanvas.height = height;
        frontTexture.dispose();
        backTexture.dispose();
        secondFrontTexture.dispose();
        secondBackTexture.dispose();
      }
      const secondColor = s.secondCardColor ? parseColor(s.secondCardColor, color) : color;
      const secondGradient = s.secondCardColor ? null : s.cardGradientEnd;
      const faces = {
        front: [frontCanvas, frontTexture, color, s.cardGradientEnd],
        back: [backCanvas, backTexture, color, s.cardGradientEnd],
        secondFront: [secondFrontCanvas, secondFrontTexture, secondColor, secondGradient],
        secondBack: [secondBackCanvas, secondBackTexture, secondColor, secondGradient]
      };
      for (const face of onlyFaces || Object.keys(faces)) {
        const [canvas, texture, faceColor, gradientEnd] = faces[face];
        const { image, columns } = faceArt(face);
        paintFace(canvas, image, faceColor, s.imageFit, gradientEnd, columns);
        texture.needsUpdate = true;
      }
      start();
    };

    // Sharpen a freshly loaded image from coarse blocks to full detail.
    const REVEAL_STEPS = [48, 96, 192, 384, 0];
    const revealImage = key => {
      const affected = Object.keys(FACE_SOURCES).filter(face => FACE_SOURCES[face].includes(key));
      if (reducedMotion || !tiny[key]) {
        reveal[key] = 0;
        paintFaces(affected);
        return;
      }
      REVEAL_STEPS.forEach((columns, index) => {
        const timer = setTimeout(() => {
          revealTimers.delete(timer);
          if (!alive) return;
          reveal[key] = columns;
          paintFaces(affected);
        }, index * 70);
        revealTimers.add(timer);
      });
    };

    const repaintStrap = () => {
      const s = settingsRef.current;
      tileRatio = paintStrap(strapCanvas, images.strap, parseColor(s.strapColor, [0.07, 0.07, 0.07]));
      weave.repeat.set(2, 2 * tileRatio);
      strapTexture.dispose();
      strapTexture.needsUpdate = true;
      start();
    };

    const frameView = () => {
      const s = settingsRef.current;
      const aspect = view.frameWidth / view.height;
      let viewHeight = layout.height / clamp(s.size, 0.15, 0.9);
      const minimumWidth = layout.width / 0.72;
      if (viewHeight * aspect < minimumWidth) viewHeight = minimumWidth / aspect;
      const viewWidth = viewHeight * aspect;
      camera.aspect = aspect;
      camera.position.set(0, 0, viewHeight / 2 / Math.tan((FOV * Math.PI) / 360));
      camera.lookAt(0, 0, 0);
      // Preserve the left column's framing while rendering beyond its right edge.
      camera.setViewOffset(view.frameWidth, view.height, 0, 0, view.width, view.height);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      foilUniforms.foilKey.value.set(-2.5, 4, 6).normalize().transformDirection(camera.matrixWorldInverse);
      foilUniforms.foilFill.value.set(3, -1, 4).normalize().transformDirection(camera.matrixWorldInverse);
      foilUniforms.foilTop.value.set(0.5, 4.5, 8).normalize().transformDirection(camera.matrixWorldInverse);
      const anchorX = ((ANCHORS[s.anchor] ?? 0.5) - 0.5) * viewWidth;
      const anchorY = viewHeight / 2 + 0.2;
      const cardTop = viewHeight / 2 - viewHeight * mix(0.12, 0.42, clamp(s.strapLength, 0, 1));
      const hangTop = cardTop + (layout.hangY - layout.height / 2);
      sim.anchor.set(anchorX, anchorY, 0);
      configureSimulation(sim, layout, anchorY - hangTop);
      if (s.secondCard) sim.body.hang.set(CARD_POSES[0].ringX, layout.hangY, 0);
      sim.nodes[0].copy(sim.anchor);
      sim.previous[0].copy(sim.anchor);
    };

    const apply = () => {
      const s = settingsRef.current;
      const layoutKey = `${s.orientation}|${s.cornerRadius}|${s.secondCard}`;
      if (layoutKey !== applied.layoutKey) {
        layout = cardLayout(s.orientation, s.cornerRadius);
        const geometry = buildCardGeometry(layout);
        bodyMesh.geometry.dispose();
        frontMesh.geometry.dispose();
        backMesh.geometry.dispose();
        bodyMesh.geometry = geometry.body;
        frontMesh.geometry = geometry.face;
        backMesh.geometry = geometry.face.clone();
        secondBodyMesh.geometry.dispose();
        secondFrontMesh.geometry.dispose();
        secondBackMesh.geometry.dispose();
        const companionGeometry = buildCardGeometry(layout);
        secondBodyMesh.geometry = companionGeometry.body;
        secondFrontMesh.geometry = companionGeometry.face;
        secondBackMesh.geometry = companionGeometry.face.clone();
        frontMesh.position.z = THICKNESS / 2 + BEVEL + 0.0006;
        backMesh.rotation.y = Math.PI;
        backMesh.position.z = -(THICKNESS / 2 + BEVEL + 0.0006);
        secondFrontMesh.position.z = frontMesh.position.z;
        secondBackMesh.position.z = backMesh.position.z;
        secondBackMesh.rotation.y = Math.PI;
        ring.position.set(0, layout.ringY, 0);
        ring.position.x = s.secondCard ? CARD_POSES[0].ringX : 0;
        // Rings hang straight up from the centered slot to their end of the clip;
        // the clip itself carries the depth offset between the two cards.
        const ringDepth = 0;
        ring.position.z = -ringDepth;
        ring.rotation.x = -Math.atan2(ringDepth, RING_RADIUS);
        ring.scale.y = Math.hypot(RING_RADIUS, ringDepth) / RING_RADIUS;
        secondRing.position.set(CARD_POSES[1].ringX, layout.ringY, ringDepth);
        secondRing.rotation.x = -ring.rotation.x;
        secondRing.scale.y = ring.scale.y;
        secondGroup.visible = s.secondCard;
        applied.framingKey = '';
      }
      const framingKey = `${layoutKey}|${s.size}|${s.anchor}|${s.strapLength}|${view.width}|${view.height}|${view.frameWidth}`;
      if (framingKey !== applied.framingKey) {
        frameView();
        if (!placed) {
          placeCards(s.intro && !reducedMotion);
          placed = true;
        } else if (layoutKey !== applied.layoutKey) {
          placeCards(false);
        }
      }

      const imageKey = `${s.frontImage}|${s.backImage}|${s.secondFrontImage}|${s.secondBackImage}|${s.strapImage}`;
      if (imageKey !== applied.imageKey) {
        const token = ++imageToken;
        const sources = { front: s.frontImage, back: s.backImage, secondFront: s.secondFrontImage, secondBack: s.secondBackImage };
        const small = s.placeholders || {};
        revealTimers.forEach(timer => clearTimeout(timer));
        revealTimers.clear();
        for (const key of Object.keys(sources)) {
          images[key] = null;
          tiny[key] = null;
          reveal[key] = 0;
        }
        // Tiny placeholders first so the cards never sit empty on slow connections.
        Promise.all(Object.keys(sources).map(key => loadImage(imageCache, small[key]).then(image => [key, image])))
          .then(entries => {
            if (!alive || token !== imageToken) return;
            for (const [key, image] of entries) if (!images[key]) tiny[key] = image;
            paintFaces();
          });
        // Then each full image independently, revealed as soon as it arrives.
        for (const [key, url] of Object.entries(sources)) {
          loadImage(imageCache, url).then(image => {
            if (!alive || token !== imageToken || !image) return;
            images[key] = image;
            revealImage(key);
          });
        }
        loadImage(imageCache, s.strapImage).then(strap => {
          if (!alive || token !== imageToken) return;
          images.strap = strap;
          repaintStrap();
        });
      }
      const faceKey = `${layoutKey}|${s.cardColor}|${s.cardGradientEnd}|${s.secondCardColor}|${s.imageFit}`;
      if (faceKey !== applied.faceKey) paintFaces();
      if (s.strapColor !== applied.strapColor) repaintStrap();

      const finish = FINISHES[s.finish] || FINISHES.glossy;
      const card = parseColor(s.cardColor, [1, 1, 1]);
      faceMaterials.forEach(material => {
        material.roughness = finish.roughness;
        material.metalness = finish.metalness;
        material.clearcoat = finish.clearcoat;
        material.clearcoatRoughness = finish.clearcoatRoughness;
        material.anisotropy = finish.anisotropy;
        material.specularIntensity = finish.specular ?? 1;
      });
      foilUniforms.foilStrength.value = finish.foil;
      foilUniforms.foilAspect.value = layout.height / layout.width;
      edgeMaterial.color.setRGB(card[0] * 0.92, card[1] * 0.92, card[2] * 0.92, THREE.SRGBColorSpace);
      const secondCard = s.secondCardColor ? parseColor(s.secondCardColor, card) : card;
      secondEdgeMaterial.color.setRGB(secondCard[0] * 0.92, secondCard[1] * 0.92, secondCard[2] * 0.92, THREE.SRGBColorSpace);
      // Matte cards get matte edges; coated finishes keep a polished edge.
      const coated = finish.clearcoat > 0;
      [edgeMaterial, secondEdgeMaterial].forEach(material => {
        material.roughness = coated ? Math.min(finish.roughness, 0.35) : finish.roughness;
        material.metalness = finish.metalness;
        material.clearcoat = coated ? 1 : 0;
        material.clearcoatRoughness = 0.08;
        material.specularIntensity = finish.specular ?? 1;
      });
      const metalLook = METALS[s.metal] || METALS.silver;
      metalMaterial.color.set(metalLook.color);
      metalMaterial.roughness = metalLook.roughness;
      strapScale = STRAP_WIDTH * clamp(s.strapWidth, 0.4, 2);
      if (strapScale !== applied.strapScale) {
        clampMesh.geometry.dispose();
        clampMesh.geometry = buildClampGeometry(strapScale);
      }
      canvas.style.touchAction = s.interactive ? 'pan-y' : 'auto';

      applied = { layoutKey, framingKey, imageKey, faceKey, strapColor: s.strapColor, strapScale };
      start();
    };

    const points = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
    const sides = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
    const bends = BAND_BEND.map(angle => [Math.cos(angle), Math.sin(angle)]);
    const work = {
      tangent: new THREE.Vector3(),
      toCamera: new THREE.Vector3(),
      basis: new THREE.Matrix4(),
      up: new THREE.Vector3(),
      across: new THREE.Vector3(),
      facing: new THREE.Vector3(),
      end: new THREE.Vector3()
    };

    const updateBand = () => {
      const hang = sim.nodes[JOINTS];
      const reach = EYELET_RADIUS + CLAMP_BODY + 0.05;
      let guide = JOINTS - 1;
      while (guide > 0 && sim.nodes[guide].distanceTo(hang) < reach * 1.1) guide--;
      const axis = work.up.subVectors(sim.nodes[guide], hang);
      if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0).applyQuaternion(sim.body.quaternion);
      axis.normalize();
      mouth.copy(hang).addScaledVector(axis, reach);
      tuck.copy(hang).addScaledVector(axis, EYELET_RADIUS + CLAMP_BODY * 0.35);
      controls.length = 0;
      for (let i = 0; i <= guide; i++) controls.push(sim.nodes[i]);
      controls.push(mouth, tuck);
      curve.updateArcLengths();
      for (let i = 0; i < SAMPLES; i++) curve.getPointAt(i / (SAMPLES - 1), points[i]);
      const length = curve.getLength();
      const held = 1 - mouth.distanceTo(tuck) / Math.max(length, 0.001);
      const position = bandGeometry.getAttribute('position');
      const normal = bandGeometry.getAttribute('normal');
      const uv = bandGeometry.getAttribute('uv');
      const columns = BAND_COLUMNS.length;
      const restLength = sim.rest * JOINTS;
      const repeats = restLength / (strapScale * tileRatio);
      const width = strapScale / Math.pow(Math.max(1, length / Math.max(restLength, 0.001)), 0.35);
      const { tangent, toCamera, across, facing } = work;
      for (let i = 0; i < SAMPLES; i++) {
        tangent.subVectors(points[Math.min(SAMPLES - 1, i + 1)], points[Math.max(0, i - 1)]);
        if (tangent.lengthSq() < 1e-12) tangent.set(0, -1, 0);
        tangent.normalize();
        toCamera.subVectors(camera.position, points[i]).normalize();
        const side = sides[i].crossVectors(toCamera, tangent);
        if (side.lengthSq() < 1e-10) side.copy(i > 0 ? sides[i - 1] : scratch.a.set(1, 0, 0));
        side.normalize();
        if (i > 0 && side.dot(sides[i - 1]) < 0) side.negate();
        const angle = -sim.twist * Math.pow(Math.min(1, i / (SAMPLES - 1) / held), 1.3);
        facing.crossVectors(tangent, side);
        across.copy(side).multiplyScalar(Math.cos(angle)).addScaledVector(facing, Math.sin(angle));
        facing.crossVectors(tangent, across);
        const p = points[i];
        const v = (1 - i / (SAMPLES - 1)) * repeats;
        for (let c = 0; c < columns; c++) {
          const k = i * columns + c;
          const offset = (BAND_COLUMNS[c] - 0.5) * width;
          const [bendCos, bendSin] = bends[c];
          position.setXYZ(k, p.x + across.x * offset, p.y + across.y * offset, p.z + across.z * offset);
          normal.setXYZ(
            k,
            facing.x * bendCos + across.x * bendSin,
            facing.y * bendCos + across.y * bendSin,
            facing.z * bendCos + across.z * bendSin
          );
          uv.setXY(k, BAND_COLUMNS[c], v);
        }
      }
      work.end.copy(across);
      position.needsUpdate = true;
      normal.needsUpdate = true;
      uv.needsUpdate = true;

      if (secondGroup.visible) {
        // Line the clamp up with the clip bar that carries both rings.
        pinA.copy(sim.body.hang).applyQuaternion(sim.body.quaternion).add(sim.body.position);
        pinB.copy(companion.body.hang).applyQuaternion(companion.body.quaternion).add(companion.body.position);
        const span = pinA.distanceTo(pinB);
        clipBar.visible = span > 1e-4;
        if (clipBar.visible) {
          clipBar.position.addVectors(pinA, pinB).multiplyScalar(0.5);
          clipBar.scale.set(1, span + 0.05, 1);
          clipBar.quaternion.setFromUnitVectors(scratch.a.set(0, 1, 0), scratch.b.subVectors(pinA, pinB).normalize());
          work.end.subVectors(pinA, pinB);
        }
      } else {
        clipBar.visible = false;
      }
      across.copy(work.end).addScaledVector(axis, -work.end.dot(axis)).normalize();
      facing.crossVectors(across, axis).normalize();
      work.basis.makeBasis(across, axis, facing);
      clampGroup.quaternion.setFromRotationMatrix(work.basis);
      clampGroup.position.copy(hang);
    };

    const render = () => {
      cardGroup.position.copy(sim.body.position);
      cardGroup.quaternion.copy(sim.body.quaternion);
      secondGroup.position.copy(companion.body.position);
      secondGroup.quaternion.copy(companion.body.quaternion);
      updateBand();
      renderer.render(scene, camera);
    };

    const physics = () => {
      const s = settingsRef.current;
      const gravity = 40 * clamp(s.gravity, 0, 3);
      const weight = Math.max(gravity, 20);
      const springy = clamp(s.elasticity, 0, 1);
      const settle = clamp(s.damping, 0, 1);
      return {
        gravity,
        hold: weight * mix(2.2, 5.5, springy),
        stiffness: weight * 10 * JOINTS,
        spring: weight * mix(0.1, 0.4, springy) * JOINTS,
        bandDamping: weight * mix(0.3, 0.08, springy) * JOINTS,
        linearDrag: 0.25 * Math.pow(16, settle),
        angularDrag: 0.5 * Math.pow(12, settle),
        air: 0.15,
        broadside: 0.5,
        spinAir: 0.03,
        nodeDrag: 2,
        nodeAir: 0.2,
        twist: 30,
        twistDamping: 3,
        grip: 40,
        gripDamping: 6,
        breeze: reducedMotion ? 0 : clamp(s.breeze, 0, 1)
      };
    };

    const tick = now => {
      raf = 0;
      if (!alive) return;
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
      last = now;
      time += dt;
      const current = physics();
      stepSimulation(sim, dt, current, time, settingsRef.current.secondCard ? companion : null);
      const body = sim.body;
      if (![body, companion.body].every(b => Number.isFinite(b.position.x + b.position.y + b.position.z + b.quaternion.w))) {
        sim.grab = null;
        companion.grab = null;
        activeSim = null;
        placeCards(false);
      }
      render();
      const resting = sim.calm > 1.2 && !sim.grab && (!settingsRef.current.secondCard || (companion.calm > 1.2 && !companion.grab)) && current.breeze === 0;
      if (visible && !resting) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      sim.calm = 0;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const toPointer = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
    };

    const pickCard = () => {
      cardGroup.updateMatrixWorld();
      secondGroup.updateMatrixWorld();
      const meshes = [bodyMesh, frontMesh, backMesh];
      if (settingsRef.current.secondCard) meshes.push(secondBodyMesh, secondFrontMesh, secondBackMesh);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      return hit ? { ...hit, simulation: hit.object.parent === secondGroup ? companion : sim } : null;
    };

    const setCursor = value => {
      if (canvas.style.cursor !== value) canvas.style.cursor = value;
    };

    const flip = (point, selected) => {
      const body = selected.body;
      const up = scratch.a.set(0, 1, 0).applyQuaternion(body.quaternion);
      let direction = selected.turn > 0 ? -1 : 1;
      if (selected.turn === 0) {
        const away = scratch.c.subVectors(point, camera.position).normalize();
        direction = scratch.b.subVectors(point, body.position).cross(away).dot(up) < 0 ? -1 : 1;
      }
      const targetTurn = selected.turn === 0 ? Math.PI * direction : 0;
      const cards = settingsRef.current.secondCard ? [sim, companion] : [selected];
      for (const card of cards) {
        card.turn = targetTurn;
        const cardUp = scratch.a.set(0, 1, 0).applyQuaternion(card.body.quaternion);
        card.body.angular.addScaledVector(cardUp, FLIP_SPIN * direction);
      }
    };

    const onPointerDown = event => {
      if (!settingsRef.current.interactive || event.button > 0 || activeSim) return;
      toPointer(event);
      const hit = pickCard();
      if (!hit) return;
      activeSim = hit.simulation;
      activeSim.grab = {
        local: hit.point.clone().sub(activeSim.body.position).applyQuaternion(activeSim.body.quaternion.clone().invert()),
        rotation: activeSim.body.quaternion.clone(),
        reach: hit.distance,
        from: hit.point.clone(),
        target: hit.point.clone()
      };
      press = { x: event.clientX, y: event.clientY, time: performance.now(), point: hit.point.clone() };
      canvas.setPointerCapture?.(event.pointerId);
      setCursor('grabbing');
      event.preventDefault();
      start();
    };

    const onPointerMove = event => {
      if (!settingsRef.current.interactive) return;
      toPointer(event);
      if (activeSim?.grab) {
        if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6) press = null;
        raycaster.ray.at(activeSim.grab.reach, activeSim.grab.target);
        start();
        return;
      }
      if (event.pointerType === 'touch') return;
      hovering = !!pickCard();
      setCursor(hovering ? 'grab' : '');
    };

    const onPointerUp = event => {
      if (!activeSim?.grab) return;
      const action = event.type !== 'pointerup' ? null : !press ? 'drag' : performance.now() - press.time < 450 ? 'flip' : null;
      const interaction = action && {
        action,
        badge_id: activeSim === companion ? 2 : 1,
        badge_count: action === 'flip' && settingsRef.current.secondCard ? 2 : 1,
        input_type: event.pointerType || 'mouse'
      };
      activeSim.grab = null;
      if (action === 'flip') flip(press.point, activeSim);
      activeSim = null;
      press = null;
      canvas.releasePointerCapture?.(event.pointerId);
      setCursor(hovering && event.pointerType !== 'touch' ? 'grab' : '');
      start();
      if (interaction) settingsRef.current.onInteraction?.(interaction);
    };

    const onTouchStart = event => {
      if (!settingsRef.current.interactive || event.touches.length !== 1) return;
      toPointer(event.touches[0]);
      if (pickCard()) event.preventDefault();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('lostpointercapture', onPointerUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });

    const resize = () => {
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      const frameRatio = parseFloat(getComputedStyle(container).getPropertyValue('--lanyard-frame-ratio')) || 1;
      view.frameWidth = view.width * clamp(frameRatio, 0.1, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(view.width, view.height, false);
      apply();
      render();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersectionObserver.observe(container);
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    applyRef.current = apply;
    resize();

    return () => {
      alive = false;
      revealTimers.forEach(timer => clearTimeout(timer));
      cancelAnimationFrame(raf);
      applyRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('lostpointercapture', onPointerUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      [bodyMesh, frontMesh, backMesh, secondBodyMesh, secondFrontMesh, secondBackMesh, ring, clampMesh, eyelet, clipBar, band].forEach(mesh => mesh.geometry?.dispose());
      [...faceMaterials, edgeMaterial, secondEdgeMaterial, metalMaterial, bandMaterial].forEach(material => material.dispose());
      [frontTexture, backTexture, secondFrontTexture, secondBackTexture, strapTexture, grain, weave].forEach(texture => texture.dispose());
      environment.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`lanyard ${className}`.trim()} style={style} />;
};

export default Lanyard;
