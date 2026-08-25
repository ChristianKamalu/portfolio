import { PROJECTS, type Project } from '../data';
import { useHighlight } from '../HighlightContext';
import { useReveal } from '../useReveal';
import Icon from './Icon';
import MiniBank from './MiniBank';
import MiniBoggle from './MiniBoggle';
import { BleDemo, NourishDemo } from './MiniDemos';

function Demo({ kind }: { kind: NonNullable<Project['demo']> }) {
  switch (kind) {
    case 'bank': return <MiniBank />;
    case 'boggle': return <MiniBoggle />;
    case 'ble': return <BleDemo />;
    case 'nourish': return <NourishDemo />;
  }
}

function ProjectCard({ project }: { project: Project }) {
  const { hoveredSkill, setHoveredSkill } = useHighlight();
  const [ref, revealCls] = useReveal<HTMLElement>();
  const lit = hoveredSkill !== null && project.tech.includes(hoveredSkill);
  const dimmed = hoveredSkill !== null && !lit;

  return (
    <article ref={ref} className={`project-card ${revealCls} ${lit ? 'lit' : ''} ${dimmed ? 'dimmed' : ''}`}>
      <div className="project-head">
        <div>
          <h3 className="project-name">{project.name}</h3>
          <p className="project-tagline">{project.tagline}</p>
        </div>
        {project.status ? (
          <span className={`badge ${project.status === 'Retired' ? 'retired' : 'wip'}`}>
            {project.status !== 'Retired' && <span className="pulse-dot" />}
            {project.status}
          </span>
        ) : project.link ? (
          <span className="badge"><span className="pulse-dot" />Live</span>
        ) : null}
      </div>

      <p className="project-desc">{project.description}</p>

      {project.demo && <Demo kind={project.demo} />}

      <div className="tech-row">
        {project.tech.map((t) => (
          <span
            key={t}
            className={`tech-chip ${hoveredSkill === t ? 'hot' : ''}`}
            onMouseEnter={() => setHoveredSkill(t)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            {t}
          </span>
        ))}
      </div>

      {project.link && (
        <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
          {project.linkLabel ?? 'Visit'}
          <Icon name="arrow" size={15} className="project-link-arrow" />
        </a>
      )}
    </article>
  );
}

export default function Projects() {
  const [ref, revealCls] = useReveal();
  return (
    <section id="projects" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">Projects</p>
        <h2 className="section-heading">Don&rsquo;t just read about them — play them.</h2>
        <p className="projects-hint">
          The green dot means it&rsquo;s deployed and live right now. The dashed boxes are playable.
        </p>
      </div>
      <div className="project-grid">
        {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
