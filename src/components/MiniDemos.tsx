import { useEffect, useState } from 'react';
import Icon, { type IconName } from './Icon';

/* ── BLE: a beacon chip advertising on a slow interval ── */
export function BleDemo() {
  const [packets, setPackets] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPackets((n) => n + 1), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="demo-box">
      <div className="demo-label">Live-ish — advertising every 2.4s</div>
      <div className="ble-demo">
        <div className="ble-stage" aria-hidden="true">
          <span className="ble-ring" style={{ ['--ring-delay' as string]: '0s' }} />
          <span className="ble-ring" style={{ ['--ring-delay' as string]: '0.35s' }} />
          <div className="ble-chip">CC2340</div>
        </div>
        <div className="ble-readout">
          <div>state: <span className="sleep">deep sleep</span> → <span className="val">ADV</span></div>
          <div>packets sent: <span className="val">{packets}</span></div>
          <div>battery budget: <span className="val">5+ years</span></div>
        </div>
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
