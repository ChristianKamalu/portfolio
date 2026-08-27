import { SKILLS } from '../data';
import { useReveal } from '../useReveal';

/**
 * Read-only. These chips used to drive the project cross-highlight, but the
 * cards they light up sit ~800px above this section — the payoff happened
 * off-screen, and `onMouseEnter` never fires on touch at all. Each project
 * card already lists its own tech.
 */
export default function Skills() {
  const [ref, revealCls] = useReveal();
  return (
    <section id="skills" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">Skills</p>
        <h2 className="section-heading">The toolbox.</h2>
        <div className="skill-groups">
          {SKILLS.map((group) => (
            <div className="skill-group" key={group.label}>
              <span className="skill-group-label">{group.label}</span>
              <div className="skill-chips">
                {group.skills.map((s) => (
                  <span key={s} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
