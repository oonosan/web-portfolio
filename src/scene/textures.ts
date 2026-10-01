import * as THREE from 'three';

// Everything in the room is painted at runtime on canvases: no image assets to download.

type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const cache = new Map<string, THREE.CanvasTexture>();

export function canvasTexture(key: string, w: number, h: number, paint: Paint) {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  paint(canvas.getContext('2d')!, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/** Deterministic pseudo-random so the room looks the same on every visit. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function blob(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rand: () => number) {
  ctx.beginPath();
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.7 + rand() * 0.5);
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr * 0.8;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.quadraticCurveTo(x + Math.cos(a - 0.3) * rr * 1.1, y + Math.sin(a - 0.3) * rr, px, py);
  }
  ctx.fill();
}

export const woodFloorTexture = () =>
  canvasTexture('floor', 1024, 1024, (ctx, w, h) => {
    const rand = rng(7);
    const rows = 10;
    const rowH = h / rows;
    const tones = ['#f2c9a6', '#efc19c', '#f5d0b0', '#ecbc96', '#f3cdab'];
    for (let r = 0; r < rows; r++) {
      let x = -rand() * 300;
      while (x < w) {
        const len = 260 + rand() * 260;
        ctx.fillStyle = tones[Math.floor(rand() * tones.length)];
        ctx.fillRect(x, r * rowH, len, rowH);
        // grain
        ctx.strokeStyle = 'rgba(170,110,80,0.12)';
        ctx.lineWidth = 2;
        for (let g = 0; g < 5; g++) {
          const gy = r * rowH + 8 + rand() * (rowH - 16);
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(x + len * 0.3, gy + 4, x + len * 0.6, gy - 4, x + len, gy + 2);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(190,125,95,0.45)';
        ctx.fillRect(x + len - 3, r * rowH, 3, rowH);
        x += len;
      }
      ctx.fillStyle = 'rgba(190,125,95,0.4)';
      ctx.fillRect(0, r * rowH, w, 3);
    }
  });

export const rugTexture = () =>
  canvasTexture('rug', 512, 512, (ctx, w, h) => {
    const rings = ['#fff1f7', '#f7b8d2', '#fff1f7', '#bfe8d6', '#fff1f7', '#fbe7a6', '#fff1f7'];
    rings.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, (w / 2) * (1 - i / rings.length), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = 'rgba(170,120,150,0.15)';
    for (let r = 10; r < w / 2; r += 7) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

/** White base with orange and black patches. */
export const calicoTexture = () =>
  canvasTexture('calico', 512, 256, (ctx, w, h) => {
    const rand = rng(11);
    ctx.fillStyle = '#f6f1e9';
    ctx.fillRect(0, 0, w, h);
    const patches: [number, number, number, string][] = [
      [0.15, 0.3, 0.13, '#d9823b'],
      [0.42, 0.22, 0.11, '#2b2523'],
      [0.62, 0.35, 0.14, '#d9823b'],
      [0.85, 0.25, 0.1, '#2b2523'],
      [0.3, 0.45, 0.08, '#2b2523'],
      [0.75, 0.15, 0.08, '#d9823b'],
      [0.02, 0.2, 0.08, '#2b2523'],
      [0.96, 0.4, 0.08, '#d9823b'],
    ];
    for (const [x, y, r, c] of patches) {
      ctx.fillStyle = c;
      blob(ctx, x * w, y * h, r * w, rand);
    }
  });

/** Classic brown mackerel tabby stripes. */
export const tabbyTexture = () =>
  canvasTexture('tabby', 512, 256, (ctx, w, h) => {
    const rand = rng(23);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#8a6a4a');
    g.addColorStop(0.55, '#a8865f');
    g.addColorStop(1, '#d9c4a3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#3e2c1e';
    ctx.lineCap = 'round';
    for (let x = 0; x < w; x += 26) {
      ctx.lineWidth = 7 + rand() * 5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 10, h * 0.2, x - 10, h * 0.4, x + 6, h * (0.5 + rand() * 0.12));
      ctx.stroke();
    }
  });

export const globeTexture = () =>
  canvasTexture('globe', 512, 256, (ctx, w, h) => {
    const rand = rng(5);
    ctx.fillStyle = '#a9d6ef';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#bfe8c0';
    const land: [number, number, number][] = [
      [0.18, 0.32, 0.09],
      [0.24, 0.62, 0.07],
      [0.5, 0.3, 0.08],
      [0.52, 0.6, 0.08],
      [0.7, 0.3, 0.12],
      [0.83, 0.68, 0.06],
    ];
    for (const [x, y, r] of land) {
      for (let i = 0; i < 4; i++)
        blob(
          ctx,
          (x + (rand() - 0.5) * 0.05) * w,
          (y + (rand() - 0.5) * 0.08) * h,
          r * w * 0.7,
          rand,
        );
    }
    ctx.fillStyle = '#f4f1ea';
    ctx.fillRect(0, 0, w, h * 0.06);
    ctx.fillRect(0, h * 0.94, w, h * 0.06);
  });

export const skyTexture = () =>
  canvasTexture('sky', 256, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#9fc9e6');
    g.addColorStop(0.7, '#dcecf2');
    g.addColorStop(1, '#fbe3ee');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const rand = rng(3);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 4; i++) {
      const x = rand() * w;
      const y = 60 + rand() * h * 0.4;
      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        ctx.ellipse(x + j * 16 - 32, y + Math.sin(j) * 6, 22, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // distant hills and trees
    ctx.fillStyle = '#b6dfb4';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 8)
      ctx.lineTo(x, h * 0.82 - Math.sin(x / 40) * 18 - Math.sin(x / 13) * 5);
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.fillStyle = '#9fd1a3';
    for (let x = 10; x < w; x += 38) {
      ctx.beginPath();
      ctx.arc(x, h * 0.86, 18 + rand() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
) => {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lh;
    } else line = test;
  }
  ctx.fillText(line, x, y);
};

export const stickyNoteTexture = (text: string, color: string) =>
  canvasTexture(`note-${text}`, 256, 256, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, h - 18, w, 18);
    ctx.fillStyle = '#4a3860';
    ctx.font = '700 30px "Nunito", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    wrapText(ctx, text, 22, 34, w - 44, 36);
  });

