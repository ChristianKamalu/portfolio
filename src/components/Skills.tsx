import { SKILLS } from '../data';
import { useHighlight } from '../HighlightContext';
import { useReveal } from '../useReveal';

export default function Skills() {
  const { hoveredSkill, setHoveredSkill } = useHighlight();
  const [ref, revealCls] = useReveal();
  return (
    <section id="skills" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">Skills</p>
        <h2 className="section-heading">The toolbox.</h2>
        <p className="skills-hint">Hover a skill to light up the projects it powers.</p>
        <div className="skill-groups">
          {SKILLS.map((group) => (
            <div className="skill-group" key={group.label}>
              <span className="skill-group-label">{group.label}</span>
              <div className="skill-chips">
                {group.skills.map((s) => (
                  <span
                    key={s}
                    className={`skill-chip ${hoveredSkill === s ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSkill(s)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
