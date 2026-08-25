import { useState } from 'react';
import { LINKS } from '../data';

function TileRow({ word, offset }: { word: string; offset: number }) {
  return (
    <div className="tile-row">
      {word.split('').map((ch, i) => (
        <span key={i} className="tile" style={{ ['--delay' as string]: `${(offset + i) * 0.045}s` }}>
          {ch}
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  // Bumping the seed re-mounts the tile rows, replaying the staggered
  // deal animation — the "shake" is a fresh deal of the board.
  const [seed, setSeed] = useState(0);
  const shake = () => setSeed((s) => s + 1);

  return (
    <header className="hero container" id="top">
      <p className="hero-hello">Hi, I&rsquo;m</p>
      <h1 className="tile-rows" aria-label="Christian Kamalu" onClick={shake} title="Shake the board">
        <span aria-hidden="true" key={seed} className="tile-rows-inner">
          <TileRow word="CHRISTIAN" offset={0} />
          <TileRow word="KAMALU" offset={9} />
        </span>
      </h1>

      <p className="hero-sub">
        Full-Stack Software Engineer
        <span className="divider">·</span>
        <span className="ai">AI-first</span>
      </p>
      <p className="hero-line">
        I build AI agents, real-time multiplayer games, and the systems around
        them — then ship them. Most of the projects below are live.
        Some of them you can play right on this page.
      </p>

      <div className="hero-ctas">
        <a className="btn btn-primary" href={`mailto:${LINKS.email}`}>Get in touch</a>
        <a className="btn btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="btn btn-ghost" href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
      </div>

      <span className="shake-hint">
        <button className="shake-btn" onClick={shake} aria-label="Shake the letter tiles">🎲</button>
        shake the board
      </span>
    </header>
  );
}
