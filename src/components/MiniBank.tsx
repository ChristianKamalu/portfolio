import { useEffect, useRef, useState } from 'react';

// Classic pip layouts on a 3x3 grid (indices 0-8, row-major).
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Die({ value, rolling, bust }: { value: number; rolling: boolean; bust: boolean }) {
  const on = PIPS[value] ?? [];
  return (
    <div className={`die ${rolling ? 'rolling' : ''} ${bust ? 'bust-face' : ''}`} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`pip ${on.includes(i) ? 'on' : ''}`} />
      ))}
    </div>
  );
}

/**
 * A pocket-sized round of Bank: roll to grow the pot, any 1 busts it,
 * doubles double it, bank to keep it — the real game's two-dice ruleset.
 */
export default function MiniBank() {
  const [dice, setDice] = useState<[number, number]>([3, 5]);
  const [pot, setPot] = useState(0);
  const [banked, setBanked] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'bust' | 'doubles' | 'banked'; text: string } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    if (flickerRef.current) clearInterval(flickerRef.current);
  }, []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const isBust = !rolling && msg?.kind === 'bust';

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    setMsg(null);
    // flicker faces while "rolling"
    const flicker = setInterval(() => {
      setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)] as [number, number]);
    }, 90);
    flickerRef.current = flicker;
    later(() => {
      clearInterval(flicker);
      const a = 1 + Math.floor(Math.random() * 6);
      const b = 1 + Math.floor(Math.random() * 6);
      setDice([a, b]);
      setRolling(false);
      // `pot` is the value from the render this roll started in — nothing
      // else can change it mid-roll (both buttons are disabled while rolling).
      if (a === 1 || b === 1) {
        setPot(0);
        setMsg({ kind: 'bust', text: 'BUST! The pot is gone.' });
      } else if (a === b) {
        const doubled = pot * 2;
        setPot(doubled);
        setMsg({
          kind: 'doubles',
          text: doubled === 0 ? 'Doubles… of nothing. Roll on!' : `DOUBLES! Pot ×2 → ${doubled}`,
        });
      } else {
        setPot(pot + a + b);
      }
    }, 550);
  };

  const bank = () => {
    if (rolling || pot === 0) return;
    setBanked((s) => s + pot);
    setMsg({ kind: 'banked', text: `Banked ${pot}. Safe!` });
    setPot(0);
  };

  return (
    <div className="demo-box bank-demo">
      <div className="demo-label">Playable — one turn of Bank</div>
      <div className="bank-table">
        <Die value={dice[0]} rolling={rolling} bust={isBust && dice[0] === 1} />
        <Die value={dice[1]} rolling={rolling} bust={isBust && dice[1] === 1} />
        <div className="bank-scores">
          <span className="bank-pot">Pot: {pot}</span>
          <span className="bank-banked">Banked: {banked}</span>
        </div>
      </div>
      {/* Own full-width row — inside the narrow scores column this wrapped on
          phones and slid behind the buttons (fixed-height overflow). */}
      <span className={`bank-msg ${msg?.kind ?? ''}`}>{msg?.text ?? ' '}</span>
      <div className="bank-actions">
        <button className="mini-btn" onClick={roll} disabled={rolling}>
          {rolling ? 'Rolling…' : 'Roll 🎲'}
        </button>
        <button className="mini-btn secondary" onClick={bank} disabled={rolling || pot === 0}>
          Bank it
        </button>
      </div>
    </div>
  );
}
