import { SUMMARY } from '../data';
import Icon from './Icon';
import { useReveal } from '../useReveal';

export default function About() {
  const [ref, revealCls] = useReveal();
  return (
    <section id="about" className="container">
      <div ref={ref} className={revealCls}>
        <p className="section-title">About</p>
        <h2 className="section-heading">I build websites.</h2>
        <div className="about-grid">
          <div className="headshot-frame">
            <img src="/headshot.jpg" alt="Christian Kamalu" width={720} height={900} />
          </div>
          <div className="about-text">
            <p>{SUMMARY}</p>
            <p>
              You get <strong>one person, start to finish</strong> — the first sketch, the
              copy, the build, the domain, the forms that land in your inbox, and
              the handoff that leaves you able to change your own words. No
              agency layers, no template you&rsquo;ll outgrow, no monthly rent on
              your own website.
            </p>
            <p>
              And if it turns out you need more than a site &mdash; accounts, a database,
              a booking flow, an integration with something you already run &mdash;
              that&rsquo;s the same job at a different size. Say so early and I&rsquo;ll
              scope it.
            </p>
            <ul className="now-list">
              <li><span className="spark"><Icon name="caret" size={11} /></span> Taking on website work — personal sites, small business, and rebuilds of sites that have aged out</li>
              <li><span className="spark"><Icon name="caret" size={11} /></span> Recently shipped: thetoddharris.com and buildingstrongwomen.com</li>
              <li><span className="spark"><Icon name="caret" size={11} /></span> Always: an LLM in the loop — it&rsquo;s how this site got built, too</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
