import React, {
  createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { createInk } from './ink.js';

export const LangCtx = createContext('ko');
export const useBi = () => useContext(LangCtx) === 'bi';

/* 한국어 줄과 일본어 줄. 한일판에서만 일본어가 붙는다. */
export function Ja({ children, big }) {
  if (!useBi()) return null;
  return <span className={big ? 'ja ja-big' : 'ja'} lang="ja">{children}</span>;
}

/* 화면에 들어오면 올라오며 나타난다. 원본 NICE홀딩스의 WOW fadeInUp(1s, 40px 안팎)을 옮겼다. */
export function Rise({ children, delay = 0, className = '', as: As = 'div', style, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className={`rise ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}s`, ...style }} {...rest}>
      {children}
    </As>
  );
}

export function Fig({ src, alt, ratio = 'ratio-wide', full = false, caption, position, className = '' }) {
  return (
    <figure className={className}>
      <div className={`fig ${ratio} ${full ? 'fig-full' : ''}`}>
        <img src={src} alt={alt} loading="lazy" style={position ? { objectPosition: position } : undefined} />
      </div>
      {caption ? <figcaption className="figcap">{caption}</figcaption> : null}
    </figure>
  );
}

/* 표지. 사진 위에서 마우스나 손가락을 따라 연두 먹이 흘러 번진다. */
export function CoverInk({ children }) {
  const ref = useRef(null);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    const ink = createInk(ref.current, { mode: 'trail', fade: 0.02, hover: true, maxParticles: 700 });
    const id = setInterval(() => { if (ink.hasDrawn()) { setTouched(true); clearInterval(id); } }, 400);
    return () => { clearInterval(id); ink.destroy(); };
  }, []);
  return (
    <>
      <canvas ref={ref} className="cover-canvas" aria-hidden="true" />
      {children}
      <p className="cover-hint" style={{ opacity: touched ? 0 : 1 }}>{useBi()
        ? '화면을 따라 손을 움직이면 먹이 번집니다   画面をなぞると墨が広がります'
        : '화면을 따라 손을 움직이면 먹이 번집니다'}</p>
    </>
  );
}

