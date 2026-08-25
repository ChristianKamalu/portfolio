import { EXPERIENCE } from '../data';
import { useReveal } from '../useReveal';

export default function Experience() {
  const [ref, revealCls] = useReveal();
  return (
    <section id="experience" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">Experience</p>
        <h2 className="section-heading">Where I&rsquo;ve shipped.</h2>
        <div className="timeline">
          {EXPERIENCE.map((job) => (
            <div className="job" key={job.company}>
              <div className="job-head">
                <span className="job-company">{job.company}</span>
                <span className="job-period">{job.period}</span>
              </div>
              <p className="job-title">{job.title}</p>
              <ul>
                {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
