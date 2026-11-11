import { useEffect, useState } from 'react';
import Icon, { type IconName } from './Icon';

/* ── Foilet: the app's "Listening radius" page, redrawn. A toilet with the
   radius as a disk on the floor — the ring passes behind the tank and in
   front of the bowl — and the same Tighter / Standard / Wider slider. The
   metres come from the app's own curve (an illustration there too, not a
   measurement). Outcomes only: no signal numbers, no part names. ── */
const RADIUS_MIN = 6;
const RADIUS_MAX = 10;
const RADIUS_STANDARD = 8;
/** 0.45 m at the tight end, 1.2 m at the wide end — the app's curve. */
const metres = (t: number) => 0.45 * Math.pow(10, (t - RADIUS_MIN) / 9.4);
const SCALE_MAX = metres(RADIUS_MAX);

/* The drawing's own space. The floor disk is centred on the toilet's base
   and squashed to half height, as a disk on a floor reads from standing. */
const CX = 180;
const CY = 160;
const PX_PER_METRE = 104;

export function RadiusDemo() {
  const [tolerance, setTolerance] = useState(RADIUS_STANDARD);
  const r = metres(tolerance) / SCALE_MAX; // 0..1 of the widest ring
  const ringStyle = { ['--ring' as string]: r };

  return (
    <div className="demo-box">
      <div className="demo-label">Listening radius — this phone's, per device</div>
      <div className="radius-demo">
        <svg
          className="radius-art"
          viewBox="0 0 360 230"
          role="img"
          aria-label="A toilet with this phone's listening radius drawn as a ring on the floor around it"
        >
          <defs>
            <clipPath id="radius-front">
              <rect x="-20" y={CY} width="400" height="120" />
            </clipPath>
          </defs>
          {/* The disk and the back half of the ring, behind the toilet. */}
          <g className="radius-ring" style={ringStyle}>
            <ellipse className="radius-fill" cx={CX} cy={CY} rx={PX_PER_METRE * SCALE_MAX} ry={PX_PER_METRE * SCALE_MAX * 0.5} />
            <ellipse className="radius-stroke" cx={CX} cy={CY} rx={PX_PER_METRE * SCALE_MAX} ry={PX_PER_METRE * SCALE_MAX * 0.5} />
          </g>
          {/* The toilet: tank, lid, bowl, pedestal. Drawn once, in the
              site's own greys, rather than the app's render. */}
          <g className="radius-toilet">
            <rect x="148" y="46" width="64" height="10" rx="3" className="radius-tank-lid" />
            <rect x="152" y="56" width="56" height="58" rx="5" className="radius-tank" />
            <rect x="158" y="63" width="12" height="3" rx="1.5" className="radius-lever" />
            <path d="M152 124 C152 150 166 160 180 160 C194 160 208 150 208 124 Z" className="radius-bowl" />
            <ellipse cx="180" cy="122" rx="30" ry="11" className="radius-seat" />
            <ellipse cx="180" cy="121" rx="22" ry="7" className="radius-seat-inner" />
            <path d="M170 156 L190 156 L194 172 L166 172 Z" className="radius-pedestal" />
            <ellipse cx="180" cy="172" rx="16" ry="5" className="radius-base" />
          </g>
          {/* The front half of the ring, over the bowl. */}
          <g clipPath="url(#radius-front)">
            <g className="radius-ring" style={ringStyle}>
              <ellipse className="radius-stroke" cx={CX} cy={CY} rx={PX_PER_METRE * SCALE_MAX} ry={PX_PER_METRE * SCALE_MAX * 0.5} />
            </g>
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
          Inside the ring, this phone gets blocked. Everyone who uses the device sets their own.
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
