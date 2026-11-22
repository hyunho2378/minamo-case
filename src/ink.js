/* 墨流し 연출용 캔버스 엔진.
   수면 위 먹이 떨어져 퍼지고(Drop), 휘저으면 물결을 타고 흐르고(Flow), 두 무늬가 섞이는(Blend) 동작을
   입자와 흐름장으로 옮겼다. 표지는 같은 엔진의 trail 모드다. */

const LIME = [107, 255, 113];
const WHITE = [176, 182, 176];

function field(x, y, t) {
  // 값싼 소용돌이 흐름장. 수면 위 물결처럼 천천히 바뀐다.
  const s = 0.0042;
  const a = Math.sin(x * s + t * 0.21) + Math.cos(y * s * 1.3 - t * 0.17);
  const b = Math.cos(x * s * 1.1 - t * 0.19) + Math.sin(y * s - t * 0.23);
  return [b * 0.6, -a * 0.6];
}

export function createInk(canvas, opts = {}) {
  const mode = opts.mode || 'trail';
  const fade = opts.fade ?? 0.016;
  const maxParticles = opts.maxParticles ?? 1400;
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, dpr = 1;
  let parts = [];
  let rings = [];
  let raf = 0;
  let t = 0;
  let pointer = { x: 0, y: 0, px: 0, py: 0, down: false, active: false };
  let drew = false;
  let idleSeed = 0;
  // 손을 대지 않으면 보이지 않는 펜이 대신 그린다(자동 시연).
  const autoplay = opts.autoplay !== false && mode !== 'trail';
  let lastUser = -1e9;
  let autoT = Math.random() * 100;
  let autoOn = false;
  let autoPt = { x: 0, y: 0 };
  let visible = true;
  let nextDrop = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(x, y, vx, vy, color, count, spread, life) {
    for (let i = 0; i < count; i++) {
      if (parts.length > maxParticles) parts.shift();
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * spread;
      parts.push({
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r,
        px: x + Math.cos(a) * r,
        py: y + Math.sin(a) * r,
        vx: vx * (0.4 + Math.random() * 0.8) + Math.cos(a) * 0.5,
        vy: vy * (0.4 + Math.random() * 0.8) + Math.sin(a) * 0.5,
        life: life * (0.6 + Math.random() * 0.7),
        age: 0,
        wd: 0.4 + Math.random() * 1.1,
        c: color,
      });
    }
  }

  function dropAt(x, y, auto) {
    if (!auto) drew = true;
    rings.push({ x, y, r: 2, life: 1 });
    spawn(x, y, 0, 0, LIME, 90, 6, 150);
  }

  function seedPattern() {
    // Flow와 Blend 칸은 처음부터 수면에 무늬가 깔려 있어야 끌었을 때 변화를 본다.
    parts = [];
    if (mode === 'flow') {
      for (let i = 0; i < 9; i++) {
        const y = (h / 10) * (i + 1);
        for (let j = 0; j < 70; j++) {
          const x = (w / 70) * j;
          parts.push({ x, y, px: x, py: y, vx: 0, vy: 0, life: 1e9, age: 0, wd: 1.1, c: i % 2 ? LIME : WHITE });
        }
      }
    } else if (mode === 'blend') {
      for (let k = 0; k < 2; k++) {
        const cx = w * (k ? 0.68 : 0.32);
        const cy = h * 0.5;
        for (let i = 0; i < 420; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * Math.min(w, h) * 0.22;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          parts.push({ x, y, px: x, py: y, vx: 0, vy: 0, life: 1e9, age: 0, wd: 1.2, c: k ? LIME : WHITE });
        }
      }
    }
  }

  function step() {
    t += 0.016;
    if (!visible) { raf = requestAnimationFrame(step); return; }

    // 자동 시연: 마지막 조작에서 2.4초가 지나면 가상 펜이 수면을 휘젓는다.
    autoOn = autoplay && !reduce && performance.now() - lastUser > 2400;
    if (autoOn) {
      autoT += 0.016;
      if (mode === 'drop') {
        if (autoT > nextDrop) {
          nextDrop = autoT + 1.1 + Math.random() * 0.9;
          dropAt(w * (0.26 + Math.random() * 0.48), h * (0.24 + Math.random() * 0.44), true);
        }
        pointer.active = false;
      } else {
        const a = autoT * 0.3;
        const nx = w * (0.5 + 0.3 * Math.sin(a) + 0.1 * Math.sin(a * 2.3));
        const ny = h * (0.46 + 0.26 * Math.cos(a * 1.4) + 0.07 * Math.sin(a * 3.1));
        pointer.px = pointer.x; pointer.py = pointer.y;
        pointer.x = nx; pointer.y = ny;
        pointer.down = true; pointer.active = true;
        autoPt = { x: nx, y: ny };
      }
    }

    // 그린 선이 수면에 번지듯 천천히 사라진다.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${fade})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    const stir = pointer.active && (pointer.down || mode === 'trail' || opts.hover);
    const dx = pointer.x - pointer.px;
    const dy = pointer.y - pointer.py;

    if (stir) {
      if (mode === 'trail') {
        const sp = Math.hypot(dx, dy);
        if (sp > 0.6) {
          spawn(pointer.x, pointer.y, dx * 0.16, dy * 0.16, LIME, 1 + Math.round(Math.min(sp, 40) / 16), 3, 190);
          drew = true;
        }
      } else if (mode === 'drop') {
        // Drop은 누를 때만 원이 떨어진다.
      }
    }
    if (!autoOn || mode === 'drop') { pointer.px = pointer.x; pointer.py = pointer.y; }

    // 물결 원
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.r += 1.9 + r.r * 0.016;
      r.life -= 0.0075;
      if (r.life <= 0 || r.r > Math.max(w, h)) { rings.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${LIME[0]},${LIME[1]},${LIME[2]},${0.5 * r.life})`;
      ctx.lineWidth = 1 + 2.2 * r.life;
      ctx.stroke();
      if (r.r > 18) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 0.62, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.17 * r.life})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 입자
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.age++;
      if (p.age > p.life) { parts.splice(i, 1); continue; }
      // 깔린 무늬는 손을 대기 전까지 거의 가만히 있어야 한다. 흐름장은 아주 약하게만 건다.
      const fk = p.life > 1e8 ? 0.012 : 0.085;
      const [fx, fy] = field(p.x, p.y, t);
      p.vx += fx * fk;
      p.vy += fy * fk;

      if (stir && mode !== 'trail') {
        const ddx = p.x - pointer.x;
        const ddy = p.y - pointer.y;
        const d2 = ddx * ddx + ddy * ddy;
        const R = mode === 'blend' ? 150 : 120;
        if (d2 < R * R) {
          const f = (1 - Math.sqrt(d2) / R) * (autoOn ? 0.55 : 1);
          p.vx += dx * 0.055 * f;
          p.vy += dy * 0.055 * f;
          // 휘젓는 손 둘레로 도는 성분
          p.vx += -ddy * 0.004 * f;
          p.vy += ddx * 0.004 * f;
          if (!autoOn) drew = true;
        }
      }

      const damp = p.life > 1e8 ? 0.925 : 0.955;
      p.vx *= damp;
      p.vy *= damp;
      p.x += p.vx;
      p.y += p.vy;

      if (p.life > 1e8) {
        // 깔린 무늬는 칸 벽에서 튕겨 돌아온다. 튕긴 프레임은 선을 긋지 않아야 벽에 줄이 쌓이지 않는다.
        let hit = false;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * 0.4; hit = true; }
        if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx) * 0.4; hit = true; }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * 0.4; hit = true; }
        if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy) * 0.4; hit = true; }
        if (hit) { p.px = p.x; p.py = p.y; continue; }
      }

      const k = p.life > 1e8 ? 1 : 1 - p.age / p.life;
      const sp = Math.hypot(p.x - p.px, p.y - p.py);
      // 너무 짧으면 점만 찍히고, 너무 길면 화면을 가로지르는 줄이 생겨서 둘 다 거른다.
      if (sp < 0.2 || sp > 18) { p.px = p.x; p.py = p.y; continue; }
      const al = Math.max(0, k) * (p.c === WHITE ? 0.16 : 0.56) * Math.min(1, 0.3 + sp / 3);
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${al})`;
      ctx.lineWidth = p.wd * (0.6 + k);
      ctx.lineCap = 'round';
      ctx.stroke();
      p.px = p.x;
      p.py = p.y;
    }

    // 손을 대지 않아도 표지에는 먹이 조금씩 흐른다.
    if (mode === 'trail' && !reduce) {
      idleSeed += 0.006;
      if (parts.length < 55) {
        const x = w * (0.5 + 0.42 * Math.sin(idleSeed * 1.7));
        const y = h * (0.42 + 0.3 * Math.cos(idleSeed * 1.1));
        spawn(x, y, Math.cos(idleSeed * 2.3) * 1.1, Math.sin(idleSeed * 1.9) * 1.1, LIME, 1, 2, 210);
      }
    }

    if (autoOn && mode !== 'drop') {
      ctx.beginPath();
      ctx.arc(autoPt.x, autoPt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(107,255,113,0.9)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(autoPt.x, autoPt.y, 13, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(step);
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function onDown(e) {
    lastUser = performance.now();
    const p = pos(e);
    pointer.x = p.x; pointer.y = p.y; pointer.px = p.x; pointer.py = p.y;
    pointer.down = true; pointer.active = true;
    if (mode === 'drop') dropAt(p.x, p.y);
    if (canvas.setPointerCapture && e.pointerId != null) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }
  function onMove(e) {
    lastUser = performance.now();
    const p = pos(e);
    pointer.x = p.x; pointer.y = p.y; pointer.active = true;
    if (mode === 'drop' && pointer.down) dropAt(p.x, p.y);
  }
  function onUp() { pointer.down = false; lastUser = performance.now(); }
  function onLeave() { pointer.active = false; pointer.down = false; }

  const ro = new ResizeObserver(() => {
    const before = w;
    resize();
    if (mode !== 'trail' && Math.abs(before - w) > 2) seedPattern();
  });

  const io = new IntersectionObserver((es) => { es.forEach((e) => { visible = e.isIntersecting; }); }, { threshold: 0.05 });

  resize();
  if (mode !== 'trail') seedPattern();
  ro.observe(canvas);
  io.observe(canvas);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  raf = requestAnimationFrame(step);

  return {
    hasDrawn: () => drew,
    seedDemo() {
      if (mode === 'drop') { dropAt(w * 0.5, h * 0.45); }
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
    },
  };
}