/* AS-IS와 TO-BE를 가운데 손잡이로 끌어 비교한다. */
export function Compare({ before, after, beforeTag, afterTag, note }) {
  const box = useRef(null);
  const [p, setP] = useState(0.42);
  const [moved, setMoved] = useState(false);
  const drag = useRef(false);

  useEffect(() => {
    const set = (e) => {
      const r = box.current.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      setMoved(true);
    };
    const down = (e) => { e.preventDefault(); drag.current = true; set(e); };
    const move = (e) => { if (drag.current) { set(e); e.preventDefault(); } };
    const up = () => { drag.current = false; };
    const el = box.current;
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div className="compare ratio-wide" ref={box}>
      <img src={after} alt={afterTag} />
      <div className="compare-top" style={{ width: `${p * 100}%` }}>
        <img src={before} alt={beforeTag} style={{ width: box.current ? box.current.clientWidth : '100%', maxWidth: 'none' }} />
      </div>
      <span className="compare-tag l">{beforeTag}</span>
      <span className="compare-tag r">{afterTag}</span>
      <div className="compare-bar" style={{ left: `${p * 100}%` }}>
        <span className="compare-knob">끌기</span>
      </div>
      <span className="compare-note" style={{ opacity: moved ? 0 : 1 }}>{note}</span>
    </div>
  );
}

/* 디자인 키워드 세 칸. 방문자가 직접 찍고 흘리고 섞는다. */
export function KeywordCell({ mode, img, en, ko, ja, desc, descJa, action }) {
  const ref = useRef(null);
  const [used, setUsed] = useState(false);
  const bi = useBi();
  useEffect(() => {
    const ink = createInk(ref.current, {
      mode,
      fade: mode === 'drop' ? 0.014 : 0.03,
      maxParticles: mode === 'trail' ? 1400 : 2600,
    });
    const id = setInterval(() => { if (ink.hasDrawn()) { setUsed(true); clearInterval(id); } }, 400);
    return () => { clearInterval(id); ink.destroy(); };
  }, [mode]);
  return (
    <div className="kw-cell">
      <img src={img} alt="" aria-hidden="true" />
      <canvas ref={ref} className="kw-canvas" />
      <div className="kw-text">
        <span className="kw-en">{en}</span>
        <p className="kw-ko">{ko}{bi ? <span className="ja" lang="ja">{ja}</span> : null}</p>
        <p className="kw-desc">{desc}{bi ? <span className="ja" lang="ja">{descJa}</span> : null}</p>
        <span className="kw-do" style={{ opacity: used ? 0 : 1 }}>{action}</span>
      </div>
    </div>
  );
}

/* 천천히 흐르는 사진 줄. 원본 NICE홀딩스의 Swiper(speed 10000, loop, autoplay)를 옮겼다. */
export function Marquee({ items }) {
  const track = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, raf = 0, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 50); last = now;
      x -= dt * 0.028;
      const half = track.current ? track.current.scrollWidth / 2 : 1;
      if (-x >= half) x += half;
      if (track.current) track.current.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track" ref={track}>
        {doubled.map((it, i) => (
          <div className="marquee-item" key={i}>
            <img src={it.src} alt={it.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* 밤 수면 사진 위에 스크롤을 따라 연두 선이 그려진다. */
const SCENE_PATH =
  'M40 560 C 200 470, 300 640, 470 560 S 700 420, 860 520 S 1060 660, 1230 540 S 1420 380, 1560 470 S 1760 620, 1880 520';
const SCENE_PATH2 =
  'M120 690 C 320 610, 430 760, 620 690 S 880 560, 1060 650 S 1300 780, 1500 680 S 1760 540, 1900 630';

export function SceneDraw({ src, alt, children }) {
  const box = useRef(null);
  const p1 = useRef(null);
  const p2 = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const paths = [p1.current, p2.current].filter(Boolean);
    const lens = paths.map((p) => p.getTotalLength());
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lens[i]}`;
      p.style.strokeDashoffset = reduce ? '0' : `${lens[i]}`;
    });
    if (reduce) return;

    let raf = 0;
    let t0 = performance.now();
    let on = false;
    const CYCLE = 9200; // 그리기 4.6초, 머무름 1.6초, 지우기 2.2초, 쉼 0.8초

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!on) { t0 = now; return; }
      const e = (now - t0) % CYCLE;
      let k;
      if (e < 4600) k = e / 4600;
      else if (e < 6200) k = 1;
      else if (e < 8400) k = 1 - (e - 6200) / 2200;
      else k = 0;
      const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      paths.forEach((p, i) => {
        const kk = Math.min(1, Math.max(0, (ease - i * 0.1) / 0.9));
        p.style.strokeDashoffset = `${lens[i] * (1 - kk)}`;
      });
      if (img.current) img.current.style.transform = `scale(${1.06 - 0.06 * ease})`;
    };

    const io = new IntersectionObserver((es) => { es.forEach((x) => { on = x.isIntersecting; }); }, { threshold: 0.2 });
    io.observe(box.current);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <div className="scene" ref={box}>
      <img src={src} alt={alt} ref={img} loading="lazy" />
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path ref={p1} d={SCENE_PATH} fill="none" stroke="#6BFF71" strokeWidth="5" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 12px rgba(107,255,113,0.85))' }} />
        <path ref={p2} d={SCENE_PATH2} fill="none" stroke="#6BFF71" strokeWidth="2.6" strokeLinecap="round" opacity="0.72"
          style={{ filter: 'drop-shadow(0 0 8px rgba(107,255,113,0.7))' }} />
      </svg>
      {children}
    </div>
  );
}

/* 휴대폰 관람 데모. 손을 대지 않아도 화면 세 장이 차례로 바뀌고, 화면 안이 천천히 올라간다. */
export function PhoneDemo({ shots, steps }) {
  const box = useRef(null);
  const [idx, setIdx] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let on = false;
    let timer = 0;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        on = e.isIntersecting;
        clearInterval(timer);
        if (on && !manual) timer = setInterval(() => setIdx((i) => (i + 1) % shots.length), 3600);
      });
    }, { threshold: 0.25 });
    io.observe(box.current);
    return () => { clearInterval(timer); io.disconnect(); };
  }, [shots.length, manual]);

  return (
    <div className="demo" ref={box}>
      <div className="demo-phone">
        {shots.map((s, i) => (
          <img key={s.src} src={s.src} alt={s.alt} loading="lazy"
            className={`demo-shot ${i === idx ? 'on' : ''}`} />
        ))}
        <span className="demo-dot" aria-hidden="true" />
      </div>
      <div className="demo-steps">
        {steps.map((st, i) => (
          <button key={st.n} className={`demo-step ${i === idx ? 'on' : ''}`}
            onClick={() => { setManual(true); setIdx(i); }}>
            <span className="demo-step-n">{st.n}</span>
            <span className="demo-step-t">{st.t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function useScrollFlag(threshold = 80) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return past;
}

export function useLightHeader(ids) {
  const [light, setLight] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = 56;
        let hit = false;
        ids.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.top <= y && r.bottom > y) hit = true;
        });
        setLight(hit);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [ids]);
  return light;
}

export function useMemoIds(list) { return useMemo(() => list, []); }
