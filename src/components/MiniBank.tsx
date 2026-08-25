import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// Classic pip layouts on a 3x3 grid (indices 0-8, row-major).
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const GRACE_ROLLS = 3;

// Pips carry no text, so the die stays out of the a11y tree entirely — the
// single live region below speaks the faces (and everything else) in prose.
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
 * A pocket-sized turn of Bank with the real ruleset, grace window included:
 * the first 3 rolls can't bust and doubles count their face value; after
 * that, any 1 busts the pot and doubles multiply it. Bank to keep it — the
 * grace window belongs to the round, so only a bust re-arms it.
 */
export default function MiniBank() {
  const [dice, setDice] = useState<[number, number]>([3, 5]);
  const [pot, setPot] = useState(0);
  const [banked, setBanked] = useState(0);
  const [rollNum, setRollNum] = useState(0); // rolls taken this round — banking doesn't reset it
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState(false); // dice start on a seeded face — don't call that a roll
  const [msg, setMsg] = useState<{ kind: 'bust' | 'doubles' | 'banked' | 'grace'; text: string } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    if (flickerRef.current) clearInterval(flickerRef.current);
  }, []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const isBust = !rolling && msg?.kind === 'bust';
  const inGrace = rollNum < GRACE_ROLLS;
  const graceLeft = GRACE_ROLLS - rollNum;

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
      setRolled(true);
      // `pot`/`rollNum` are from the render this roll started in — nothing
      // else can change them mid-roll (both buttons are disabled while rolling).
      if (rollNum < GRACE_ROLLS) {
        // Grace window: no busts, and doubles count face value — not ×2.
        if (a === 1 || b === 1) {
          // The 1 is harmless here, not worthless — it scores its pip like any
          // other face. Every scoring path in this component adds `a + b`.
          const add = a + b;
          setPot(pot + add);
          setMsg({ kind: 'grace', text: `Grace roll — 1s don’t bust yet (+${add})` });
        } else if (a === b) {
          setPot(pot + a + b);
          setMsg({ kind: 'grace', text: `Doubles in the grace window — face value (+${a + b})` });
        } else {
          setPot(pot + a + b);
        }
      } else if (a === 1 || b === 1) {
        setPot(0);
        setRollNum(0); // busting out ends the round — the next one starts in grace
        setMsg({
          kind: 'bust',
          // Rolling on an empty pot (straight after banking) is a common line
          // now, and "the pot is gone" would be a lie there.
          text: pot > 0 ? 'BUST! The pot is gone.' : 'Rolled a 1 — new round, grace window back.',
        });
        return;
      } else if (a === b) {
        const doubled = pot * 2;
        setPot(doubled);
        setMsg({
          kind: 'doubles',
          // Same empty-pot case: ×2 of nothing is nothing, so don't cheer.
          text: pot > 0 ? `DOUBLES! Pot ×2 → ${doubled}` : 'Doubles — but ×2 on an empty pot is still 0.',
        });
      } else {
        setPot(pot + a + b);
      }
      setRollNum(rollNum + 1);
    }, 550);
  };

  const bank = () => {
    if (rolling || pot === 0) return;
    setBanked((s) => s + pot);
    setMsg({ kind: 'banked', text: `Banked ${pot}. Safe!` });
    setPot(0);
    // The grace window belongs to the round, not the pot — don't re-arm it
    // here or three-roll-then-bank would be a risk-free scoring loop. Only a
    // bust (which zeroes `rollNum` above) starts a fresh round.
  };

  // Spoken twin of the scores column: same numbers, but as a sentence. The
  // visible version leans on `·` and `×2`, which screen readers read out as
  // "middle dot" and "multiplication sign" — or skip.
  const spoken = rolling
    ? 'Rolling…'
    : `${rolled ? 'Rolled' : 'Dice show'} ${dice[0]} and ${dice[1]}. Pot ${pot}, banked ${banked}. ` +
      (inGrace
        ? `${graceLeft} safe ${graceLeft === 1 ? 'roll' : 'rolls'} left in the grace window.`
        : 'Past the grace window: a 1 busts the pot, doubles multiply it.');

  return (
    <div className="demo-box bank-demo">
      <div className="demo-label">Playable — one turn of Bank</div>
      <div className="bank-table">
        <Die value={dice[0]} rolling={rolling} bust={isBust && dice[0] === 1} />
        <Die value={dice[1]} rolling={rolling} bust={isBust && dice[1] === 1} />
        {/* Hidden from the a11y tree because `spoken` already carries these
            numbers into the live region — left visible it'd be read twice. */}
        <div className="bank-scores" aria-hidden="true">
          <span className="bank-pot">Pot: {pot}</span>
          <span className="bank-banked">Banked: {banked}</span>
          <span className="bank-roll">
            {inGrace
              ? `grace: ${graceLeft} safe ${graceLeft === 1 ? 'roll' : 'rolls'} left`
              : '1s bust · doubles ×2'}
          </span>
        </div>
      </div>
      {/* One polite region for the whole demo — dice, score and outcome land as
          a single utterance. Three separate regions would talk over each other,
          and `spoken` withholds the faces until `rolling` clears so the 90ms
          flicker isn't narrated face by face.
          The message keeps its own full-width row: inside the narrow scores
          column it wrapped on phones and slid behind the buttons. */}
      <div aria-live="polite" aria-atomic="true">
        <span className="sr-only">{spoken}</span>
        <span className={`bank-msg ${msg?.kind ?? ''}`}>{msg?.text ?? ' '}</span>
      </div>
      <div className="bank-actions">
        <button className="mini-btn" onClick={roll} disabled={rolling}>
          {rolling ? 'Rolling…' : <>Roll <Icon name="dice" size={14} /></>}
        </button>
        <button className="mini-btn secondary" onClick={bank} disabled={rolling || pot === 0}>
          Bank it
        </button>
      </div>
    </div>
  );
}
