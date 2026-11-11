import { useEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';

/* ── Foilet: the listening radius, live. The puck sits in the middle, this
   phone wanders around it (or goes where you drag it), and the slider grows
   or shrinks the boundary — inside it the phone is blocked, outside it is
   not. Straight down from above: the puck face on — a white disc with
   its rolled edge, the brand mark and the name on its roof — and the
   rings as plain circles around it. No signal numbers. ── */
const RADIUS_MIN = 6;
const RADIUS_MAX = 10;
const RADIUS_STANDARD = 8;

/* The map's own space. */
const MAP_W = 360;
const MAP_H = 250;
const MAP_CX = 180;
const MAP_CY = 125;
/** Boundary radius per slider stop, in floor units. */
const boundaryFor = (t: number) => 36 + (t - RADIUS_MIN) * 20;
const BOUNDARY_MAX = boundaryFor(RADIUS_MAX);
/** Where the phone starts, in floor units — outside, so first paint reads
    as "not blocked". */
const PHONE_START = { x: 118, y: -52 };
/** How long a drag keeps the wander paused, ms. */
const DRAG_HOLD_MS = 4000;

/* The puck from above: a 50 mm disc, drawn at this radius. */
const PUCK_R = 27;
const BRAND_BLUE = '#3b86f7';

/** A slow figure that crosses in and out of every boundary size. */
function wander(ms: number) {
  const t = ms / 1000;
  return {
    x: 142 * Math.sin(0.34 * t),
    y: 98 * Math.sin(0.47 * t + 1.1),
  };
}

/** The Foilet mark — the broadcasting padlock, from brand/foilet-mark.svg. */
function FoiletMark({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <svg x={x} y={y} width={width} height={width / 1.56} viewBox="88 162 507 325">
      <g transform="translate(0,683) scale(0.1,-0.1)" fill={BRAND_BLUE} stroke="none">
        <g transform="translate(3415 3210) scale(1.45) translate(-3415 -3210)">
          <path d="M3283 4475 c-173 -47 -311 -176 -371 -349 -22 -64 -25 -93 -31 -280 -6 -209 -6 -209 -61 -227 -65 -21 -114 -69 -130 -128 -7 -28 -10 -196 -8 -523 3 -545 1 -527 86 -580 37 -23 37 -23 647 -23 610 0 610 0 647 23 86 53 83 32 83 602 0 458 -2 508 -17 536 -22 40 -72 82 -106 90 -72 17 -72 16 -72 207 0 266 -33 376 -151 501 -128 137 -339 198 -516 151z m258 -171 c105 -41 192 -136 223 -243 24 -81 23 -403 -1 -422 -25 -21 -672 -20 -697 0 -16 13 -17 34 -14 210 3 188 4 198 30 253 85 182 285 270 459 202z" />
        </g>
        <g fill="none" stroke={BRAND_BLUE} strokeWidth="230" strokeLinecap="round">
          <path d="M1929 4728 A1750 1750 0 0 1 1929 2872" />
          <path d="M1378 5072 A2400 2400 0 0 1 1378 2528" />
          <path d="M4897 4728 A1750 1750 0 0 0 4897 2872" />
          <path d="M5448 5072 A2400 2400 0 0 0 5448 2528" />
        </g>
      </g>
    </svg>
  );
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
    const sx = ((e.clientX - rect.left) / rect.width) * MAP_W;
    const sy = ((e.clientY - rect.top) / rect.height) * MAP_H;
    lastDrag.current = performance.now();
    setPhone({
      x: Math.max(-MAP_CX + 10, Math.min(MAP_CX - 10, sx - MAP_CX)),
      y: Math.max(-MAP_CY + 12, Math.min(MAP_H - MAP_CY - 12, sy - MAP_CY)),
    });
  };

  const boundary = boundaryFor(tolerance);
  const inside = Math.hypot(phone.x, phone.y) <= boundary;
  const ringStyle = { ['--ring' as string]: boundary / BOUNDARY_MAX };
  const phoneScreen = { x: MAP_CX + phone.x, y: MAP_CY + phone.y };

  const phoneNode = (
    <g className={`radius-phone ${inside ? 'blocked' : ''}`} transform={`translate(${phoneScreen.x} ${phoneScreen.y})`}>
      <circle r="13" className="radius-phone-halo" />
      <rect x="-5" y="-8.5" width="10" height="17" rx="2.5" className="radius-phone-body" />
      <rect x="-3" y="-6" width="6" height="10" rx="1" className="radius-phone-screen" />
    </g>
  );

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
          aria-label="A map from above: the Foilet in the middle, this phone moving around it, and the listening radius as a circle. Drag to move the phone."
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); place(e); }}
          onPointerMove={(e) => { if (dragging) place(e); }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <defs>
            {/* One soft rolled edge: white across the roof, shading at the rim. */}
            <radialGradient id="radius-puck-shade" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.78" stopColor="#ffffff" />
              <stop offset="0.92" stopColor="#e4e8ef" />
              <stop offset="1" stopColor="#b9c0cc" />
            </radialGradient>
          </defs>
          {/* Range rings, for scale. */}
          {[50, 100, 150].map((r) => (
            <circle key={r} className="radius-range" cx={MAP_CX} cy={MAP_CY} r={r} />
          ))}
          {/* The boundary, drawn at its widest and scaled from the puck. */}
          <g className="radius-ring" style={ringStyle}>
            <circle className="radius-fill" cx={MAP_CX} cy={MAP_CY} r={BOUNDARY_MAX} />
            <circle className="radius-stroke" cx={MAP_CX} cy={MAP_CY} r={BOUNDARY_MAX} />
          </g>
          {/* The puck, face on: the white disc, the mark, the name. */}
          <g className="radius-puck">
            <circle cx={MAP_CX} cy={MAP_CY + 3} r={PUCK_R + 2} className="radius-shadow" />
            <circle cx={MAP_CX} cy={MAP_CY} r={PUCK_R} fill="url(#radius-puck-shade)" />
            <FoiletMark x={MAP_CX - 12} y={MAP_CY - 18} width={24} />
            <text x={MAP_CX} y={MAP_CY + 11} className="radius-puck-name" textAnchor="middle">Foilet</text>
          </g>
          {phoneNode}
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
          The phone is you. Inside the boundary it&rsquo;s blocked. Drag it around, and widen
          or tighten the boundary until it&rsquo;s where you want it. Everyone who uses the
          device sets their own.
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
