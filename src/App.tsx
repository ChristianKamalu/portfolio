import type { MouseEvent } from 'react';
import { HighlightProvider } from './HighlightContext';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Footer from './components/Footer';

// Smooth-scroll only for nav anchor clicks. A global CSS `scroll-behavior:
// smooth` would also animate find-in-page, focus jumps, and history
// restores — this keeps those instant.
function smoothAnchor(e: MouseEvent<HTMLElement>) {
  const link = (e.target as HTMLElement).closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href')!);
  if (!target) return;
  e.preventDefault();
  // An explicit `behavior` beats the reduced-motion block in styles.css —
  // browsers only relax the CSS `scroll-behavior` property. Read the pref per
  // click so a mid-session OS change takes effect immediately.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  history.replaceState(null, '', link.getAttribute('href')!);
}

export default function App() {
  return (
    <HighlightProvider>
      <nav className="nav" onClick={smoothAnchor}>
        <div className="nav-inner">
          <a className="nav-logo" href="#top" aria-label="Back to top">CK</a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a className="nav-cta" href="#contact">Contact</a>
          </div>
        </div>
      </nav>
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
      </main>
      <Footer />
    </HighlightProvider>
  );
}
