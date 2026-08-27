import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { LINKS, SITE } from './src/data';

/**
 * Writes the JSON-LD graph into index.html at build time, from the constants
 * in src/data.ts.
 *
 * Build time rather than runtime on purpose: this is a client-rendered SPA, so
 * anything the React tree renders is invisible to a crawler that does not run
 * JS. Structured data is exactly the payload that has to survive that, so it
 * ships as static markup in the served HTML.
 */
function structuredData(): Plugin {
  const { url, name, jobTitle, description, serviceArea, services } = SITE;
  const id = (fragment: string) => `${url}/#${fragment}`;

  // Home city first, then the rest of the region, then national. An empty
  // city must not become an empty City node — a blank `name` is a schema
  // error, and a wrong one is worse than none. See SITE in data.ts.
  const areaServed: Record<string, unknown>[] = [];
  if (serviceArea.city) {
    areaServed.push({
      '@type': 'City',
      name: serviceArea.city,
      ...(serviceArea.region
        ? { containedInPlace: { '@type': 'State', name: serviceArea.region } }
        : {}),
    });
    for (const p of serviceArea.alsoServes) {
      areaServed.push({ '@type': p.type, name: p.name });
    }
  }
  areaServed.push({ '@type': 'Country', name: serviceArea.country });

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url,
        name,
        description,
        inLanguage: 'en-US',
        publisher: { '@id': id('person') },
      },
      {
        '@type': 'Person',
        '@id': id('person'),
        name,
        url,
        jobTitle,
        description,
        email: `mailto:${LINKS.email}`,
        image: `${url}/headshot.jpg`,
        sameAs: [LINKS.github, LINKS.linkedin],
        // Websites are the lead offer, but the entity is a full-stack
        // engineer — leaving the back end out here would understate what the
        // person actually is. Not visible copy, so naming the full range
        // costs nothing in focus.
        knowsAbout: [
          'Web design',
          'Web development',
          'Full-stack development',
          'Small business websites',
          'Personal websites',
          'React',
          'TypeScript',
          'Astro',
          'Node.js',
          'PostgreSQL',
          'React Native',
          'LLM integration',
          'Responsive design',
          'Web accessibility',
          'Search engine optimization',
        ],
      },
      {
        '@type': 'Service',
        '@id': id('service'),
        name: 'Website design and development',
        serviceType: 'Web design and development',
        description,
        provider: { '@id': id('person') },
        areaServed,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Website design and development',
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.name, description: s.description },
          })),
        },
      },
    ],
  };

  // A city has to move the <title> and the meta description too, not just the
  // structured data. The title is the strongest local signal on the page, and
  // a title that disagreed with `areaServed` would be the worst of both.
  //
  // The title takes city + state and drops the trailing name: Google shows
  // roughly 60 characters, and the local phrase has to survive the cut. The
  // longer regional phrasing goes in the description, which gets more room.
  const titlePlace = [serviceArea.city, serviceArea.region].filter(Boolean).join(', ');
  const descPlace = serviceArea.label || titlePlace;

  // Copy is authored in data.ts as plain text, so anything spliced into markup
  // has to be escaped here — an unescaped `&` in a title or a content=""
  // attribute is invalid HTML that browsers only silently tolerate.
  const esc = (t: string) =>
    t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Google renders roughly 160 characters of a description; past that the
  // sentence that closes the pitch is the part that gets cut. Composed rather
  // than string-patched so the length is checkable, and hard-failed rather
  // than warned so a long `label` can't quietly truncate in the SERP.
  const localDescription =
    `Websites for people and small businesses in ${descPlace}. Personal sites, ` +
    'small business sites, and rebuilds — hand-written and fast.';

  if (serviceArea.city && localDescription.length > 160) {
    throw new Error(
      `Meta description is ${localDescription.length} characters (max 160). ` +
        'Shorten SITE.serviceArea.label in src/data.ts, or this template above.',
    );
  }

  return {
    name: 'portfolio-structured-data',
    transformIndexHtml(html: string) {
      const out = serviceArea.city
        ? html
            .replace(
              /<title>[^<]*<\/title>/,
              `<title>Freelance Web Designer in ${esc(titlePlace)} — Personal &amp; Small Business Websites</title>`,
            )
            .replace(
              // `\s*` spans the newline and indentation between the meta's
              // attributes, which are on separate lines in index.html.
              /(name="description"\s*content=")[^"]*"/,
              `$1${esc(localDescription)}"`,
            )
        : html;

      return {
        html: out,
        tags: [
          {
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            // `<` escaped so a stray "</script>" in future copy cannot close
            // the tag early. JSON parsers read < identically.
            children: JSON.stringify(graph).replace(/</g, '\\u003c'),
            injectTo: 'head',
          },
        ],
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), structuredData()],
});
