import { CLIENT_SITES, PROJECTS, type Project } from '../data';
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
  const { highlightedSkill, pinnedSkill, hoverSkill, togglePin, clearPin } = useHighlight();
  const [ref, revealCls] = useReveal<HTMLElement>();
  const lit = highlightedSkill !== null && project.tech.includes(highlightedSkill);
  const dimmed = highlightedSkill !== null && !lit;

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
          <button
            type="button"
            key={t}
            className={`tech-chip ${highlightedSkill === t ? 'hot' : ''}`}
            aria-pressed={pinnedSkill === t}
            aria-label={`${t} — highlight the projects that use it`}
            // Pointer events, not mouse events: a tap reports `touch` here, so a
            // finger never sets the hover state that iOS would then refuse to
            // clear. Click alone drives touch, and it toggles, so a second tap
            // always releases it.
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') hoverSkill(t); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') hoverSkill(null); }}
            // Only a *keyboard* focus previews. Safari doesn't focus a button on
            // tap, but a browser that did would otherwise re-open the same hole
            // the pointer-type check just closed.
            onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) hoverSkill(t); }}
            onBlur={() => hoverSkill(null)}
            onClick={() => togglePin(t)}
            onKeyDown={(e) => { if (e.key === 'Escape') clearPin(); }}
          >
            {t}
          </button>
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
  const [labRef, labRevealCls] = useReveal();
  return (
    <section id="projects" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">Client work</p>
        <h2 className="section-heading">Sites I&rsquo;ve built for other people.</h2>
        <p className="projects-hint">
          Both are live right now &mdash; the green dot means deployed. Yours could be next.
        </p>
      </div>
      <div className="project-grid">
        {CLIENT_SITES.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>

      <div ref={labRef} className={`${labRevealCls} project-group-break`}>
        <p className="section-title">The workshop</p>
        <h2 className="section-heading">And what I build when nobody&rsquo;s asking.</h2>
        <p className="projects-hint">
          Where the techniques come from. The dashed boxes are playable, right here on the page.
        </p>
      </div>
      <div className="project-grid">
        {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
