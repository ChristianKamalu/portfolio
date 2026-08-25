import { LINKS } from '../data';
import { useReveal } from '../useReveal';

export default function Footer() {
  const ref = useReveal();
  return (
    <footer className="footer-section container" id="contact">
      <div ref={ref} className="footer-card reveal">
        <h2>Let&rsquo;s build something.</h2>
        <p>
          Whether it&rsquo;s an AI agent that needs to behave, a multiplayer lobby that
          needs to not fall over, or a product that just needs to ship — I&rsquo;m in.
        </p>
        <div className="footer-links">
          <a className="btn btn-primary" href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          <a className="btn btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
      <p className="footer-meta">
        © {new Date().getFullYear()} Christian Kamalu · React + Vite on Netlify ·
        built with an AI pair <span className="die-glyph">🎲</span>
      </p>
    </footer>
  );
}
