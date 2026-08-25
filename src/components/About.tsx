import { SUMMARY } from '../data';
import Icon from './Icon';
import { useReveal } from '../useReveal';

export default function About() {
  const [ref, revealCls] = useReveal();
  return (
    <section id="about" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">About</p>
        <h2 className="section-heading">Engineer, shipping daily.</h2>
        <div className="about-grid">
          <div className="headshot-frame">
            <img src="/headshot.jpg" alt="Christian Kamalu" width={720} height={900} />
          </div>
          <div className="about-text">
            <p>{SUMMARY}</p>
            <p>
              The through-line: <strong>I like owning things end to end</strong> — from a
              Firestore document schema to the lobby UX built on it, from an LLM
              prompt to the eval that keeps it honest, from bare-metal firmware
              to the app store build that talks to it.
            </p>
            <ul className="now-list">
              <li><span className="spark"><Icon name="caret" size={11} /></span> Currently: open to my next role — let&rsquo;s talk</li>
              <li><span className="spark"><Icon name="caret" size={11} /></span> Meanwhile: heads-down on NourishAI, a BLE beacon, and multiplayer games</li>
              <li><span className="spark"><Icon name="caret" size={11} /></span> Always: an LLM in the loop — it&rsquo;s how this site got built, too</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