/** Three small "posters" for the impact frames. */
export const frameArtTexture = (index: number, label: string) =>
  canvasTexture(`frame-${index}`, 256, 320, (ctx, w, h) => {
    const bgs = ['#fbd9e9', '#d9f0e4', '#fdf0c4'];
    ctx.fillStyle = bgs[index % bgs.length];
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h * 0.4);
    if (index === 0) {
      // lightbulb: an idea taking shape
      ctx.fillStyle = '#f9c96b';
      ctx.beginPath();
      ctx.arc(0, -10, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b8a7cf';
      ctx.fillRect(-22, 40, 44, 26);
    } else if (index === 1) {
      // flow: discovery -> demo
      ctx.fillStyle = '#7cc0a0';
      ctx.strokeStyle = '#7cc0a0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-70, 40);
      ctx.bezierCurveTo(-30, -60, 30, 60, 70, -40);
      ctx.stroke();
      for (const [x, y] of [
        [-70, 40],
        [0, 0],
        [70, -40],
      ]) {
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // bars going up: leadership visibility
      ctx.fillStyle = '#ec74aa';
      [30, 55, 80, 110].forEach((bh, i) => ctx.fillRect(-72 + i * 38, 60 - bh, 26, bh));
    }
    ctx.restore();
    ctx.fillStyle = '#4a3860';
    ctx.font = '500 16px "Fredoka", system-ui, sans-serif';
    ctx.fillText(`0${index + 1}`, 22, h - 64);
    ctx.font = '600 22px "Fredoka", system-ui, sans-serif';
    ctx.fillText(label, 22, h - 34);
  });

export const bookSpineTexture = (title: string, color: string) =>
  canvasTexture(`book-${title}`, 64, 256, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillRect(0, 20, w, 4);
    ctx.fillRect(0, h - 24, w, 4);
    ctx.save();
    ctx.translate(w / 2 + 8, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(74,56,96,0.85)';
    ctx.font = '700 22px "Nunito", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 0, 0);
    ctx.restore();
  });
