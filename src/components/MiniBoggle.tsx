import { useEffect, useRef, useState } from 'react';

// A fixed board seeded with real findable words (adjacent incl. diagonals).
const BOARD = [
  ['S', 'H', 'I', 'P'],
  ['T', 'O', 'N', 'E'],
  ['A', 'R', 'M', 'G'],
  ['C', 'K', 'E', 'D'],
];

// Every word below is traceable on the board above (verified by DFS).
const WORDS = new Set([
  'SHIP', 'SHOT', 'SHONE', 'SHORN', 'HONE', 'HORN', 'THORN', 'TONE', 'TORN',
  'STAR', 'STACK', 'TRACK', 'CAT', 'RAT', 'TAR', 'ART', 'OAR', 'ARM',
  'GEM', 'EDGE', 'HOT', 'TON', 'NOT', 'ROT', 'ONE',
]);

type Pos = { r: number; c: number };
const key = (p: Pos) => `${p.r},${p.c}`;
const adjacent = (a: Pos, b: Pos) =>
  Math.abs(a.r - b.r) <= 1 && Math.abs(a.c - b.c) <= 1 && !(a.r === b.r && a.c === b.c);

/**
 * Trace adjacent tiles to spell a hidden word, then claim it. Claiming is
 * explicit — auto-claiming on first match would make TONE unreachable
 * because TON claims first.
 */
export default function MiniBoggle() {
  const [path, setPath] = useState<Pos[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [flashOk, setFlashOk] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const word = path.map((p) => BOARD[p.r][p.c]).join('');
  const claimable = word.length >= 3 && WORDS.has(word) && !found.includes(word);

  const tap = (pos: Pos) => {
    if (flashOk) return;
    const idx = path.findIndex((p) => p.r === pos.r && p.c === pos.c);
    if (idx !== -1) {
      // tapping a picked tile trims the path back to it (tap last = undo)
      setPath(path.slice(0, idx === path.length - 1 ? -1 : idx + 1));
      return;
    }
    const last = path[path.length - 1];
    if (!last || adjacent(last, pos)) {
      setPath([...path, pos]);
    } else {
      // non-adjacent tile starts a fresh path from there
      setPath([pos]);
    }
  };

  const claim = () => {
    if (!claimable || flashOk) return;
    setFlashOk(true);
    timer.current = setTimeout(() => {
      setFound((f) => [...f, word]);
      setPath([]);
      setFlashOk(false);
    }, 600);
  };

  const picked = new Set(path.map(key));

  return (
    <div className="demo-box">
      <div className="demo-label">Playable — {WORDS.size} words hide in this board</div>
      <div className="boggle-demo">
        <div className="boggle-grid" role="group" aria-label="Mini Boggle board">
          {BOARD.map((row, r) =>
            row.map((letter, c) => {
              const p = { r, c };
              const inPath = picked.has(key(p));
              return (
                <button
                  key={key(p)}
                  className={`bog-tile ${inPath ? 'picked' : ''} ${inPath && flashOk ? 'flash-ok' : ''}`}
                  onClick={() => tap(p)}
                  aria-label={`Tile ${letter}`}
                >
                  {letter}
                </button>
              );
            })
          )}
        </div>
        <div className="boggle-side">
          <span className={`boggle-word ${claimable || flashOk ? 'ok' : ''}`}>{word || ' '}</span>
          {claimable && !flashOk && (
            <button className="mini-btn claim-btn" onClick={claim}>
              ✓ Claim {word}
            </button>
          )}
          {found.length > 0 ? (
            <span className="boggle-found">
              Found <b>{found.length}</b>: {found.join(', ')}
            </span>
          ) : (
            <span className="boggle-hint">Tap adjacent tiles — try S→H→I→P</span>
          )}
          {path.length > 0 && !flashOk && (
            <button className="boggle-clear" onClick={() => setPath([])}>
              clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
