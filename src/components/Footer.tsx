import { LINKS, SITE } from '../data';
import { useReveal } from '../useReveal';
import Icon from './Icon';

export default function Footer() {
  const [ref, revealCls] = useReveal();
  return (
    <footer className="footer-section container" id="contact">
      <div ref={ref} className={`footer-card ${revealCls}`}>
        <h2>Let&rsquo;s build your site.</h2>
        <p>
          A personal site, something for your business, a rebuild of the one that has
          quietly aged out &mdash; or something with a good deal more behind it. Tell me
          what it needs to do and who it needs to reach, and I&rsquo;ll tell you what it
          takes. No pitch deck required.
        </p>
        {SITE.serviceArea.city && (
          <p className="footer-area">
            Based in {[SITE.serviceArea.city, SITE.serviceArea.region].filter(Boolean).join(', ')}
            {' '}&mdash; working with clients anywhere.
          </p>
        )}
        <div className="footer-links">
          <a className="btn btn-primary" href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          <a className="btn btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="btn btn-ghost" href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>
      <p className="footer-meta">
        © {new Date().getFullYear()} Christian Kamalu · React + Vite on Netlify ·
        built with an AI pair <span className="die-glyph"><Icon name="dice" size={14} /></span>
      </p>
    </footer>
  );
}
