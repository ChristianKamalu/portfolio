import { useEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';

/* ── Foilet: the listening radius, live. The puck sits in the middle, this
   phone wanders around it (or goes where you drag it), and the slider grows
   or shrinks the boundary — inside it the phone is blocked, outside it is
   not. Top-down and schematic on purpose: no toilet, no bed, no signal
   numbers, no part names. ── */
const RADIUS_MIN = 6;
const RADIUS_MAX = 10;
const RADIUS_STANDARD = 8;

/* The map's own space. */
const MAP_W = 360;
const MAP_H = 250;
const MAP_CX = 180;
const MAP_CY = 125;
/** Boundary radius per slider stop, in map units. */
const boundaryFor = (t: number) => 34 + (t - RADIUS_MIN) * 20;
const BOUNDARY_MAX = boundaryFor(RADIUS_MAX);
/** Where the phone starts — outside, so first paint reads as "not blocked". */
const PHONE_START = { x: 296, y: 72 };
/** How long a drag keeps the wander paused, ms. */
const DRAG_HOLD_MS = 4000;

/** A slow figure that crosses in and out of every boundary size. */
function wander(ms: number) {
  const t = ms / 1000;
  return {
    x: MAP_CX + 140 * Math.sin(0.34 * t),
    y: MAP_CY + 96 * Math.sin(0.47 * t + 1.1),
  };
}

export function RadiusDemo() {
  const [tolerance, setTolerance] = useState(RADIUS_STANDARD);
  const [phone, setPhone] = useState(PHONE_START);
  const [dragging, setDragging] = useState(false);
  const lastDrag = useRef(0);

  useEffect(() => {
    // The wander is decoration, so it respects the OS motion setting; the
    // drag still works without it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (now - lastDrag.current > DRAG_HOLD_MS) setPhone(wander(now - start));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const place = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * MAP_W;
    const y = ((e.clientY - rect.top) / rect.height) * MAP_H;
    lastDrag.current = performance.now();
    setPhone({ x: Math.max(8, Math.min(MAP_W - 8, x)), y: Math.max(8, Math.min(MAP_H - 8, y)) });
  };

  const boundary = boundaryFor(tolerance);
  const inside = Math.hypot(phone.x - MAP_CX, phone.y - MAP_CY) <= boundary;
  const ringStyle = { ['--ring' as string]: boundary / BOUNDARY_MAX };

  return (
    <div className="demo-box">
      <div className="demo-label radius-head">
        <span>Listening radius — this phone, live</span>
        <span className={`radius-state ${inside ? 'blocked' : ''}`}>
          <span className="radius-state-dot" />
          {inside ? 'Blocked' : 'Not blocked'}
        </span>
      </div>
      <div className="radius-demo">
        <svg
          className={`radius-map ${dragging ? 'dragging' : ''}`}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          role="img"
          aria-label="A map: the Foilet in the middle, this phone moving around it, and the listening radius as a circle. Drag to move the phone."
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); place(e); }}
          onPointerMove={(e) => { if (dragging) place(e); }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          {/* Range rings, for scale. */}
          {[46, 92, 138].map((r) => (
            <circle key={r} className="radius-range" cx={MAP_CX} cy={MAP_CY} r={r} />
          ))}
          {/* The boundary, drawn at its widest and scaled from the puck. */}
          <g className="radius-ring" style={ringStyle}>
            <circle className="radius-fill" cx={MAP_CX} cy={MAP_CY} r={BOUNDARY_MAX} />
            <circle className="radius-stroke" cx={MAP_CX} cy={MAP_CY} r={BOUNDARY_MAX} />
          </g>
          {/* The puck, from above: a disc with its cap seam. */}
          <g className="radius-puck">
            <circle cx={MAP_CX} cy={MAP_CY} r="17" className="radius-puck-body" />
            <circle cx={MAP_CX} cy={MAP_CY} r="11.5" className="radius-puck-cap" />
            <circle cx={MAP_CX} cy={MAP_CY} r="2.2" className="radius-puck-mark" />
          </g>
          {/* This phone. */}
          <g className={`radius-phone ${inside ? 'blocked' : ''}`} transform={`translate(${phone.x} ${phone.y})`}>
            <circle r="13" className="radius-phone-halo" />
            <rect x="-5" y="-8.5" width="10" height="17" rx="2.5" className="radius-phone-body" />
            <rect x="-3" y="-6" width="6" height="10" rx="1" className="radius-phone-screen" />
          </g>
        </svg>
        <div className="radius-slider">
          <input
            type="range"
            min={RADIUS_MIN}
            max={RADIUS_MAX}
            step={1}
            value={tolerance}
            aria-label="Listening radius"
            onChange={(e) => setTolerance(Number(e.target.value))}
          />
          <div className="radius-stops" aria-hidden="true">
            <span>Tighter</span>
            <span className={tolerance === RADIUS_STANDARD ? 'on' : ''}>Standard</span>
            <span>Wider</span>
          </div>
        </div>
        <p className="radius-note">
          The phone is you. Inside the boundary it&rsquo;s blocked; drag it, or widen the ring
          until the next room counts. Everyone who uses the device sets their own.
        </p>
      </div>
    </div>
  );
}

/* ── NourishAI: agent output flavor — cycling meal cards ── */
const MEALS: { icon: IconName; name: string; line: string; tag: string }[] = [
  { icon: 'poke', name: 'Salmon poke bowl', line: '620 kcal · 42g protein · ready in 15m', tag: 'planner pick' },
  { icon: 'wrap', name: 'Chipotle chicken wrap', line: '540 kcal · 38g protein · meal-prep friendly', tag: 'high protein' },
  { icon: 'ramen', name: 'Miso ramen, extra egg', line: '680 kcal · 31g protein · comfort tier: high', tag: 'from photo log' },
  { icon: 'salad', name: 'Harvest grain salad', line: '480 kcal · 22g protein · pantry match 92%', tag: 'budget aware' },
  { icon: 'taco', name: 'Baja fish tacos ×3', line: '590 kcal · 35g protein · taco night unlocked', tag: 'planner pick' },
];

export function NourishDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % MEALS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const meal = MEALS[i];
  return (
    <div className="demo-box">
      <div className="demo-label">What the planner serves</div>
      <div className="nourish-demo meal-fade" key={i}>
        <div className="meal-icon" aria-hidden="true"><Icon name={meal.icon} size={34} /></div>
        <div className="meal-info">
          <div className="meal-name">{meal.name}</div>
          <div className="meal-line">{meal.line}</div>
          <span className="meal-tag">{meal.tag}</span>
        </div>
      </div>
    </div>
  );
}
