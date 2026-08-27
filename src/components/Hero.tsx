import { useEffect, useRef, useState } from 'react';
import { LINKS } from '../data';
import Icon from './Icon';

/**
 * The hero board spells the pitch, not just the name.
 *
 * Every click flips the tiles through a split-flap scramble and lands on the
 * next line, then loops back around to the name. Index 0 is always the name,
 * so first paint — and anything that reads the DOM before a click — sees
 * "CHRISTIAN KAMALU".
 *
 * Rows are padded to COLS blank flaps so the board is a fixed grid: the tile
 * size is derived from COLS in styles.css, so the board never reflows
 * mid-flip and never wraps. Adding a longer line means bumping both.
 */
const PHRASES = [
  { lead: 'Hi, I’m', lines: ['CHRISTIAN', 'KAMALU'] },
  { lead: 'What I do —', lines: ['I BUILD', 'WEBSITES'] },
  { lead: 'Who I do it for —', lines: ['PEOPLE AND', 'BUSINESSES'] },
  { lead: 'And how far I take it —', lines: ['DESIGN TO', 'DEPLOY'] },
];

const COLS = 10;
const ROWS = 2;

/** ms between glyph swaps — also the flap keyframe duration in styles.css. */
const TICK_MS = 62;
/** Tile n stops scrambling at this tick, so the board lands left to right. */
const settleAt = (col: number) => 4 + col * 2;
const LAST_TICK = settleAt(COLS - 1);

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Deterministic instead of Math.random: the same (row, col, tick) always
 * yields the same glyph, so a re-render mid-flip can't make a settled-looking
 * tile jump to a different letter. Mixed rather than added — a plain
 * `col * a + tick * b` walks the alphabet in step, and the board visibly
 * scrambles in stripes of the same letter.
 */
function scrambleGlyph(row: number, col: number, tick: number) {
  let h =
    Math.imul(col + 1, 0x27d4eb2d) ^ Math.imul(tick + 1, 0x165667b1) ^ Math.imul(row + 1, 0x9e3779b9);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h ^= h >>> 13;
  return ALPHABET[(h >>> 0) % 26];
}

const pad = (line: string) => line.padEnd(COLS, ' ').slice(0, COLS);

function Tile({
  row,
  col,
  target,
  tick,
}: {
  row: number;
  col: number;
  target: string;
  tick: number | null;
}) {
  const settled = tick === null || tick >= settleAt(col);
  const char = settled ? target : scrambleGlyph(row, col, tick);
  const blank = char === ' ';

  return (
    <span
      className={`tile ${blank ? 'blank' : ''} ${settled ? '' : 'flipping'} ${
        tick !== null && settled ? 'landed' : ''
      }`}
      style={{ ['--delay' as string]: `${(row * COLS + col) * 0.045}s` }}
    >
      {blank ? '' : char}
    </span>
  );
}

export default function Hero() {
  const [phrase, setPhrase] = useState(0);
  // null = never flipped (tiles are showing their mount deal animation).
  // Otherwise the current tick; it stays parked at LAST_TICK once the flip
  // finishes so the `landed` class survives long enough to animate.
  const [tick, setTick] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const flip = () => {
    const next = (phrase + 1) % PHRASES.length;
    window.clearInterval(timer.current);

    // Honour the OS setting per click, so a mid-session change takes effect:
    // no scramble, just swap the words.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhrase(next);
      setTick(LAST_TICK);
      return;
    }

    setPhrase(next);
    setTick(0);
    timer.current = window.setInterval(() => {
      setTick((t) => {
        const at = (t ?? 0) + 1;
        if (at >= LAST_TICK) window.clearInterval(timer.current);
        return Math.min(at, LAST_TICK);
      });
    }, TICK_MS);
  };

  const { lead, lines } = PHRASES[phrase];
  const hint =
    phrase === 0
      ? 'flip the board'
      : phrase === PHRASES.length - 1
        ? 'flip back to the start'
        : 'keep flipping';

  return (
    <header className="hero container" id="top">
      <p className="hero-hello">{lead}</p>
      <h1 className="tile-rows" onClick={flip} title="Flip the board">
        {/* The board is the visible h1, but its text content is a pile of
            single-letter spans — no spaces, no keywords, and it changes on
            every flip. A real text node carries the heading for screen
            readers and for crawlers; it says what the hero says out loud, so
            it is an accessible name, not cloaked keywords. */}
        <span className="sr-only">
          Christian Kamalu &mdash; websites for people and small businesses
        </span>
        <span aria-hidden="true" className="tile-rows-inner">
          {Array.from({ length: ROWS }, (_, row) => (
            <span className="tile-row" key={row}>
              {pad(lines[row]).split('').map((ch, col) => (
                <Tile key={col} row={row} col={col} target={ch} tick={tick} />
              ))}
            </span>
          ))}
        </span>
      </h1>
      <span className="shake-hint">
        <button className="shake-btn" onClick={flip} aria-label="Flip the letter board">
          <Icon name="flip" size={20} />
        </button>
        {hint}
      </span>

      <p className="hero-sub">
        Websites for people &amp; small businesses
        <span className="divider">·</span>
        <span className="accent">Design through deploy</span>
      </p>
      <p className="hero-line">
        I design, build, and ship websites — hand-written, quick to load, and yours
        to own outright. Two client sites are live below, and the games further
        down are playable right on this page.
      </p>

      <div className="hero-ctas">
        <a className="btn btn-primary" href={`mailto:${LINKS.email}`}>Start a project</a>
        {/* The resume used to sit here. A prospective client wants the proof,
            not an employment history — that link lives in the footer now, for
            the rarer visitor who came looking for it. */}
        <a className="btn btn-ghost" href="#projects">See the work</a>
        <a className="btn btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </header>
  );
}
